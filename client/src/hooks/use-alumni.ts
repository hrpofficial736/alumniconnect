import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAlumni,
  getAllAlumni,
  getAlumniByID,
  getAlumniProfile,
  seedAlumni,
  updateAlumni,
  updateAlumniProfile,
} from "../api/alumni";

import type { Alumni } from "../types/types";

export function useGetAllAlumni() {
  return useQuery({
    queryKey: ["alumni"],
    queryFn: async () => {
      return getAllAlumni();
    },
  });
}

export function useGetAlumniByID(id: string) {
  return useQuery({
    queryKey: ["alumni", id],
    enabled: !!id,
    queryFn: () => getAlumniByID(id),
  });
}

export function useGetAlumniProfile(id: string) {
  return useQuery({
    queryKey: ["alumni-profile", id],
    enabled: !!id,
    queryFn: () => getAlumniProfile(id),
  });
}

export function useUpdateAlumniProfile(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Alumni, "password">) =>
      updateAlumniProfile(data, id),
    onSuccess: (profile) => {
      queryClient.setQueryData(["alumni-profile", id], profile);
      queryClient.setQueryData(["alumni", id], profile);
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
    },
  });
}

export function useUpdateAlumni(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Alumni, "password">) => updateAlumni(data, id),
    onSuccess: (alumni) => {
      queryClient.setQueryData(["alumni", id], alumni);
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
    },
  });
}

export function useSeedAlumni(adminId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Alumni[]) => {
      return seedAlumni(adminId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
    },
  });
}

export function useDeleteAlumni(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return deleteAlumni(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
    },
  });
}
