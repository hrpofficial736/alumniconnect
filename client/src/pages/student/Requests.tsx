import { useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { useParams } from "react-router";
import { Sidebar } from "../../components/Sidebar";
import {
  useDeleteRejectedRequest,
  useGetStudentRequests,
  useWithdrawStudentRequest,
} from "../../hooks/use-mentorship";

export default function Requests() {
  const { studentId = "" } = useParams();
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useGetStudentRequests(studentId);
  const withdraw = useWithdrawStudentRequest();
  const deleteRejected = useDeleteRejectedRequest();
  const [actionError, setActionError] = useState("");
  const pendingRequests = requests.filter(
    (request) => request.status === "pending",
  );
  const rejectedRequests = requests.filter(
    (request) => request.status === "rejected",
  );
  const busy = withdraw.isPending || deleteRejected.isPending;

  const updateRequest = async (requestId: string, rejected: boolean) => {
    setActionError("");
    try {
      const variables = { requestId, studentId };
      await (rejected
        ? deleteRejected.mutateAsync(variables)
        : withdraw.mutateAsync(variables));
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to update this request.",
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#fbfaf6]">
      <Sidebar
        role="student"
        id={studentId}
        userEmail={user.email ?? "Student"}
      />
      <main className="min-w-0 flex-1 overflow-auto px-6 py-8 sm:px-10">
        <header className="mb-7">
          <p className="text-sm font-medium text-[#66806d]">
            Your mentorship journey
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#23392f]">
            My requests
          </h1>
          <p className="mt-1 text-sm text-[#66746a]">
            {isLoading
              ? "Loading…"
              : `${pendingRequests.length} pending · ${rejectedRequests.length} rejected`}
          </p>
        </header>

        {actionError && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {actionError}
          </p>
        )}

        {isLoading ? (
          <div
            role="status"
            className="flex min-h-64 items-center justify-center rounded-2xl border border-[#e3eadf] bg-white"
          >
            <span className="sr-only">Loading mentorship requests</span>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#24543f] border-t-transparent" />
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-100 bg-white p-5 text-sm text-red-600"
          >
            Unable to load your requests.{" "}
            <button
              type="button"
              onClick={() => void refetch()}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dce5d8] bg-white p-10 text-center">
            <h2 className="font-semibold text-[#23392f]">
              No mentorship requests
            </h2>
            <p className="mt-2 text-sm text-[#66746a]">
              Pending and rejected requests will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {requests.map((request) => {
              const rejected = request.status === "rejected";
              const updatingWithdraw =
                withdraw.isPending &&
                withdraw.variables?.requestId === request.request_id;
              const updatingDelete =
                deleteRejected.isPending &&
                deleteRejected.variables?.requestId === request.request_id;
              return (
                <article
                  key={request.request_id}
                  className="overflow-hidden rounded-2xl border border-[#e3eadf] bg-white shadow-[0_4px_16px_rgba(23,61,45,0.05)]"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-[#edf2ea] bg-[#f9fbf7] px-5 py-4">
                    <div>
                      <h2 className="font-semibold text-[#23392f]">
                        {request.name}
                      </h2>
                      <p className="mt-1 text-sm text-[#66746a]">
                        {[request.current_position, request.current_company]
                          .filter(Boolean)
                          .join(" at ") || "Alumni mentor"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${rejected ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}
                    >
                      {rejected ? "REJECTED" : "PENDING"}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#66746a]">
                      Topics
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {request.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#e8f0e8] px-3 py-1 text-xs font-medium text-[#24543f]"
                        >
                          #{tag.replaceAll("_", " ")}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl border border-[#edf2ea] bg-[#fbfcfa] p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#66746a]">
                        Your message
                      </p>
                      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-[#3e4d43]">
                        {request.description || (
                          <span className="italic text-[#97a398]">
                            No message added.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <footer className="flex justify-end border-t border-[#edf2ea] px-5 py-4">
                    {rejected ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void updateRequest(request.request_id, true)
                        }
                        className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaTrash aria-hidden="true" />
                        {updatingDelete ? "Deleting…" : "Delete request"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void updateRequest(request.request_id, false)
                        }
                        className="flex items-center gap-2 rounded-lg border border-[#dce5d8] bg-white px-3.5 py-2 text-xs font-semibold text-[#66746a] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaTimes aria-hidden="true" />
                        {updatingWithdraw ? "Withdrawing…" : "Withdraw request"}
                      </button>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
