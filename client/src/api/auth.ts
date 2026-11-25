import { apiClient } from "./client";
import type { Student, Alumni, Admin } from "../types/types";

export type UserRole = "student" | "alumni" | "admin";
export type AuthData = { email: string; password: string };

export function loginStudent(data: AuthData) {
  return apiClient<Student>("auth/students/login", "POST", null, data);
}

export function registerStudent(data: AuthData) {
  return apiClient<Student>("auth/students/register", "POST", null, data);
}

export function loginAlumni(data: AuthData) {
  return apiClient<Alumni>("auth/alumni/login", "POST", null, data);
}

export async function registerAlumni(data: AuthData) {
  const result = await apiClient<Alumni | { alumni: Alumni }>(
    "auth/alumni/register",
    "POST",
    null,
    data,
  );
  return "alumni" in result ? result.alumni : result;
}

export function loginAdmin(data: AuthData) {
  return apiClient<Omit<Admin, "password">>(
    "auth/admin/login",
    "POST",
    null,
    data,
  );
}

export function registerAdmin(data: AuthData) {
  return apiClient<Omit<Admin, "password">>(
    "auth/admin/register",
    "POST",
    null,
    data,
  );
}
