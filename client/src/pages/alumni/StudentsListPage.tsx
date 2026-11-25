import { useState, type FormEvent } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import {
  FaExternalLinkAlt,
  FaPaperPlane,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { useParams } from "react-router";
import { Filters, type FilterValues } from "../../components/Filters";
import { Sidebar } from "../../components/Sidebar";
import {
  useGetConnectedStudents,
  useSendMentorshipMail,
} from "../../hooks/use-mentorship";
import type { ConnectedStudent } from "../../api/mentorship";

const rowKey = (student: ConnectedStudent) => student.id ?? student.email;

export const StudentsListPage = () => {
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const userEmail = user.email ?? "Alumni";
  const { alumniId = "" } = useParams();
  const {
    data: students = [],
    isLoading,
    isError,
  } = useGetConnectedStudents(alumniId);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({ skill: "" });
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    () => new Set(),
  );
  const [studentDetails, setStudentDetails] = useState<ConnectedStudent | null>(
    null,
  );
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mailRecipients, setMailRecipients] = useState<ConnectedStudent[]>([]);
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [mailError, setMailError] = useState("");
  const [mailNotice, setMailNotice] = useState("");
  const sendMail = useSendMentorshipMail();

  const query = search.trim().toLowerCase();
  const skill = filters.skill.trim().toLowerCase();
  const studentsList = students.filter((student) => {
    const matchesSearch = [
      student.name,
      student.roll_no,
      student.branch,
      student.email,
      student.college,
    ].some((value) => value?.toLowerCase().includes(query));

    return (
      matchesSearch &&
      (filters.batch_year === undefined ||
        Number(student.batch_year) === filters.batch_year) &&
      (filters.cgpa === undefined || Number(student.cgpa) > filters.cgpa) &&
      (!skill ||
        student.skills.some((value) => value.trim().toLowerCase() === skill)) &&
      (!filters.tags || student.tags.includes(filters.tags))
    );
  });

  const visibleKeys = studentsList.map(rowKey);
  const selectedRecipients = students.filter((student) =>
    selectedStudents.has(rowKey(student)),
  );
  const allVisibleSelected =
    visibleKeys.length > 0 &&
    visibleKeys.every((key) => selectedStudents.has(key));

  const toggleStudent = (key: string) => {
    setSelectedStudents((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleVisibleStudents = () => {
    setSelectedStudents((current) => {
      const next = new Set(current);
      if (allVisibleSelected) visibleKeys.forEach((key) => next.delete(key));
      else visibleKeys.forEach((key) => next.add(key));
      return next;
    });
  };

  const openMailModal = () => {
    setMailRecipients(selectedRecipients);
    setMailSubject("");
    setMailBody("");
    setMailError("");
    setMailModalOpen(true);
  };

  const sendSelectedMail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMailError("");
    try {
      const result = await sendMail.mutateAsync({
        alumniId,
        mail: {
          studentIds: mailRecipients
            .map((student) => student.id)
            .filter((id): id is string => Boolean(id)),
          subject: mailSubject.trim(),
          body: mailBody,
        },
      });
      setMailNotice(
        result.failedCount
          ? `Email sent to ${result.sentCount} student${result.sentCount === 1 ? "" : "s"}; ${result.failedCount} delivery${result.failedCount === 1 ? "" : "s"} failed.`
          : `Email sent to ${result.sentCount} student${result.sentCount === 1 ? "" : "s"}.`,
      );
      setSelectedStudents(new Set());
      setMailModalOpen(false);
    } catch (error) {
      setMailError(
        error instanceof Error
          ? error.message
          : "Unable to send email. Please try again.",
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
              My Students
            </h1>
            <p className="mt-1 text-sm text-[#66746a]">
              {isLoading
                ? "Loading…"
                : `${studentsList.length} student${studentsList.length === 1 ? "" : "s"} shown${selectedStudents.size ? ` · ${selectedStudents.size} selected` : ""}`}
            </p>
          </div>
          <label className="relative w-full sm:w-72">
            <span className="sr-only">Search students</span>
            <FaSearch
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#97a398]"
            />
            <input
              type="search"
              placeholder="Search name, roll no, branch…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-[#dce5d8] bg-white py-2.5 pl-9 pr-4 text-sm text-[#23392f] outline-none placeholder:text-[#98a59a] focus:border-[#24543f]"
            />
          </label>
        </header>

        <Filters search={setFilters} showTags />
        {mailNotice && (
          <p
            role="status"
            className="mb-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {mailNotice}
          </p>
        )}
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            disabled={
              !selectedRecipients.length ||
              selectedRecipients.some(
                (student) => !student.id || !student.email,
              )
            }
            onClick={openMailModal}
            className="flex items-center gap-2 rounded-xl bg-[#24543f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4332] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaPaperPlane aria-hidden="true" />
            Send Email ({selectedRecipients.length})
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-[#e3eadf] bg-white shadow-[0_4px_16px_rgba(23,61,45,0.05)]">
          {isLoading ? (
            <div
              role="status"
              className="flex h-full items-center justify-center"
            >
              <span className="sr-only">Loading students</span>
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#24543f] border-t-transparent" />
            </div>
          ) : isError ? (
            <div
              role="alert"
              className="flex h-full items-center justify-center text-sm text-red-500"
            >
              Failed to load students. Please try again.
            </div>
          ) : (
            <table className="w-full min-w-195 text-sm">
              <thead className="sticky top-0 z-10 bg-[#f7faf5]">
                <tr className="border-b border-[#e3eadf] text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#66746a]">
                  <th scope="col" className="w-12 px-4 py-3.5">
                    <input
                      type="checkbox"
                      aria-label="Select all visible students"
                      checked={allVisibleSelected}
                      onChange={toggleVisibleStudents}
                      disabled={visibleKeys.length === 0}
                      className="h-4 w-4 cursor-pointer accent-[#24543f] disabled:cursor-not-allowed"
                    />
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Student
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Tags
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    View more
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4ec]">
                {studentsList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-16 text-center text-[#97a398]"
                    >
                      No students match your search or filters.
                    </td>
                  </tr>
                ) : (
                  studentsList.map((student) => {
                    const key = rowKey(student);
                    return (
                      <tr key={key} className="transition hover:bg-[#f7faf5]">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedStudents.has(key)}
                            onChange={() => toggleStudent(key)}
                            aria-label={`Select ${student.name}`}
                            className="h-4 w-4 cursor-pointer accent-[#24543f]"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex min-w-56 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f0e8] text-sm font-semibold text-[#24543f]">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-[#23392f]">
                                {student.name}
                              </p>
                              <a
                                href={`mailto:${student.email}`}
                                className="block truncate text-xs text-[#66746a] hover:text-[#24543f] hover:underline"
                              >
                                {student.email}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex max-w-56 flex-wrap gap-1.5">
                            {student.tags.length ? (
                              student.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-[#e8f0e8] px-2.5 py-1 text-[11px] font-medium text-[#24543f]"
                                >
                                  #{tag.replaceAll("_", " ")}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-[#97a398]">
                                No tags
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p
                            title={student.description}
                            className="line-clamp-2 max-w-sm whitespace-pre-wrap text-sm leading-5 text-[#66746a]"
                          >
                            {student.description || (
                              <span className="italic text-[#97a398]">
                                No description
                              </span>
                            )}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => setStudentDetails(student)}
                            className="whitespace-nowrap rounded-lg border border-[#dce5d8] px-3 py-2 text-xs font-semibold text-[#24543f] transition hover:border-[#24543f] hover:bg-[#f7faf5]"
                          >
                            View more
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {mailModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17251d]/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !sendMail.isPending)
              setMailModalOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="mail-selected-title"
            className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#e3eadf] bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#edf2ea] bg-[#f7faf5] px-6 py-5">
              <div>
                <h2
                  id="mail-selected-title"
                  className="text-xl font-semibold text-[#23392f]"
                >
                  Email selected students
                </h2>
                <p className="mt-1 text-sm text-[#66746a]">
                  This message will be sent individually to{" "}
                  {mailRecipients.length} student
                  {mailRecipients.length === 1 ? "" : "s"}.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close email composer"
                disabled={sendMail.isPending}
                onClick={() => setMailModalOpen(false)}
                className="rounded-lg p-2 text-[#66746a] hover:bg-white hover:text-[#23392f] disabled:opacity-50"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </header>

            <form onSubmit={(event) => void sendSelectedMail(event)}>
              <div className="space-y-5 p-6">
                <label className="block text-sm font-semibold text-[#23392f]">
                  To
                  <textarea
                    readOnly
                    disabled
                    rows={Math.min(4, Math.max(2, mailRecipients.length))}
                    value={mailRecipients
                      .map((student) => student.email)
                      .join(", ")}
                    className="mt-2 w-full resize-y rounded-xl border border-[#dce5d8] bg-[#f7faf5] px-4 py-3 text-sm font-normal text-[#3e4d43] outline-none"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#23392f]">
                  Subject <span className="text-red-500">*</span>
                  <input
                    type="text"
                    required
                    maxLength={180}
                    value={mailSubject}
                    onChange={(event) => setMailSubject(event.target.value)}
                    placeholder="Subject"
                    className="mt-2 w-full rounded-xl border border-[#dce5d8] bg-[#fbfcfa] px-4 py-3 text-sm font-normal text-[#23392f] outline-none placeholder:text-[#98a59a] focus:border-[#24543f]"
                  />
                </label>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#23392f]">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div
                    data-color-mode="light"
                    className="overflow-hidden rounded-xl border border-[#dce5d8]"
                  >
                    <MDEditor
                      value={mailBody}
                      onChange={(value) => setMailBody(value ?? "")}
                      preview="live"
                      height={320}
                      textareaProps={{
                        "aria-label": "Email message in Markdown",
                        placeholder: "Write your message using Markdown…",
                      }}
                    />
                  </div>
                </div>
                {mailError && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {mailError}
                  </p>
                )}
              </div>
              <footer className="flex justify-end gap-3 border-t border-[#edf2ea] bg-[#f9fbf7] px-6 py-4">
                <button
                  type="button"
                  disabled={sendMail.isPending}
                  onClick={() => setMailModalOpen(false)}
                  className="rounded-xl border border-[#dce5d8] px-4 py-2.5 text-sm font-medium text-[#66746a] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !mailRecipients.length ||
                    !mailSubject.trim() ||
                    !mailBody.trim() ||
                    sendMail.isPending
                  }
                  className="flex items-center gap-2 rounded-xl bg-[#24543f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4332] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaPaperPlane aria-hidden="true" />
                  {sendMail.isPending ? "Sending…" : "Send email"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {studentDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17251d]/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setStudentDetails(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-details-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#e3eadf] bg-white shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#edf2ea] bg-[#f7faf5] px-6 py-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0e8] text-lg font-semibold text-[#24543f]">
                  {studentDetails.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2
                    id="student-details-title"
                    className="truncate text-lg font-semibold text-[#23392f]"
                  >
                    {studentDetails.name}
                  </h2>
                  <p className="truncate text-sm text-[#66746a]">
                    {studentDetails.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close student details"
                onClick={() => setStudentDetails(null)}
                className="rounded-lg p-2 text-[#66746a] hover:bg-white hover:text-[#23392f]"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </header>

            <div className="space-y-6 p-6">
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#66746a]">
                  Mentorship
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {studentDetails.tags.length ? (
                    studentDetails.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#e8f0e8] px-3 py-1 text-xs font-medium text-[#24543f]"
                      >
                        #{tag.replaceAll("_", " ")}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#97a398]">No tags</span>
                  )}
                </div>
                <div className="mt-3 rounded-xl border border-[#edf2ea] bg-[#fbfcfa] p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#66746a]">
                    Description
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#3e4d43]">
                    {studentDetails.description || (
                      <span className="italic text-[#97a398]">
                        No description provided.
                      </span>
                    )}
                  </p>
                </div>
              </section>

              {studentDetails.bio && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#66746a]">
                    About
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#3e4d43]">
                    {studentDetails.bio}
                  </p>
                </section>
              )}

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#66746a]">
                  Student details
                </h3>
                <dl className="mt-3 grid gap-x-6 gap-y-4 rounded-xl bg-[#f7faf5] p-4 sm:grid-cols-2">
                  {[
                    ["Roll number", studentDetails.roll_no],
                    ["Branch", studentDetails.branch],
                    [
                      "Semester",
                      studentDetails.semester
                        ? `Semester ${studentDetails.semester}`
                        : "—",
                    ],
                    ["Batch year", studentDetails.batch_year],
                    ["CGPA", studentDetails.cgpa],
                    ["College", studentDetails.college],
                    ["Age", studentDetails.age],
                    ["Gender", studentDetails.gender],
                    ["Phone", studentDetails.phone],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-[#829086]">{label}</dt>
                      <dd className="mt-0.5 wrap-break-word text-sm font-medium text-[#3e4d43]">
                        {value || "—"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#66746a]">
                  Skills & links
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {studentDetails.skills.length ? (
                    studentDetails.skills.map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-[#f0f4ec] px-2.5 py-1 text-xs text-[#3e5c42]"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#97a398]">
                      No skills listed
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-4">
                  {studentDetails.linkedin_link && (
                    <a
                      href={studentDetails.linkedin_link}
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
                  {studentDetails.portfolio_link && (
                    <a
                      href={studentDetails.portfolio_link}
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
              </section>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
