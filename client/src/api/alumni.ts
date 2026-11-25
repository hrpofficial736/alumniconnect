import type { Alumni } from "../types/types";
import { apiClient } from "./client";

export function getAllAlumni() {
  return apiClient<Alumni[]>("alumni", "GET", null, undefined);
}

export function getAlumniByID(id: string) {
  return apiClient<Omit<Alumni, "password">>(
    `alumni/${id}`,
    "GET",
    null,
    undefined,
  );
}

export function getAlumniProfile(id: string) {
  return apiClient<Omit<Alumni, "password">>(
    `alumni/${id}/profile`,
    "GET",
    null,
  );
}

export async function updateAlumni(data: Omit<Alumni, "password">, id: string) {
  const result = await apiClient<{ alumni: Omit<Alumni, "password"> }>(
    `alumni/${id}`,
    "PATCH",
    null,
    data,
  );
  return result.alumni;
}

export async function updateAlumniProfile(
  data: Omit<Alumni, "password">,
  id: string,
) {
  const result = await apiClient<{ alumni: Omit<Alumni, "password"> }>(
    `alumni/${id}/profile`,
    "PATCH",
    null,
    data,
  );
  return result.alumni;
}

export function seedAlumni(adminId: string, data: Alumni[]) {
  return apiClient<{ message: string }>(
    `admin/${adminId}/seed/alumni`,
    "POST",
    null,
    data,
  );
}

export function deleteAlumni(id: string) {
  return apiClient<void>(`alumni/${id}`, "DELETE", null, undefined);
}
