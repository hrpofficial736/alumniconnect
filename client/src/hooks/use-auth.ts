import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginStudent, loginAlumni, loginAdmin,
  registerStudent, registerAlumni, registerAdmin,
  type AuthData, type UserRole,
} from "../api/auth";

const loginHandlers = { student: loginStudent, alumni: loginAlumni, admin: loginAdmin };
const registerHandlers = { student: registerStudent, alumni: registerAlumni, admin: registerAdmin };

export function useLogin(role: UserRole, callback: (id: string) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AuthData) => {
      return loginHandlers[role](data);
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["auth", role, profile.id], profile);
      localStorage.setItem("user", JSON.stringify({...profile, role: role}));
      callback(profile.id);
    },
  });
}

export function useRegister(role: UserRole, callback: (id: string) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AuthData) => {
      return registerHandlers[role](data);
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["auth", role, profile.id], profile);
      localStorage.setItem("user", JSON.stringify({...profile, role: role}));
      callback(profile.id);
    },
  });
}
