import type { Admin } from "../types/types";
import { apiClient } from "./client";

export function getAdminByID(token: string, id: string) {
  return apiClient<Admin>(`admin/${id}`, "GET", token, undefined);
}

export function createAdmin(token: string, data: Admin) {
  return apiClient<Admin>("admin", "POST", token, data);
}

export function updateAdmin(token: string, data: Admin, id: string) {
  return apiClient<Admin>(`admin/${id}`, "PATCH", token, data);
}

export function deleteAdmin(token: string, id: string) {
  return apiClient<void>(`admin/${id}`, "DELETE", token, undefined);
}
