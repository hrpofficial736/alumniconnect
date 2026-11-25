import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptRequest,
  deleteRejectedRequest,
  getAllMentors,
  getAllRequests,
  getConnectedStudents,
  getStudentRequests,
  rejectRequest,
  removeMentor,
  sendMentorshipMail,
  sendRequest,
  withdrawStudentRequest,
  type SendMentorshipMail,
  type SendMentorshipRequest,
} from "../api/mentorship";

export function useGetAllMentors(id: string) {
  return useQuery({
    queryKey: ["mentors", id],
    enabled: !!id,
    refetchInterval: 5000,
    queryFn: () => getAllMentors(id),
  });
}

export function useGetConnectedStudents(id: string) {
  return useQuery({
    queryKey: ["connected-students", id],
    enabled: !!id,
    queryFn: () => getConnectedStudents(id),
  });
}

export function useGetAllRequests(id: string) {
  return useQuery({
    queryKey: ["mentorship-requests", "alumni", id],
    enabled: !!id,
    refetchInterval: 5000,
    queryFn: () => getAllRequests(id),
  });
}

export function useGetStudentRequests(id: string) {
  return useQuery({
    queryKey: ["mentorship-requests", "student", id],
    enabled: !!id,
    refetchInterval: 5000,
    queryFn: () => getStudentRequests(id),
  });
}

export function useWithdrawStudentRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      studentId,
    }: {
      requestId: string;
      studentId: string;
    }) => withdrawStudentRequest(requestId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mentorship-requests", "student"],
      });
    },
  });
}

export function useDeleteRejectedRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      studentId,
    }: {
      requestId: string;
      studentId: string;
    }) => deleteRejectedRequest(requestId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mentorship-requests", "student"],
      });
    },
  });
}

export function useSendMentorshipMail() {
  return useMutation({
    mutationFn: ({
      alumniId,
      mail,
    }: {
      alumniId: string;
      mail: SendMentorshipMail;
    }) => sendMentorshipMail(alumniId, mail),
  });
}

export function useSendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (info: SendMentorshipRequest) => sendRequest(info),
    onSuccess: (_result, request) => {
      queryClient.invalidateQueries({
        queryKey: ["mentorship-requests", "student", request.studentId],
      });
    },
  });
}

function useRespondToRequest(
  action: typeof acceptRequest | typeof rejectRequest,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => action(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorship-requests"] });
      queryClient.invalidateQueries({ queryKey: ["connected-students"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

export function useAcceptRequest() {
  return useRespondToRequest(acceptRequest);
}

export function useRejectRequest() {
  return useRespondToRequest(rejectRequest);
}

export function useRemoveMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeMentor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connected-students"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}
