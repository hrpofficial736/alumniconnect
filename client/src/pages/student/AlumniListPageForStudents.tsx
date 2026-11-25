import { useMemo, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { useGetAllAlumni } from "../../hooks/use-alumni";
import { FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import { useParams } from "react-router";
import { Filters, type FilterValues } from "../../components/Filters";
import {
  useGetAllMentors,
  useGetStudentRequests,
  useSendRequest,
} from "../../hooks/use-mentorship";
import type { MentorshipTag } from "../../types/types";
import type { Alumni } from "../../types/types";

const CGPA_COLOR = (cgpa: number) => {
  if (cgpa >= 8.5) return "text-emerald-600 bg-emerald-50";
  if (cgpa >= 7) return "text-blue-600 bg-blue-50";
  return "text-orange-600 bg-orange-50";
};

export const AlumniListPageForStudents = () => {
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const userEmail = user.email ?? "Student";
  const { studentId } = useParams();
  const { data: alumni, isLoading, isError } = useGetAllAlumni();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({ skill: "" });
  const q = search.trim().toLowerCase();
  const skill = filters.skill.trim().toLowerCase();

  const [sentAlumIds, setSentAlumIds] = useState<string[]>([]);
  const [selectedAlum, setSelectedAlum] = useState<Alumni | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [requestError, setRequestError] = useState("");
  const { data: mentors = [] } = useGetAllMentors(studentId ?? "");
  const { data: pendingRequests = [] } = useGetStudentRequests(studentId ?? "");
  const connectedMentorIds = useMemo(
    () => new Set(mentors.map((mentor) => mentor.id)),
    [mentors],
  );
  const pendingAlumIds = useMemo(
    () => new Set(pendingRequests.map((request) => request.id)),
    [pendingRequests],
  );
  const alumniList = (alumni ?? []).filter((a) => {
    const matchesSearch = [
      a.name,
      a.roll_no,
      a.branch,
      a.email,
      a.college,
      a.current_company,
      a.current_position,
    ].some((value) => value?.toLowerCase().includes(q));

    return (
      !connectedMentorIds.has(a.id) &&
      !sentAlumIds.includes(a.id ?? "") &&
      !pendingAlumIds.has(a.id) &&
      matchesSearch &&
      (filters.batch_year === undefined ||
        Number(a.batch_year) === filters.batch_year) &&
      (filters.cgpa === undefined || Number(a.cgpa) > filters.cgpa) &&
      (!skill || a.skills.some((value) => value.trim().toLowerCase() === skill))
    );
  });

  const { mutateAsync: sendRequest, isPending } = useSendRequest();

  const [loadingAlumId, setLoadingAlumId] = useState<string | null>(null);

  const submitRequest = async () => {
    if (!studentId || !selectedAlum?.id || selectedTags.length === 0) return;
    setRequestError("");
    setLoadingAlumId(selectedAlum.id);
    try {
      await sendRequest({
        studentId,
        alumId: selectedAlum.id,
        tags: selectedTags as MentorshipTag[],
        description,
      });
      setSentAlumIds((ids) => [...ids, selectedAlum.id!]);
      setSelectedAlum(null);
      setSelectedTags([]);
      setDescription("");
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "Unable to send request.",
      );
    } finally {
      setLoadingAlumId(null);
    }
  };

  // insert sidebar
  return (
    <div className="flex h-screen bg-[#fbfaf6]">
      <Sidebar role="student" id={studentId} userEmail={userEmail} />

      <main className="flex-1 flex flex-col overflow-hidden px-6 py-8 sm:px-10">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#23392f]">Alumni</h1>
            <p className="mt-0.5 text-sm text-[#66746a]">
              {isLoading
                ? "Loading…"
                : `${alumniList.length} alumn${alumniList.length !== 1 ? "i" : "us"} found`}
            </p>
          </div>

          <div className="relative w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#97a398] text-sm" />
            <input
              type="text"
              placeholder="Search name, company, branch…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#dce5d8] bg-white py-2.5 pl-9 pr-4 text-sm text-[#23392f] outline-none transition placeholder:text-[#98a59a] focus:border-[#24543f]"
            />
          </div>
        </div>

        <Filters search={setFilters} />

        {/* Table container */}
        <div className="flex-1 overflow-auto rounded-2xl border border-[#e3eadf] bg-white shadow-[0_4px_16px_rgba(23,61,45,0.05)]">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#24543f] border-t-transparent" />
            </div>
          )}

          {isError && (
            <div className="flex h-full items-center justify-center text-sm text-red-500">
              Failed to load alumni. Please try again.
            </div>
          )}

          {!isLoading && !isError && (
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-[#f7faf5]">
                <tr className="border-b border-[#e3eadf] text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#66746a]">
                  <th className="px-5 py-3.5 text-center">Alumni</th>
                  <th className="px-5 py-3.5 text-center">Roll No</th>
                  <th className="px-5 py-3.5 text-center">Branch</th>
                  <th className="px-5 py-3.5 text-center">Batch</th>
                  <th className="px-5 py-3.5 text-center">Company</th>
                  <th className="px-5 py-3.5 text-center">Position</th>
                  <th className="px-5 py-3.5 text-center">CGPA</th>
                  <th className="px-5 py-3.5 text-center">Skills</th>
                  <th className="px-5 py-3.5 text-center">Links</th>
                  <th className="px-5 py-3.5">Mentorship</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0f4ec]">
                {alumniList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-16 text-center text-[#97a398]"
                    >
                      No alumni match your search.
                    </td>
                  </tr>
                ) : (
                  alumniList.map((alum, i) => (
                    <tr
                      key={alum.roll_no ?? i}
                      className="transition hover:bg-[#f7faf5]"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f0e8] text-xs font-semibold text-[#24543f]">
                            {alum.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-[#23392f]">
                              {alum.name}
                            </p>
                            <p className="text-xs text-[#97a398]">
                              {alum.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-mono text-xs text-[#3e4d43]">
                        {alum.roll_no}
                      </td>

                      <td className="px-5 py-3.5 text-[#3e4d43] text-center">
                        {alum.branch}
                      </td>

                      <td className="px-5 py-3.5 text-[#3e4d43] text-center">
                        {alum.batch_year}
                      </td>

                      <td className="px-5 py-3.5 text-[#3e4d43] text-center">
                        {alum.current_company || "—"}
                      </td>

                      <td className="px-5 py-3.5 text-[#3e4d43] text-center">
                        {alum.current_position || "—"}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${CGPA_COLOR(alum.cgpa)}`}
                        >
                          {alum.cgpa}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <div className="flex flex-wrap gap-1">
                          {alum.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md bg-[#f0f4ec] px-2 py-0.5 text-xs text-[#3e5c42]"
                            >
                              {skill}
                            </span>
                          ))}
                          {alum.skills.length > 3 && (
                            <span className="rounded-md bg-[#f0f4ec] px-2 py-0.5 text-xs text-[#97a398]">
                              +{alum.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {alum.linkedin_link && (
                            <a
                              href={alum.linkedin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium text-[#24543f] hover:underline"
                            >
                              LinkedIn{" "}
                              <FaExternalLinkAlt className="text-[10px]" />
                            </a>
                          )}
                          {alum.portfolio_link && (
                            <a
                              href={alum.portfolio_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium text-[#24543f] hover:underline"
                            >
                              Portfolio{" "}
                              <FaExternalLinkAlt className="text-[10px]" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        {connectedMentorIds.has(alum.id ?? "") ? (
                          <span className="whitespace-nowrap rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                            Connected mentor
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={isPending || !studentId || !alum.id}
                            className="whitespace-nowrap rounded-full bg-[#24543f] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1d4332] disabled:opacity-50"
                            onClick={() => {
                              setSelectedAlum(alum);
                              setRequestError("");
                            }}
                          >
                            Send Request
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {selectedAlum && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !loadingAlumId)
                setSelectedAlum(null);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="request-title"
              className="w-full max-w-lg rounded-3xl border border-[#e3eadf] bg-white p-6 shadow-2xl"
            >
              <h2
                id="request-title"
                className="text-xl font-semibold text-[#23392f]"
              >
                Request mentorship
              </h2>
              <p className="mt-1 text-sm text-[#66746a]">
                Sending to {selectedAlum.name}. Choose at least one topic.
              </p>
              <fieldset className="mt-5">
                <legend className="mb-2 text-sm font-medium text-[#23392f]">
                  Topics <span className="text-red-500">*</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {["placements", "higher_studies", "general"].map((tag) => (
                    <label
                      key={tag}
                      className={`cursor-pointer rounded-full border px-3 py-2 text-sm ${selectedTags.includes(tag) ? "border-[#24543f] bg-[#e8f0e8] text-[#24543f]" : "border-[#dce5d8] text-[#66746a]"}`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selectedTags.includes(tag)}
                        onChange={() =>
                          setSelectedTags((tags) =>
                            tags.includes(tag)
                              ? tags.filter((item) => item !== tag)
                              : [...tags, tag],
                          )
                        }
                      />
                      #{tag}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="mt-5 block text-sm font-medium text-[#23392f]">
                Description{" "}
                <span className="font-normal text-[#97a398]">(optional)</span>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What would you like guidance with?"
                  className="mt-2 w-full resize-y rounded-xl border border-[#dce5d8] bg-[#fbfcfa] p-3 text-sm outline-none focus:border-[#24543f]"
                />
              </label>
              {requestError && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  {requestError}
                </p>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={!!loadingAlumId}
                  onClick={() => setSelectedAlum(null)}
                  className="rounded-xl border border-[#dce5d8] px-4 py-2 text-sm text-[#66746a] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedTags.length || !!loadingAlumId}
                  onClick={() => void submitRequest()}
                  className="rounded-xl bg-[#24543f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4332] disabled:opacity-50"
                >
                  {loadingAlumId ? "Sending…" : "Send request"}
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
