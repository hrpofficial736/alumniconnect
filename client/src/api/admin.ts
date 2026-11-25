import type { Admin } from "../types/types";
import { apiClient } from "./client";

export function getAdminByID(id: string) {
  return apiClient<Admin>(`admin/${id}`, "GET", null, undefined);
}


export function updateAdmin(data: Admin, id: string) {
  return apiClient<Admin>(`admin/${id}`, "PATCH", null, data);
}

export function deleteAdmin(id: string) {
  return apiClient<void>(`admin/${id}`, "DELETE", null, undefined);
}

export function seedStudents(id: string, data: unknown) {
  return apiClient<void>(`admin/${id}/seed/students`, "POST", null, data);
}


export function seedAlumni(id: string, data: unknown) {
  return apiClient<void>(`admin/${id}/seed/alumni`, "POST", null, data);
}

export function updateStudents(id: string) {
  return apiClient<void>(`admin/${id}/update/students`, "POST", null);
}
