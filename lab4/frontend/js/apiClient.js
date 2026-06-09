import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "./config.js";
function buildQuery(query = {}) {
    const params = new URLSearchParams();
    if (query.search)
        params.set("search", query.search);
    if (query.type)
        params.set("type", query.type);
    if (query.sortBy)
        params.set("sortBy", query.sortBy);
    if (query.sortDir)
        params.set("sortDir", query.sortDir);
    if (query.page)
        params.set("page", String(query.page));
    if (query.pageSize)
        params.set("pageSize", String(query.pageSize));
    const value = params.toString();
    return value ? `?${value}` : "";
}
async function request(path, options = {}) {
    const controller = new AbortController();
    const timerId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers ?? {}),
            },
        });
        if (response.status === 204)
            return null;
        const rawText = await response.text();
        if (response.ok) {
            if (!rawText)
                return null;
            return JSON.parse(rawText);
        }
        let payload = null;
        try {
            payload = rawText ? JSON.parse(rawText) : null;
        }
        catch {
            payload = null;
        }
        const backendError = payload?.error ?? payload;
        const err = {
            status: response.status,
            message: backendError?.message ?? backendError?.title ?? "HTTP помилка",
            details: backendError?.details ?? rawText,
            errors: backendError?.errors ?? null,
        };
        throw err;
    }
    catch (e) {
        if (typeof e === "object" && e !== null && "status" in e)
            throw e;
        const err = {
            status: 0,
            message: e instanceof DOMException && e.name === "AbortError" ? "Запит перевищив таймаут" : "Помилка мережі або CORS",
            details: e instanceof Error ? e.message : String(e),
        };
        throw err;
    }
    finally {
        window.clearTimeout(timerId);
    }
}
export async function getList(query = {}) {
    return request(`/resources${buildQuery(query)}`);
}
export async function getById(id) {
    return request(`/resources/${encodeURIComponent(id)}`);
}
export async function create(dto) {
    return request("/resources", {
        method: "POST",
        body: JSON.stringify(dto),
    });
}
export async function update(id, dto) {
    return request(`/resources/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(dto),
    });
}
export async function remove(id) {
    return request(`/resources/${encodeURIComponent(id)}`, { method: "DELETE" });
}
