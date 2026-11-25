import { FaExternalLinkAlt } from "react-icons/fa";
import { useParams } from "react-router";
import { Sidebar } from "../../components/Sidebar";
import {
  useGetAllMentors,
  useGetStudentRequests,
} from "../../hooks/use-mentorship";

export default function Requests() {
  const { studentId = "" } = useParams();
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const requestsQuery = useGetStudentRequests(studentId);
  const mentorsQuery = useGetAllMentors(studentId);
  const requests = requestsQuery.data ?? [];
  const mentors = mentorsQuery.data ?? [];
  const isLoading = requestsQuery.isLoading || mentorsQuery.isLoading;
  const isError = requestsQuery.isError || mentorsQuery.isError;

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
              : `${requests.length} pending · ${mentors.length} accepted`}
          </p>
        </header>

        {isLoading ? (
          <div
            role="status"
            className="flex min-h-64 items-center justify-center rounded-2xl border border-[#e3eadf] bg-white"
          >
            <span className="sr-only">Loading mentorship status</span>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#24543f] border-t-transparent" />
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-100 bg-white p-5 text-sm text-red-600"
          >
            Unable to load your mentorship status.{" "}
            <button
              type="button"
              onClick={() => {
                void requestsQuery.refetch();
                void mentorsQuery.refetch();
              }}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        ) : requests.length === 0 && mentors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dce5d8] bg-white p-10 text-center">
            <h2 className="font-semibold text-[#23392f]">
              No mentorship activity yet
            </h2>
            <p className="mt-2 text-sm text-[#66746a]">
              Your pending requests and accepted mentor connections will show up
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {requests.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-[#23392f]">
                    Awaiting a response
                  </h2>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {requests.length} pending
                  </span>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {requests.map((request) => (
                    <article
                      key={request.request_id}
                      className="overflow-hidden rounded-2xl border border-[#e3eadf] bg-white shadow-[0_4px_16px_rgba(23,61,45,0.05)]"
                    >
                      <div className="flex items-start justify-between gap-3 border-b border-[#edf2ea] bg-[#f9fbf7] px-5 py-4">
                        <div>
                          <h3 className="font-semibold text-[#23392f]">
                            {request.name}
                          </h3>
                          <p className="mt-1 text-sm text-[#66746a]">
                            {[request.current_position, request.current_company]
                              .filter(Boolean)
                              .join(" at ") || "Alumni mentor"}
                          </p>
                        </div>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          Pending
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
                    </article>
                  ))}
                </div>
              </section>
            )}

            {mentors.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-[#23392f]">
                    Accepted connections
                  </h2>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {mentors.length} accepted
                  </span>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {mentors.map((mentor) => (
                    <article
                      key={mentor.id ?? mentor.email}
                      className="rounded-2xl border border-[#e3eadf] bg-white p-5 shadow-[0_4px_16px_rgba(23,61,45,0.05)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f0e8] font-semibold text-[#24543f]">
                            {mentor.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#23392f]">
                              {mentor.name}
                            </h3>
                            <p className="mt-1 text-sm text-[#66746a]">
                              {[mentor.current_position, mentor.current_company]
                                .filter(Boolean)
                                .join(" at ") || "Alumni mentor"}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Accepted
                        </span>
                      </div>
                      {mentor.bio && (
                        <p className="mt-4 text-sm leading-6 text-[#66746a]">
                          {mentor.bio}
                        </p>
                      )}
                      {mentor.skills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {mentor.skills.slice(0, 5).map((item) => (
                            <span
                              key={item}
                              className="rounded-md bg-[#f0f4ec] px-2 py-1 text-xs text-[#3e5c42]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 flex flex-wrap gap-4 border-t border-[#edf2ea] pt-4">
                        <a
                          href={`mailto:${mentor.email}`}
                          className="text-xs font-medium text-[#24543f] hover:underline"
                        >
                          {mentor.email}
                        </a>
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
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
