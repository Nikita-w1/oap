export function el(id) {
    const element = document.getElementById(id);
    if (!element)
        throw new Error(`Element #${id} not found`);
    return element;
}
export function showNotice(text, isError = false) {
    const notice = el("notice");
    notice.textContent = text;
    notice.className = isError ? "notice errorBox" : "notice successBox";
}
export function clearNotice() {
    const notice = el("notice");
    notice.textContent = "";
    notice.className = "notice";
}
export function renderListStatus(status, error) {
    const block = el("listStatus");
    if (status === "loading")
        block.textContent = "Завантаження...";
    else if (status === "empty")
        block.textContent = "Немає даних для відображення.";
    else if (status === "error")
        block.textContent = `Помилка завантаження (${error?.status ?? "?"}): ${error?.message ?? "невідома помилка"}`;
    else
        block.textContent = "";
}
function appendCell(row, text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    row.appendChild(cell);
    return cell;
}
export function renderTable(items) {
    const body = el("tableBody");
    body.textContent = "";
    items.forEach((item, index) => {
        const row = document.createElement("tr");
        appendCell(row, String(index + 1));
        appendCell(row, item.title ?? "(без назви)");
        const linkCell = document.createElement("td");
        const link = document.createElement("a");
        link.href = item.url;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = "відкрити";
        linkCell.appendChild(link);
        row.appendChild(linkCell);
        appendCell(row, item.type ?? "–");
        appendCell(row, item.author ?? "–");
        const actions = document.createElement("td");
        const detailsButton = document.createElement("button");
        detailsButton.type = "button";
        detailsButton.dataset.details = item.id;
        detailsButton.textContent = "Деталі";
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.dataset.edit = item.id;
        editButton.textContent = "Ред.";
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.dataset.delete = item.id;
        deleteButton.textContent = "Вид.";
        actions.append(detailsButton, editButton, deleteButton);
        row.appendChild(actions);
        body.appendChild(row);
    });
}
export function renderDetails(item) {
    const block = el("detailsBox");
    block.textContent = "";
    if (!item) {
        block.classList.add("hidden");
        return;
    }
    block.classList.remove("hidden");
    const title = document.createElement("h3");
    title.textContent = `Деталі: ${item.title}`;
    const description = document.createElement("p");
    description.textContent = item.description;
    const meta = document.createElement("p");
    meta.textContent = `Тип: ${item.type}; автор: ${item.author}; створено: ${item.createdAt ?? "–"}`;
    block.append(title, description, meta);
}
export function showFieldError(inputId, errorId, message) {
    el(inputId).classList.add("invalid");
    el(errorId).textContent = message;
}
export function clearFieldErrors() {
    document.querySelectorAll(".invalid").forEach((element) => element.classList.remove("invalid"));
    document.querySelectorAll(".field-error").forEach((element) => { element.textContent = ""; });
}
