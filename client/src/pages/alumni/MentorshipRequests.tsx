import { useState } from "react";
import { FaCheck, FaExternalLinkAlt, FaSearch, FaTimes } from "react-icons/fa";
import { Sidebar } from "../../components/Sidebar";
import { Filters, type FilterValues } from "../../components/Filters";
import {
  useAcceptRequest,
  useGetAllRequests,
  useRejectRequest,
} from "../../hooks/use-mentorship";

export default function MentorshipRequests() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const alumniId = user.id ?? "";
  const userEmail = user.email ?? "Alumni";
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllRequests(alumniId);
  const accept = useAcceptRequest();
  const reject = useRejectRequest();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({ skill: "" });
  const [actionError, setActionError] = useState("");
  const busy = accept.isPending || reject.isPending;

  const q = search.trim().toLowerCase();
  const skill = filters.skill.trim().toLowerCase();
  const filtered = requests.filter(
    (student) =>
      [student.name, student.email, student.roll_no, student.branch].some(
        (value) => value?.toLowerCase().includes(q),
      ) &&
      (filters.batch_year === undefined ||
        Number(student.batch_year) === filters.batch_year) &&
      (filters.cgpa === undefined || Number(student.cgpa) > filters.cgpa) &&
      (!skill ||
        student.skills.some((value) => value.trim().toLowerCase() === skill)),
  );

  const respond = async (id: string, approved: boolean) => {
    setActionError("");
    try {
      await (approved ? accept.mutateAsync(id) : reject.mutateAsync(id));
      await refetch();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to update the request. Please try again.",
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#fbfaf6]">
      <Sidebar role="alumni" id={alumniId} userEmail={userEmail} />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden px-6 py-8 sm:px-10">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#23392f]">
              Mentorship Requests
            </h1>
            <p className="mt-1 text-sm text-[#66746a]">
              {isLoading
                ? "Loading…"
                : `${filtered.length} request${filtered.length === 1 ? "" : "s"} found`}
            </p>
          </div>
          <label className="relative w-full sm:w-72">
            <span className="sr-only">Search mentorship requests</span>
            <FaSearch
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#97a398]"
            />
            <input
              type="search"
              placeholder="Search name, roll no, branch…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-[#dce5d8] bg-white py-2.5 pl-9 pr-4 text-sm text-[#23392f] outline-none transition placeholder:text-[#98a59a] focus:border-[#24543f]"
            />
          </label>
        </header>

        <Filters search={setFilters} />
        {actionError && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {actionError}
          </p>
        )}

        <section className="min-h-0 flex-1 overflow-auto pb-2">
          {isLoading ? (
            <div
              role="status"
              className="flex h-full items-center justify-center"
            >
              <span className="sr-only">Loading requests</span>
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#24543f] border-t-transparent" />
            </div>
          ) : isError ? (
            <div
              role="alert"
              className="flex h-full items-center justify-center gap-3 text-sm text-red-500"
            >
              Failed to load requests.
              <button
                type="button"
                onClick={() => void refetch()}
                className="cursor-pointer font-semibold underline"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-full min-h-64 items-center justify-center rounded-2xl border border-dashed border-[#dce5d8] bg-white px-6 text-center text-sm text-[#97a398]">
              No mentorship requests match your search or filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((request) => {
                const pending = request.status === "pending";
                const updating =
                  (accept.isPending &&
                    accept.variables === request.request_id) ||
                  (reject.isPending && reject.variables === request.request_id);
                return (
                  <article
                    key={request.request_id}
                    className="overflow-hidden rounded-2xl border border-[#e3eadf] bg-white shadow-[0_4px_16px_rgba(23,61,45,0.05)] transition hover:border-[#cbdacb]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#edf2ea] bg-[#f9fbf7] px-5 py-5 sm:px-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0e8] text-lg font-semibold text-[#24543f]">
                          {request.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-semibold text-[#23392f]">
                            {request.name}
                          </h2>
                          <p className="break-all text-sm text-[#66746a]">
                            {request.email}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-700">
                        {request.status}
                      </span>
                    </div>

                    <div className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(250px,0.8fr)]">
                      <div className="space-y-5">
                        <section aria-label="Request topics">
                          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66746a]">
                            Looking for guidance in
                          </h3>
                          <div className="mt-2 flex min-h-9 flex-wrap items-center gap-2 rounded-xl bg-[#f7faf5] p-3">
                            {request.tags.length > 0 ? (
                              request.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-[#cfe0cd] bg-white px-3 py-1 text-xs font-semibold text-[#24543f]"
                                >
                                  #{tag.replaceAll("_", " ")}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-[#97a398]">
                                No topics selected
                              </span>
                            )}
                          </div>
                        </section>

                        <section aria-label="Student message">
                          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66746a]">
                            Message from student
                          </h3>
                          <div className="mt-2 min-h-20 rounded-xl border border-[#edf2ea] bg-white p-3.5">
                            {request.description ? (
                              <p className="whitespace-pre-wrap text-sm leading-6 text-[#3e4d43]">
                                {request.description}
                              </p>
                            ) : (
                              <p className="text-sm italic text-[#97a398]">
                                No additional message provided.
                              </p>
                            )}
                          </div>
                        </section>
                      </div>

                      <aside className="rounded-xl bg-[#f7faf5] p-4">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66746a]">
                          Student profile
                        </h3>
                        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                          <div>
                            <dt className="text-xs text-[#97a398]">Roll no.</dt>
                            <dd className="mt-0.5 font-mono text-[#3e4d43]">
                              {request.roll_no || "—"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-[#97a398]">Branch</dt>
                            <dd className="mt-0.5 text-[#3e4d43]">
                              {request.branch || "—"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-[#97a398]">Semester</dt>
                            <dd className="mt-0.5 text-[#3e4d43]">
                              {request.semester
                                ? `Sem ${request.semester}`
                                : "—"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-[#97a398]">Batch</dt>
                            <dd className="mt-0.5 text-[#3e4d43]">
                              {request.batch_year || "—"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-[#97a398]">CGPA</dt>
                            <dd className="mt-0.5 font-semibold text-[#3e4d43]">
                              {request.cgpa ?? "—"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-[#97a398]">Skills</dt>
                            <dd className="mt-0.5 text-[#3e4d43]">
                              {request.skills.length
                                ? request.skills.slice(0, 3).join(", ")
                                : "—"}
                            </dd>
                          </div>
                        </dl>
                        <div className="mt-4 flex flex-wrap gap-3 border-t border-[#e3eadf] pt-3">
                          {request.linkedin_link && (
                            <a
                              href={request.linkedin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium text-[#24543f] hover:underline"
                            >
                              LinkedIn{" "}
                              <FaExternalLinkAlt
                                aria-hidden="true"
                                className="text-[10px]"
                              />
                            </a>
                          )}
                          {request.portfolio_link && (
                            <a
                              href={request.portfolio_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium text-[#24543f] hover:underline"
                            >
                              Portfolio{" "}
                              <FaExternalLinkAlt
                                aria-hidden="true"
                                className="text-[10px]"
                              />
                            </a>
                          )}
                        </div>
                      </aside>
                    </div>

                    <footer className="flex flex-wrap justify-end gap-2 border-t border-[#edf2ea] px-5 py-4 sm:px-6">
                      <button
                        type="button"
                        disabled={busy || !pending || !request.request_id}
                        onClick={() =>
                          request.request_id &&
                          void respond(request.request_id, false)
                        }
                        aria-label={`Reject request from ${request.name}`}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaTimes aria-hidden="true" />
                        {updating && reject.isPending ? "Rejecting…" : "Reject"}
                      </button>
                      <button
                        type="button"
                        disabled={busy || !pending || !request.request_id}
                        onClick={() =>
                          request.request_id &&
                          void respond(request.request_id, true)
                        }
                        aria-label={`Accept request from ${request.name}`}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#24543f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1d4332] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaCheck aria-hidden="true" />
                        {updating && accept.isPending ? "Accepting…" : "Accept"}
                      </button>
                    </footer>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
