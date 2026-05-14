// state
const state = {
    items: [],
    editingId: null,
    filters: {
        search: "",
        sort: ""
    },
    sortDirection: "asc"
};

// dom
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

// init
(function init() {
    attachHandlers();
    render();
})();

// handlers
function attachHandlers() {
    form.addEventListener("submit", onSubmit);

    tableHead.addEventListener("click", (e) => {
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

// submit
function onSubmit(e) {
    e.preventDefault();

    const dto = readForm();
    if (!validate(dto)) return;

    submitBtn.disabled = true;

    if (state.editingId) {
        updateResource(state.editingId, dto);
    } else {
        addResource(dto);
    }

    render();
    resetForm();

    submitBtn.disabled = false;
}

// table click
function onTableClick(e) {
    const deleteId = e.target.dataset.delete;
    const editId = e.target.dataset.edit;

    if (deleteId) {
        deleteResource(Number(deleteId));
    }

    if (editId) {
        startEdit(Number(editId));
    }
}

// crud
function addResource(dto) {
    state.items.push({
        id: Date.now(),
        ...dto
    });
}

function updateResource(id, dto) {
    state.items = state.items.map(item =>
        item.id === id ? { ...item, ...dto } : item
    );
}

function deleteResource(id) {
    state.items = state.items.filter(item => item.id !== id);
    render();
}

//Рендер
function render() {
    tableBody.innerHTML = "";

    let filtered = [...state.items];

    //Пошук
filtered = filtered.filter(item =>
    item.title.toLowerCase().includes(state.filters.search) ||
    item.author.toLowerCase().includes(state.filters.search) ||
    item.type.toLowerCase().includes(state.filters.search)
);

    //Сортування
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

    // Рендер
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

//Форма
function readForm() {
    return {
        title: titleInput.value.trim(),
        url: urlInput.value.trim(),
        type: typeInput.value,
        desc: descInput.value.trim(),
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
    descInput.value = item.desc;
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

//Валідація
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

    if (!dto.url) {
    showError("url", "urlError", "Вкажіть URL");
    valid = false;
} else {
    try {
        new URL(dto.url);
    } catch {
        showError("url", "urlError", "Некоректний URL");
        valid = false;
    }
}

    if (!dto.type) {
        showError("type", "typeError", "Оберіть тип");
        valid = false;
    }

    if (!dto.desc) {
    showError("desc", "descError", "Вкажіть опис");
    valid = false;
}

    if (!dto.author) {
        showError("author", "authorError", "Вкажіть автора");
        valid = false;
    }

    return valid;
}

//Помилки
function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
}