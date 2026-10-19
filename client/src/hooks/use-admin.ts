import { useAuth } from "@clerk/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAdmin, deleteAdmin, getAdminByID, updateAdmin } from "../api/admin";
import type { Admin } from "../types/types";

export function useGetAdminByID(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["admin"],
    queryFn: async () => {
      const token = await getToken();
      return getAdminByID(token!, id);
    }
  })
}

export function useCreateAdmin(data: Admin) {
  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return createAdmin(token!, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] })
    }
  })
}

export function useUpdateAdmin(data: Admin, id: string) {
  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return updateAdmin(token!, data, id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] })
    }
  })
}

export function useDeleteAdmin(id: string) {
  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return deleteAdmin(token!, id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] })
    }
  })
}
