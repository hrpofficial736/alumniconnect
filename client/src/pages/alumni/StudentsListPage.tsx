import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { useGetConnectedStudents } from "../../hooks/use-mentorship";
import { FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import { useParams } from "react-router";
import { Filters, type FilterValues } from "../../components/Filters";

const CGPA_COLOR = (cgpa: number) => {
  if (cgpa >= 8.5) return "text-emerald-600 bg-emerald-50";
  if (cgpa >= 7) return "text-blue-600 bg-blue-50";
  return "text-orange-600 bg-orange-50";
};

export const StudentsListPage = () => {
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const userEmail = user.email ?? "Alumni";

  const { alumniId = "" } = useParams();
  const {
    data: students,
    isLoading,
    isError,
  } = useGetConnectedStudents(alumniId);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState<FilterValues>({ skill: "" });
  const q = search.trim().toLowerCase();
  const skill = filters.skill.trim().toLowerCase();
  const studentsList = (students ?? []).filter((a) => {
    const matchesSearch = [
      a.name,
      a.roll_no,
      a.branch,
      a.email,
      a.college,
    ].some((value) => value?.toLowerCase().includes(q));

    return (
      matchesSearch &&
      (filters.batch_year === undefined ||
        Number(a.batch_year) === filters.batch_year) &&
      (filters.cgpa === undefined || Number(a.cgpa) > filters.cgpa) &&
      (!skill || a.skills.some((value) => value.trim().toLowerCase() === skill))
    );
  });

  return (
    <div className="flex h-screen bg-[#fbfaf6]">
      <Sidebar role="alumni" id={alumniId} userEmail={userEmail} />

      <main className="flex-1 flex flex-col overflow-hidden px-6 py-8 sm:px-10">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#23392f]">Students</h1>
            <p className="mt-0.5 text-sm text-[#66746a]">
              {isLoading
                ? "Loading…"
                : `${studentsList.length} student${studentsList.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#97a398] text-sm" />
            <input
              type="text"
              placeholder="Search name, roll no, branch…"
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
              Failed to load students. Please try again.
            </div>
          )}

          {!isLoading && !isError && (
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-[#f7faf5]">
                <tr className="border-b border-[#e3eadf] text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#66746a]">
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Roll No</th>
                  <th className="px-5 py-3.5">Branch</th>
                  <th className="px-5 py-3.5">Semester</th>
                  <th className="px-5 py-3.5">Batch</th>
                  <th className="px-5 py-3.5">CGPA</th>
                  <th className="px-5 py-3.5">Skills</th>
                  <th className="px-5 py-3.5">Links</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0f4ec]">
                {studentsList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-[#97a398]"
                    >
                      No students match your search.
                    </td>
                  </tr>
                ) : (
                  studentsList.map((student, i) => (
                    <tr
                      key={student.roll_no ?? i}
                      className="transition hover:bg-[#f7faf5]"
                    >
                      {/* Name + email */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f0e8] text-xs font-semibold text-[#24543f]">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-[#23392f]">
                              {student.name}
                            </p>
                            <p className="text-xs text-[#97a398]">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Roll no */}
                      <td className="px-5 py-3.5 font-mono text-xs text-[#3e4d43]">
                        {student.roll_no}
                      </td>

                      {/* Branch */}
                      <td className="px-5 py-3.5 text-[#3e4d43]">
                        {student.branch}
                      </td>

                      {/* Semester */}
                      <td className="px-5 py-3.5 text-[#3e4d43]">
                        Sem {student.semester}
                      </td>

                      {/* Batch */}
                      <td className="px-5 py-3.5 text-[#3e4d43]">
                        {student.batch_year}
                      </td>

                      {/* CGPA */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${CGPA_COLOR(student.cgpa)}`}
                        >
                          {student.cgpa}
                        </span>
                      </td>

                      {/* Skills */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {student.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md bg-[#f0f4ec] px-2 py-0.5 text-xs text-[#3e5c42]"
                            >
                              {skill}
                            </span>
                          ))}
                          {student.skills.length > 3 && (
                            <span className="rounded-md bg-[#f0f4ec] px-2 py-0.5 text-xs text-[#97a398]">
                              +{student.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Links */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {student.linkedin_link && (
                            <a
                              href={student.linkedin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-[#24543f] hover:underline flex items-center gap-1"
                            >
                              LinkedIn{" "}
                              <FaExternalLinkAlt className="text-[10px]" />
                            </a>
                          )}
                          {student.portfolio_link && (
                            <a
                              href={student.portfolio_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-[#24543f] hover:underline flex items-center gap-1"
                            >
                              Portfolio{" "}
                              <FaExternalLinkAlt className="text-[10px]" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};
