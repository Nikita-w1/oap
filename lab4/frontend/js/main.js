import { create, getById, getList, remove, update } from "./apiClient.js";
import { clearFieldErrors, clearNotice, el, renderDetails, renderListStatus, renderTable, showFieldError, showNotice } from "./ui.js";
const state = {
    items: [],
    editingId: null,
    query: {
        search: "",
        type: "",
        sortBy: "createdAt",
        sortDir: "desc",
        page: 1,
        pageSize: 10,
    },
};
const form = el("form");
const formTitle = el("formTitle");
const submitBtn = el("submitBtn");
const cancelEditBtn = el("cancelEdit");
const reloadBtn = el("reloadBtn");
const searchInput = el("searchInput");
const filterType = el("filterType");
const sortBy = el("sortBy");
const sortDir = el("sortDir");
const tableBody = el("tableBody");
const titleInput = el("title");
const urlInput = el("url");
const typeInput = el("type");
const descInput = el("desc");
const authorInput = el("author");
function normalizeError(e) {
    if (typeof e === "object" && e !== null && "status" in e)
        return e;
    return { status: 0, message: e instanceof Error ? e.message : String(e) };
}
function readForm() {
    return {
        title: titleInput.value.trim(),
        url: urlInput.value.trim(),
        type: typeInput.value,
        description: descInput.value.trim(),
        author: authorInput.value.trim(),
    };
}
function validate(dto) {
    clearFieldErrors();
    let valid = true;
    if (dto.title.length < 3) {
        showFieldError("title", "titleError", "Назва обовʼязкова, мінімум 3 символи.");
        valid = false;
    }
    if (!dto.url.startsWith("http") || dto.url.length < 8) {
        showFieldError("url", "urlError", "URL має починатися з http або https.");
        valid = false;
    }
    if (!dto.type) {
        showFieldError("type", "typeError", "Оберіть тип ресурсу.");
        valid = false;
    }
    if (dto.description.length < 5) {
        showFieldError("desc", "descError", "Опис обовʼязковий, мінімум 5 символів.");
        valid = false;
    }
    if (dto.author.length < 2) {
        showFieldError("author", "authorError", "Автор обовʼязковий, мінімум 2 символи.");
        valid = false;
    }
    return valid;
}
async function loadResources() {
    renderListStatus("loading");
    renderTable([]);
    clearNotice();
    try {
        const result = await getList(state.query);
        state.items = result.data ?? [];
        renderTable(state.items);
        renderDetails(null);
        renderListStatus(state.items.length ? "success" : "empty");
    }
    catch (e) {
        const err = normalizeError(e);
        state.items = [];
        renderTable([]);
        renderListStatus("error", err);
        showNotice(`Не вдалося завантажити список: ${err.message}`, true);
    }
}
async function onSubmit(event) {
    event.preventDefault();
    const dto = readForm();
    if (!validate(dto))
        return;
    submitBtn.disabled = true;
    clearNotice();
    try {
        if (state.editingId) {
            await update(state.editingId, dto);
            showNotice("Ресурс оновлено.");
        }
        else {
            await create(dto);
            showNotice("Ресурс створено.");
        }
        resetForm();
        await loadResources();
    }
    catch (e) {
        const err = normalizeError(e);
        showNotice(`Не вдалося зберегти (${err.status}): ${err.message}`, true);
        if (Array.isArray(err.details)) {
            err.details.forEach((detail) => {
                if (detail?.field === "title")
                    showFieldError("title", "titleError", detail.message);
                if (detail?.field === "url")
                    showFieldError("url", "urlError", detail.message);
                if (detail?.field === "type")
                    showFieldError("type", "typeError", detail.message);
                if (detail?.field === "description")
                    showFieldError("desc", "descError", detail.message);
                if (detail?.field === "author")
                    showFieldError("author", "authorError", detail.message);
            });
        }
    }
    finally {
        submitBtn.disabled = false;
    }
}
async function onTableClick(event) {
    const target = event.target;
    const detailsId = target.dataset.details;
    const editId = target.dataset.edit;
    const deleteId = target.dataset.delete;
    if (detailsId) {
        try {
            renderListStatus("loading");
            const result = await getById(detailsId);
            renderDetails(result.data);
            renderListStatus("success");
        }
        catch (e) {
            const err = normalizeError(e);
            renderListStatus("error", err);
            showNotice(`Не вдалося отримати деталі (${err.status}): ${err.message}`, true);
        }
    }
    if (editId)
        startEdit(editId);
    if (deleteId) {
        const confirmed = window.confirm("Видалити цей ресурс?");
        if (!confirmed)
            return;
        try {
            await remove(deleteId);
            showNotice("Ресурс видалено.");
            await loadResources();
        }
        catch (e) {
            const err = normalizeError(e);
            showNotice(`Не вдалося видалити (${err.status}): ${err.message}`, true);
        }
    }
}
function startEdit(id) {
    const item = state.items.find((resource) => resource.id === id);
    if (!item)
        return;
    state.editingId = id;
    titleInput.value = item.title;
    urlInput.value = item.url;
    typeInput.value = item.type;
    descInput.value = item.description;
    authorInput.value = item.author;
    formTitle.textContent = "Редагування ресурсу";
    submitBtn.textContent = "Оновити";
    cancelEditBtn.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}
function resetForm() {
    state.editingId = null;
    form.reset();
    clearFieldErrors();
    formTitle.textContent = "Новий ресурс";
    submitBtn.textContent = "Зберегти";
    cancelEditBtn.classList.add("hidden");
}
function readFilters() {
    state.query.search = searchInput.value.trim();
    state.query.type = filterType.value;
    state.query.sortBy = sortBy.value;
    state.query.sortDir = sortDir.value;
    state.query.page = 1;
}
function attachHandlers() {
    form.addEventListener("submit", onSubmit);
    cancelEditBtn.addEventListener("click", resetForm);
    reloadBtn.addEventListener("click", loadResources);
    tableBody.addEventListener("click", onTableClick);
    [searchInput, filterType, sortBy, sortDir].forEach((control) => {
        control.addEventListener("change", () => {
            readFilters();
            void loadResources();
        });
    });
    searchInput.addEventListener("input", () => {
        readFilters();
        window.clearTimeout(Number(searchInput.dataset.timer ?? 0));
        const timer = window.setTimeout(loadResources, 350);
        searchInput.dataset.timer = String(timer);
    });
}
attachHandlers();
void loadResources();
