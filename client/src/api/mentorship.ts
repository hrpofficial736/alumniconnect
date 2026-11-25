import type {
  Alumni,
  MentorshipRequest,
  MentorshipTag,
  Student,
} from "../types/types";
import { apiClient } from "./client";

export interface SendMentorshipRequest {
  studentId: string;
  alumId: string;
  tags: MentorshipRequest["tags"];
  description: string;
}

export interface SendMentorshipMail {
  tags?: MentorshipTag[];
  studentIds?: string[];
  subject: string;
  body: string;
}

export interface MentorshipMailResult {
  message: string;
  sentCount: number;
  failedCount: number;
}

export interface ConnectedStudent extends Omit<Student, "password"> {
  tags: MentorshipTag[];
  description: string;
}

export interface StudentMentorshipRequest extends Alumni {
  request_id: string;
  tags: MentorshipRequest["tags"];
  description: string;
  status: "pending" | "rejected";
}

export function getAllMentors(id: string) {
  return apiClient<Alumni[]>(`mentorship/mentors/${id}`, "GET", null);
}

export function getConnectedStudents(id: string) {
  return apiClient<ConnectedStudent[]>(
    `mentorship/students/${id}`,
    "GET",
    null,
  );
}

export function getAllRequests(id: string) {
  return apiClient<MentorshipRequest[]>(
    `mentorship/requests/${id}`,
    "GET",
    null,
  );
}

export function getStudentRequests(id: string) {
  return apiClient<StudentMentorshipRequest[]>(
    `mentorship/student-requests/${id}`,
    "GET",
    null,
  );
}

export function sendRequest(info: SendMentorshipRequest) {
  return apiClient<void>("mentorship/requests", "POST", null, info);
}

export function acceptRequest(id: string) {
  return apiClient<void>(`mentorship/requests/${id}/accept`, "PATCH", null);
}

export function rejectRequest(id: string) {
  return apiClient<void>(`mentorship/requests/${id}/reject`, "PATCH", null);
}

export function withdrawStudentRequest(requestId: string, studentId: string) {
  return apiClient<void>(
    `mentorship/student-requests/${requestId}`,
    "DELETE",
    null,
    { studentId },
  );
}

export function deleteRejectedRequest(requestId: string, studentId: string) {
  return apiClient<void>(
    `mentorship/student-requests/${requestId}/rejected`,
    "DELETE",
    null,
    { studentId },
  );
}

export function sendMentorshipMail(alumniId: string, mail: SendMentorshipMail) {
  return apiClient<MentorshipMailResult>(
    `mentorship/mail/${alumniId}`,
    "POST",
    null,
    mail,
  );
}

export function removeMentor(info: { studentId: string; alumId: string }) {
  return apiClient<void>("mentorship/mentors", "DELETE", null, info);
}
