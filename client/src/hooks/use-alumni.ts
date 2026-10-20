import { useAuth } from "@clerk/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlumni, deleteAlumni, getAllAlumni, getAlumniByID, seedAlumni, updateAlumni } from "../api/alumni";
import type { Alumni } from "../types/types";

export function useGetAllAlumni() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["alumni"],
    queryFn: async () => {
      const token = await getToken();
      return getAllAlumni(token!);
    }
  })
}

export function useGetAlumniByID(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["alumni"],
    queryFn: async () => {
      const token = await getToken();
      return getAlumniByID(token!, id);
    }
  })
}

export function useCreateAlumni(data: Alumni) {
  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return createAlumni(token!, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni"] })
    }
  })
}

export function useUpdateAlumni(data: Alumni, id: string) {
  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return updateAlumni(token!, data, id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni"] })
    }
  })
}

export function useSeedAlumni(adminId: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Alumni[]) => {
      const token = await getToken();
      return seedAlumni(token!, adminId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
    }
  });
}

export function useDeleteAlumni(id: string) {
  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return deleteAlumni(token!, id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni"] })
    }
  })
}
