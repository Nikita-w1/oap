import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "./config.js";
import type { ApiError, ApiItemResponse, ApiListResponse, CreateResourceDto, ResourceDto, ResourceQuery, UpdateResourceDto } from "./dtos.js";

function buildQuery(query: ResourceQuery = {}): string {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.type) params.set("type", query.type);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortDir) params.set("sortDir", query.sortDir);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  const value = params.toString();
  return value ? `?${value}` : "";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
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

    if (response.status === 204) return null as T;

    const rawText = await response.text();

    if (response.ok) {
      if (!rawText) return null as T;
      return JSON.parse(rawText) as T;
    }

    let payload: any = null;
    try {
      payload = rawText ? JSON.parse(rawText) : null;
    } catch {
      payload = null;
    }

    const backendError = payload?.error ?? payload;
    const err: ApiError = {
      status: response.status,
      message: backendError?.message ?? backendError?.title ?? "HTTP помилка",
      details: backendError?.details ?? rawText,
      errors: backendError?.errors ?? null,
    };
    throw err;
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "status" in e) throw e;

    const err: ApiError = {
      status: 0,
      message: e instanceof DOMException && e.name === "AbortError" ? "Запит перевищив таймаут" : "Помилка мережі або CORS",
      details: e instanceof Error ? e.message : String(e),
    };
    throw err;
  } finally {
    window.clearTimeout(timerId);
  }
}

export async function getList(query: ResourceQuery = {}) {
  return request<ApiListResponse<ResourceDto>>(`/resources${buildQuery(query)}`);
}

export async function getById(id: string) {
  return request<ApiItemResponse<ResourceDto>>(`/resources/${encodeURIComponent(id)}`);
}

export async function create(dto: CreateResourceDto) {
  return request<ApiItemResponse<ResourceDto>>("/resources", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function update(id: string, dto: UpdateResourceDto) {
  return request<ApiItemResponse<ResourceDto>>(`/resources/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function remove(id: string) {
  return request<void>(`/resources/${encodeURIComponent(id)}`, { method: "DELETE" });
}
