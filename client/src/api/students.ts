import type { Student } from "../types/types";
import { apiClient } from "./client";

export function getAllStudents(token: string) {
  return apiClient<Student[]>("students", "GET", token, undefined);
}

export function getStudentByID(token: string, id: string) {
  return apiClient<Student>(`students/${id}`, "GET", token, undefined);
}

export function createStudent(token: string, data: Student) {
  return apiClient<Student>("students", "POST", token, data);
}

export function updateStudent(token: string, data: Student, id: string) {
  return apiClient<Student>(`students/${id}`, "PATCH", token, data);
}

export function seedStudents(token: string, adminId: string, data: Student[]) {
  return apiClient<{ message: string }>(`admin/${adminId}/seed/students`, "POST", token, data);
}

export function deleteStudent(token: string, id: string) {
  return apiClient<void>(`students/${id}`, "DELETE", token, undefined);
}
