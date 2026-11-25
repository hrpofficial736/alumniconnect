import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAdmin, getAdminByID, updateAdmin, updateStudents } from "../api/admin";
import type { Admin } from "../types/types";

export function useGetAdminByID(id: string) {
  return useQuery({
    queryKey: ["admin"],
    queryFn: async () => {
      return getAdminByID(id);
    }
  })
}

export function useUpdateAdmin(data: Admin, id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return updateAdmin(data, id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] })
    }
  })
}

export function useDeleteAdmin(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return deleteAdmin(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] })
    }
  })
}

export function useUpdateStudents(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return updateStudents(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] })
    }
  })
}
