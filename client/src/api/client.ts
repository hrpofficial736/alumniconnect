
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiClient<T>(
    endpoint: string,
    method: HttpMethod,
    token: string | null,
    body?: unknown,
) : Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
})
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Request failed: ${res.status}`)
    }
    return res.json();
}