const API = "http://localhost:3000/api/resources";


const state = {
    items: [],
    editingId: null,
    filters: {
        search: "",
        sort: ""
    },
    sortDirection: "asc"
};

const form = document.getElementById("form");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const toggleSortBtn = document.getElementById("toggleSort");
const cancelEditBtn = document.getElementById("cancelEdit");
const formTitle = document.getElementById("formTitle");
const tableHead = document.querySelector("thead");

const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const typeInput = document.getElementById("type");
const descInput = document.getElementById("desc");
const authorInput = document.getElementById("author");

const submitBtn = document.getElementById("submitBtn");


(function init() {
    attachHandlers();
    loadResources();
})();


function attachHandlers() {
    form.addEventListener("submit", onSubmit);

    tableHead.addEventListener("click", (e) => {
        if (!e.target.dataset.colname) return;
        state.filters.sort = e.target.dataset.colname;
        render();
    });

    tableBody.addEventListener("click", onTableClick);

    searchInput.addEventListener("input", (e) => {
        state.filters.search = e.target.value.toLowerCase();
        render();
    });

    toggleSortBtn.addEventListener("click", () => {
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
        render();
    });

    cancelEditBtn.addEventListener("click", resetForm);
}


async function onSubmit(e) {
    e.preventDefault();

    const dto = readForm();
    if (!validate(dto)) return;

    submitBtn.disabled = true;

    try {
        if (state.editingId) {
            await updateResource(state.editingId, dto);
        } else {
            await addResource(dto);
        }

        render();
        resetForm();
    } catch (error) {
        alert(error.message);
    } finally {
        submitBtn.disabled = false;
    }
}

async function onTableClick(e) {
    const deleteId = e.target.dataset.delete;
    const editId = e.target.dataset.edit;

    if (deleteId) {
        try {
            await deleteResource(deleteId);
        } catch (error) {
            alert(error.message);
        }
    }

    if (editId) {
        startEdit(editId);
    }
}


async function request(url, options = {}) {
    const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options
    });

    if (!response.ok) {
        throw new Error("Помилка запиту до бекенду");
    }

    if (response.status === 204) return null;
    return response.json();
}

async function loadResources() {
    try {
        const data = await request(API);
        state.items = data.data || data.items || [];
        render();
    } catch (error) {
        console.error(error);
        alert("Запусти бекенд: cd backend && npm run dev");
    }
}

async function addResource(dto) {
    const created = await request(API, {
        method: "POST",
        body: JSON.stringify(dto)
    });

    state.items.push(created.data || created);
}

async function updateResource(id, dto) {
    const updated = await request(`${API}/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto)
    });

    state.items = state.items.map(item =>
        item.id === id ? (updated.data || updated) : item
    );
}

async function deleteResource(id) {
    await request(`${API}/${id}`, { method: "DELETE" });
    state.items = state.items.filter(item => item.id !== id);
    render();
}


function render() {
    tableBody.innerHTML = "";

    let filtered = [...state.items];


    if (state.filters.search) {
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(state.filters.search)
        );
    }


    if (state.filters.sort) {
        filtered.sort((a, b) => {
            let aVal = a[state.filters.sort];
            let bVal = b[state.filters.sort];

            if (typeof aVal === "string") {
                return state.sortDirection === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            return state.sortDirection === "asc"
                ? aVal - bVal
                : bVal - aVal;
        });
    }


    filtered.forEach((item, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.title}</td>
                <td><a href="${item.url}" target="_blank">link</a></td>
                <td>${item.type}</td>
                <td>${item.author}</td>
                <td>
                    <button data-edit="${item.id}">Ред.</button>
                    <button data-delete="${item.id}">Вид.</button>
                </td>
            </tr>
        `;
    });
}


function readForm() {
    return {
        title: titleInput.value.trim(),
        url: urlInput.value.trim(),
        type: typeInput.value,
        description: descInput.value.trim(),
        author: authorInput.value.trim()
    };
}

function startEdit(id) {
    const item = state.items.find(x => x.id === id);
    if (!item) return;

    state.editingId = id;

    titleInput.value = item.title;
    urlInput.value = item.url;
    typeInput.value = item.type;
    descInput.value = item.description;
    authorInput.value = item.author;

    formTitle.textContent = "Редагування ресурсу";
    cancelEditBtn.classList.remove("hidden");
}

function resetForm() {
    state.editingId = null;
    form.reset();
    clearErrors();

    formTitle.textContent = "Новий ресурс";
    cancelEditBtn.classList.add("hidden");

    titleInput.focus();
}


function validate(dto) {
    clearErrors();
    let valid = true;

    const isDuplicate = state.items.some(item =>
        item.title.toLowerCase() === dto.title.toLowerCase() &&
        item.url === dto.url &&
        item.id !== state.editingId
    );

    if (isDuplicate) {
        showError("title", "titleError", "Такий ресурс вже існує");
        valid = false;
    }

    if (!dto.title || dto.title.length < 3) {
        showError("title", "titleError", "Мінімум 3 символи");
        valid = false;
    }

    if (!dto.url || !dto.url.startsWith("http")) {
        showError("url", "urlError", "URL має починатися з http або https");
        valid = false;
    }

    if (!dto.type) {
        showError("type", "typeError", "Оберіть тип");
        valid = false;
    }

    if (!dto.description || dto.description.length < 5) {
        showError("desc", "descError", "Мінімум 5 символів");
        valid = false;
    }

    if (!dto.author) {
        showError("author", "authorError", "Вкажіть автора");
        valid = false;
    }

    return valid;
}

function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
}
