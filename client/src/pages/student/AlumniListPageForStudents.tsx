import {  useState } from 'react'
import { Sidebar } from '../../components/Sidebar'
import { useGetAllAlumni } from '../../hooks/use-alumni'
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa'
import { useParams } from 'react-router'

const CGPA_COLOR = (cgpa: number) => {
  if (cgpa >= 8.5) return 'text-emerald-600 bg-emerald-50'
  if (cgpa >= 7) return 'text-blue-600 bg-blue-50'
  return 'text-orange-600 bg-orange-50'
}

export const AlumniListPageForStudents = () => {
  const { studentId } = useParams()
  const { data: alumni, isLoading, isError } = useGetAllAlumni()
const [search, setSearch] = useState('')
  const filtered = (alumni ?? []).filter((a) => {
    const q = search.toLowerCase()
    return (
      a.name.toLowerCase().includes(q) ||
      a.roll_no.toLowerCase().includes(q) ||
      a.branch.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.current_company.toLowerCase().includes(q) ||
      a.current_position.toLowerCase().includes(q)
    )
  })

  // insert sidebar
  return (
    <div className="flex h-screen bg-[#fbfaf6]">
      <Sidebar role="student" id={studentId} userName={"Student"} />

      <main className="flex-1 flex flex-col overflow-hidden px-6 py-8 sm:px-10">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#23392f]">Alumni</h1>
            <p className="mt-0.5 text-sm text-[#66746a]">
              {isLoading ? 'Loading…' : `${filtered.length} alumn${filtered.length !== 1 ? 'i' : 'us'} found`}
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
                  <th className="px-5 py-3.5">Alumni</th>
                  <th className="px-5 py-3.5">Roll No</th>
                  <th className="px-5 py-3.5">Branch</th>
                  <th className="px-5 py-3.5">Batch</th>
                  <th className="px-5 py-3.5">Company</th>
                  <th className="px-5 py-3.5">Position</th>
                  <th className="px-5 py-3.5">CGPA</th>
                  <th className="px-5 py-3.5">Skills</th>
                  <th className="px-5 py-3.5">Links</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0f4ec]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-[#97a398]">
                      No alumni match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((alum, i) => (
                    <tr key={alum.roll_no ?? i} className="transition hover:bg-[#f7faf5]">

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f0e8] text-xs font-semibold text-[#24543f]">
                            {alum.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-[#23392f]">{alum.name}</p>
                            <p className="text-xs text-[#97a398]">{alum.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-mono text-xs text-[#3e4d43]">{alum.roll_no}</td>

                      <td className="px-5 py-3.5 text-[#3e4d43]">{alum.branch}</td>

                      <td className="px-5 py-3.5 text-[#3e4d43]">{alum.batch_year}</td>

                      <td className="px-5 py-3.5 text-[#3e4d43]">{alum.current_company || '—'}</td>

                      <td className="px-5 py-3.5 text-[#3e4d43]">{alum.current_position || '—'}</td>

                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${CGPA_COLOR(alum.cgpa)}`}>
                          {alum.cgpa}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {alum.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="rounded-md bg-[#f0f4ec] px-2 py-0.5 text-xs text-[#3e5c42]">
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
                            <a href={alum.linkedin_link} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium text-[#24543f] hover:underline">
                              LinkedIn <FaExternalLinkAlt className="text-[10px]" />
                            </a>
                          )}
                          {alum.portfolio_link && (
                            <a href={alum.portfolio_link} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium text-[#24543f] hover:underline">
                              Portfolio <FaExternalLinkAlt className="text-[10px]" />
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
  )
}
