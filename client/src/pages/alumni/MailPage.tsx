import { useState, type FormEvent } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";

import { FaPaperPlane } from "react-icons/fa";
import { useParams } from "react-router";
import { Sidebar } from "../../components/Sidebar";
import { useSendMentorshipMail } from "../../hooks/use-mentorship";
import type { MentorshipTag } from "../../types/types";

const MAIL_TAGS: { value: MentorshipTag; label: string }[] = [
  { value: "placements", label: "Placements" },
  { value: "higher_studies", label: "Higher studies" },
  { value: "general", label: "General" },
];

export default function MailPage() {
  const { alumniId = "" } = useParams();
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const [tags, setTags] = useState<MentorshipTag[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const sendMail = useSendMentorshipMail();

  const toggleTag = (tag: MentorshipTag) => {
    setTags((selected) =>
      selected.includes(tag)
        ? selected.filter((item) => item !== tag)
        : [...selected, tag],
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResult("");
    try {
      const delivery = await sendMail.mutateAsync({
        alumniId,
        mail: { tags, subject: subject.trim(), body },
      });
      setResult(
        delivery.failedCount
          ? `Sent to ${delivery.sentCount} student${delivery.sentCount === 1 ? "" : "s"}; ${delivery.failedCount} ${delivery.failedCount === 1 ? "delivery failed" : "deliveries failed"}.`
          : `Email sent to ${delivery.sentCount} student${delivery.sentCount === 1 ? "" : "s"}.`,
      );
      if (delivery.sentCount > 0) {
        setSubject("");
        setBody("");
      }
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Unable to send email. Please try again.",
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#fbfaf6]">
      <Sidebar role="alumni" id={alumniId} userEmail={user.email ?? "Alumni"} />
      <main className="min-w-0 flex-1 overflow-auto px-6 py-8 sm:px-10">
        <header className="mb-6">
          <p className="text-sm font-medium text-[#66806d]">Stay in touch</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#23392f]">
            Mail your mentees
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#66746a]">
            Choose one or more topics. Your email will go individually to each
            connected student whose mentorship includes at least one selected
            topic.
          </p>
        </header>

        <form
          onSubmit={(event) => void submit(event)}
          className="max-w-5xl overflow-hidden rounded-2xl border border-[#e3eadf] bg-white shadow-[0_4px_16px_rgba(23,61,45,0.05)]"
        >
          <div className="space-y-6 p-5 sm:p-7">
            <fieldset>
              <legend className="text-sm font-semibold text-[#23392f]">
                Send to students under{" "}
                <span className="text-[#24543f]">topics</span>
                <span className="ml-1 text-red-500">*</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {MAIL_TAGS.map(({ value, label }) => {
                  const checked = tags.includes(value);
                  return (
                    <label
                      key={value}
                      className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition ${checked ? "border-[#24543f] bg-[#e8f0e8] text-[#24543f]" : "border-[#dce5d8] bg-white text-[#66746a] hover:border-[#a8c2a7]"}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTag(value)}
                        className="sr-only"
                      />
                      #{label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <label className="block text-sm font-semibold text-[#23392f]">
              Subject <span className="text-red-500">*</span>
              <input
                type="text"
                required
                maxLength={180}
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="A quick update for my mentees"
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
                  value={body}
                  onChange={(value) => setBody(value ?? "")}
                  preview="live"
                  height={360}
                  textareaProps={{
                    "aria-label": "Email message in Markdown",
                    placeholder: "Write your message using Markdown…",
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-[#829086]">
                Use the toolbar for headings, lists, links, quotes, code, and
                other Markdown formatting.
              </p>
            </div>
          </div>

          {(error || result) && (
            <p
              role={error ? "alert" : "status"}
              className={`border-t px-5 py-3 text-sm sm:px-7 ${error ? "border-red-100 bg-red-50 text-red-700" : "border-emerald-100 bg-emerald-50 text-emerald-800"}`}
            >
              {error || result}
            </p>
          )}

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf2ea] bg-[#f9fbf7] px-5 py-4 sm:px-7">
            <p className="text-xs text-[#829086]">
              Choose at least one topic and add a subject and message.
            </p>
            <button
              type="submit"
              disabled={
                !alumniId ||
                tags.length === 0 ||
                !subject.trim() ||
                !body.trim() ||
                sendMail.isPending
              }
              className="flex items-center gap-2 rounded-xl bg-[#24543f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4332] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaPaperPlane aria-hidden="true" />
              {sendMail.isPending ? "Sending…" : "Send email"}
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
