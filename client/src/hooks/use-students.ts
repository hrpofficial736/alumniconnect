import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteStudent,
  getAllStudents,
  getStudentByID,
  getStudentProfile,
  seedStudents,
  updateStudent,
  updateStudentProfile,
} from "../api/students";
import type { Student } from "../types/types";

export function useGetAllStudents() {
  return useQuery({
    queryKey: ["student"],
    queryFn: async () => {
      const students = getAllStudents();
      console.log(students);
      return students;
    },
  });
}

export function useGetStudentByID(id: string) {
  return useQuery({
    queryKey: ["student", id],
    enabled: !!id,
    queryFn: () => getStudentByID(id),
  });
}

export function useGetStudentProfile(id: string) {
  return useQuery({
    queryKey: ["student-profile", id],
    enabled: !!id,
    queryFn: () => getStudentProfile(id),
  });
}

export function useUpdateStudentProfile(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Student, "password">) =>
      updateStudentProfile(data, id),
    onSuccess: (profile) => {
      queryClient.setQueryData(["student-profile", id], profile);
      queryClient.setQueryData(["student", id], profile);
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
  });
}

export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Student, "password">) => updateStudent(data, id),
    onSuccess: (student) => {
      queryClient.setQueryData(["student", id], student);
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
  });
}

export function useSeedStudents(adminId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Student[]) => {
      return seedStudents(adminId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
  });
}

export function useDeleteStudent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return deleteStudent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
  });
}
