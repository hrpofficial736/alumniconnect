import type { Student } from "../types/types";
import { apiClient } from "./client";

export function getAllStudents() {
  return apiClient<Student[]>("students", "GET", null, undefined);
}

export function getStudentByID(id: string) {
  return apiClient<Omit<Student, "password">>(
    `students/${id}`,
    "GET",
    null,
    undefined,
  );
}

export function getStudentProfile(id: string) {
  return apiClient<Omit<Student, "password">>(
    `students/${id}/profile`,
    "GET",
    null,
  );
}

export function updateStudent(data: Omit<Student, "password">, id: string) {
  return apiClient<Omit<Student, "password">>(
    `students/${id}`,
    "PATCH",
    null,
    data,
  );
}

export function updateStudentProfile(
  data: Omit<Student, "password">,
  id: string,
) {
  return apiClient<Omit<Student, "password">>(
    `students/${id}/profile`,
    "PATCH",
    null,
    data,
  );
}

export function seedStudents(adminId: string, data: Student[]) {
  return apiClient<{ message: string }>(
    `admin/${adminId}/seed/students`,
    "POST",
    null,
    data,
  );
}

export function deleteStudent(id: string) {
  return apiClient<void>(`students/${id}`, "DELETE", null, undefined);
}
