import type { Alumni } from "../types/types";
import { apiClient } from "./client";

export function getAllAlumni(token: string) {
  return apiClient<Alumni[]>("alumni", "GET", token, undefined);
}

export function getAlumniByID(token: string, id: string) {
  return apiClient<Alumni>(`alumni/${id}`, "GET", token, undefined);
}

export function createAlumni(token: string, data: Alumni) {
  return apiClient<Alumni>("alumni", "POST", token, data);
}

export function updateAlumni(token: string, data: Alumni, id: string) {
  return apiClient<Alumni>(`alumni/${id}`, "PATCH", token, data);
}

export function deleteAlumni(token: string, id: string) {
  return apiClient<void>(`alumni/${id}`, "DELETE", token, undefined);
}
