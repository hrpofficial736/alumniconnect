import { useState } from "react";
import { FaExternalLinkAlt, FaSearch, FaTrash } from "react-icons/fa";
import { useParams } from "react-router";
import { Sidebar } from "../../components/Sidebar";
import { useGetAllMentors, useRemoveMentor } from "../../hooks/use-mentorship";

export default function Mentors() {
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const { studentId = user.id ?? "" } = useParams();
  const userEmail = user.email ?? "Student";
  const {
    data: mentors = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllMentors(studentId);
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");
  const [removingMentorId, setRemovingMentorId] = useState<string | null>(null);
  const removeMentor = useRemoveMentor();
  const query = search.trim().toLowerCase();
  const filteredMentors = mentors.filter((mentor) =>
    [
      mentor.name,
      mentor.email,
      mentor.current_company,
      mentor.current_position,
    ].some((value) => value?.toLowerCase().includes(query)),
  );

  const disconnectMentor = async (alumId: string, name: string) => {
    if (!window.confirm(`Remove ${name} as your mentor?`)) return;
    setActionError("");
    setRemovingMentorId(alumId);
    try {
      await removeMentor.mutateAsync({ studentId, alumId });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to remove this mentor.",
      );
    } finally {
      setRemovingMentorId(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#fbfaf6]">
      <Sidebar role="student" id={studentId} userEmail={userEmail} />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden px-6 py-8 sm:px-10">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#23392f]">
              My Mentors
            </h1>
            <p className="mt-1 text-sm text-[#66746a]">
              {isLoading
                ? "Loading…"
                : `${filteredMentors.length} mentor${filteredMentors.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <label className="relative w-full sm:w-72">
            <span className="sr-only">Search mentors</span>
            <FaSearch
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#97a398]"
            />
            <input
              type="search"
              placeholder="Search mentors…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-[#dce5d8] bg-white py-2.5 pl-9 pr-4 text-sm text-[#23392f] outline-none placeholder:text-[#98a59a] focus:border-[#24543f]"
            />
          </label>
        </header>
        {actionError && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {actionError}
          </p>
        )}

        <section className="min-h-0 flex-1 overflow-auto">
          {isLoading ? (
            <div
              role="status"
              className="flex h-full items-center justify-center"
            >
              <span className="sr-only">Loading mentors</span>
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#24543f] border-t-transparent" />
            </div>
          ) : isError ? (
            <div
              role="alert"
              className="flex h-full items-center justify-center gap-2 text-sm text-red-500"
            >
              Could not load your mentors.
              <button
                type="button"
                onClick={() => void refetch()}
                className="font-semibold underline"
              >
                Try again
              </button>
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#dce5d8] bg-white px-6 text-center">
              <h2 className="font-semibold text-[#23392f]">
                {mentors.length
                  ? "No mentors match your search"
                  : "No mentors yet"}
              </h2>
              <p className="mt-2 max-w-md text-sm text-[#66746a]">
                {mentors.length
                  ? "Try another name or company."
                  : "When an alumnus accepts your mentorship request, they’ll appear here."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredMentors.map((mentor) => (
                <article
                  key={mentor.id ?? mentor.email}
                  className="rounded-2xl border border-[#e3eadf] bg-white p-5 shadow-[0_4px_16px_rgba(23,61,45,0.05)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0e8] text-lg font-semibold text-[#24543f]">
                      {mentor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-semibold text-[#23392f]">
                        {mentor.name}
                      </h2>
                      <p className="mt-0.5 break-all text-xs text-[#66746a]">
                        {mentor.email}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      Connected
                    </span>
                  </div>
                  <div className="mt-4 rounded-xl bg-[#f7faf5] p-3">
                    <p className="text-sm font-medium text-[#23392f]">
                      {mentor.current_position || "Alumni mentor"}
                    </p>
                    <p className="mt-0.5 text-sm text-[#66746a]">
                      {mentor.current_company || mentor.college}
                    </p>
                  </div>
                  {mentor.bio && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#66746a]">
                      {mentor.bio}
                    </p>
                  )}
                  {mentor.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {mentor.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-[#f0f4ec] px-2 py-1 text-xs text-[#3e5c42]"
                        >
                          {skill}
                        </span>
                      ))}
                      {mentor.skills.length > 5 && (
                        <span className="rounded-md bg-[#f0f4ec] px-2 py-1 text-xs text-[#97a398]">
                          +{mentor.skills.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0f4ec] pt-4">
                    <div className="flex flex-wrap gap-4">
                      {mentor.linkedin_link && (
                        <a
                          href={mentor.linkedin_link}
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
                      {mentor.portfolio_link && (
                        <a
                          href={mentor.portfolio_link}
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
                    <button
                      type="button"
                      disabled={!mentor.id || removingMentorId === mentor.id}
                      onClick={() =>
                        mentor.id &&
                        void disconnectMentor(mentor.id, mentor.name)
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaTrash aria-hidden="true" />
                      {removingMentorId === mentor.id
                        ? "Removing…"
                        : "Remove mentor"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
