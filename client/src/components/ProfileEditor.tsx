import { useState, type FormEvent } from "react";
import { FaSave } from "react-icons/fa";
import { Sidebar } from "./Sidebar";
import type { Alumni, Student } from "../types/types";

export type ProfileRecord =
  Omit<Student, "password"> | Omit<Alumni, "password">;
export type ProfileSave = Omit<Student, "password"> | Omit<Alumni, "password">;
type ProfileRole = "student" | "alumni";
type Field = {
  key: string;
  label: string;
  type?: "text" | "email" | "number" | "url" | "textarea" | "skills";
};

const fieldsFor = (role: ProfileRole): Field[] => [
  { key: "name", label: "Full name" },
  { key: "email", label: "Email", type: "email" },
  { key: "bio", label: "About you", type: "textarea" },
  { key: "college", label: "College" },
  { key: "branch", label: "Branch" },
  { key: "roll_no", label: "Roll number" },
  { key: "batch_year", label: "Batch year", type: "number" },
  ...(role === "student"
    ? [
        { key: "semester", label: "Semester", type: "number" as const },
        { key: "cgpa", label: "CGPA", type: "number" as const },
      ]
    : [
        { key: "current_position", label: "Current position" },
        { key: "current_company", label: "Current company" },
      ]),
  { key: "age", label: "Age", type: "number" },
  { key: "gender", label: "Gender" },
  { key: "phone", label: "Phone" },
  { key: "skills", label: "Skills (comma separated)", type: "skills" },
  { key: "linkedin_link", label: "LinkedIn URL", type: "url" },
  { key: "portfolio_link", label: "Portfolio URL", type: "url" },
];

const getFormValues = (profile: ProfileRecord | undefined, fields: Field[]) => {
  const values: Record<string, string> = {};
  fields.forEach(({ key }) => {
    const value = profile
      ? (profile as unknown as Record<string, unknown>)[key]
      : "";
    values[key] = Array.isArray(value)
      ? value.join(", ")
      : value == null
        ? ""
        : String(value);
  });
  return values;
};

interface ProfileEditorProps {
  role: ProfileRole;
  id: string;
  userEmail: string;
  profile?: ProfileRecord;
  isLoading: boolean;
  isError: boolean;
  refetch: () => unknown;
  onSave: (data: ProfileSave) => Promise<unknown>;
  isSaving: boolean;
  saveError: string;
}

export function ProfileEditor({
  role,
  id,
  userEmail,
  profile,
  isLoading,
  isError,
  refetch,
  onSave,
  isSaving,
  saveError,
}: ProfileEditorProps) {
  const fields = fieldsFor(role);
  const [values, setValues] = useState<Record<string, string>>(() =>
    getFormValues(profile, fields),
  );
  const [saved, setSaved] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;
    setSaved(false);

    const payload: Record<string, unknown> = { ...profile };
    fields.forEach(({ key, type }) => {
      const value = values[key] ?? "";
      if (type === "skills") {
        payload[key] = value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      } else if (type === "number") {
        payload[key] = value === "" ? 0 : Number(value);
      } else {
        payload[key] = value.trim();
      }
    });

    try {
      await onSave(payload as ProfileSave);
      setSaved(true);
    } catch {
      setSaved(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#fbfaf6]">
      <Sidebar role={role} id={id} userEmail={userEmail} />
      <main className="min-w-0 flex-1 overflow-auto px-6 py-8 sm:px-10">
        <header className="mb-6">
          <p className="text-sm font-medium text-[#66806d]">Your account</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#23392f]">
            My profile
          </h1>
          <p className="mt-1 text-sm text-[#66746a]">
            Keep your details up to date so the community can get to know you.
          </p>
        </header>

        {isLoading ? (
          <div
            role="status"
            className="flex min-h-64 items-center justify-center rounded-2xl border border-[#e3eadf] bg-white"
          >
            <span className="sr-only">Loading profile</span>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#24543f] border-t-transparent" />
          </div>
        ) : isError || !profile ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-100 bg-white p-8 text-center text-sm text-red-600"
          >
            Unable to load your profile.{" "}
            <button
              type="button"
              onClick={() => void refetch()}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <form
            onSubmit={(event) => void submit(event)}
            className="overflow-hidden rounded-2xl border border-[#e3eadf] bg-white shadow-[0_4px_16px_rgba(23,61,45,0.05)]"
          >
            <div className="flex flex-wrap items-center gap-4 border-b border-[#edf2ea] bg-[#f7faf5] px-6 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f0e8] text-xl font-semibold text-[#24543f]">
                {(values.name || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#23392f]">
                  {values.name || "Your name"}
                </h2>
                <p className="text-sm text-[#66746a]">
                  {role === "student" ? "Student profile" : "Alumni profile"}
                </p>
              </div>
              {role === "alumni" &&
                (values.current_position || values.current_company) && (
                  <p className="ml-auto text-sm text-[#66746a]">
                    {[values.current_position, values.current_company]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
            </div>

            <div className="grid gap-x-5 gap-y-4 p-6 sm:grid-cols-2">
              {fields.map((field) => (
                <label
                  key={field.key}
                  htmlFor={`profile-${field.key}`}
                  className={`${field.type === "textarea" || field.type === "skills" ? "sm:col-span-2" : ""} block text-sm font-medium text-[#3e4d43]`}
                >
                  {field.label}
                  {field.type === "textarea" ? (
                    <textarea
                      id={`profile-${field.key}`}
                      rows={4}
                      value={values[field.key] ?? ""}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                      className="mt-1.5 w-full resize-y rounded-xl border border-[#dce5d8] bg-[#fbfcfa] px-3.5 py-2.5 text-sm font-normal text-[#23392f] outline-none focus:border-[#24543f]"
                    />
                  ) : (
                    <input
                      id={`profile-${field.key}`}
                      type={
                        field.type === "skills"
                          ? "text"
                          : (field.type ?? "text")
                      }
                      min={field.type === "number" ? 0 : undefined}
                      step={field.key === "cgpa" ? "0.01" : undefined}
                      value={values[field.key] ?? ""}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                      placeholder={
                        field.type === "skills"
                          ? "e.g. React, SQL, Product Design"
                          : undefined
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#dce5d8] bg-[#fbfcfa] px-3.5 py-2.5 text-sm font-normal text-[#23392f] outline-none placeholder:text-[#98a59a] focus:border-[#24543f]"
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf2ea] px-6 py-4">
              <div className="text-sm">
                {saveError && (
                  <p role="alert" className="text-red-600">
                    {saveError}
                  </p>
                )}
                {saved && (
                  <p role="status" className="text-emerald-700">
                    Profile saved successfully.
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-[#24543f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4332] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaSave aria-hidden="true" />
                  {isSaving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
