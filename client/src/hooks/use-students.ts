import { useAuth } from "@clerk/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createStudent, deleteStudent, getAllStudents, getStudentByID, updateStudent } from "../api/students";
import type { Student } from "../types/types";

export function useGetAllStudents() {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ["student"],
    queryFn: async () => {
      const token = await getToken();
      const students = getAllStudents(token!);
      console.log(students)
      return students;
    }
  })
}

export function useGetStudentByID(id: string) {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ["student"],
    queryFn: async () => {
      const token = await getToken();
      return getStudentByID(token!, id);
    }
  })
}

export function useCreateStudent(data: Student) {
  const { getToken } = useAuth();
  
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return createStudent(token!, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["student"]})
    }
  })
}

export function useUpdateStudent(data: Student, id: string) {
  const { getToken } = useAuth();
  
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return updateStudent(token!, data, id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["student"]})
    }
  })
}

export function useDeleteStudent(id: string) {
  const { getToken } = useAuth();
  
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return deleteStudent(token!, id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["student"]})
    }
  })
}