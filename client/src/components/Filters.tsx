import { useId, useState } from "react";
import { FaFilter } from "react-icons/fa";
import type { MentorshipTag } from "../types/types";

export interface FilterValues {
  batch_year?: number;
  cgpa?: number;
  skill: string;
  tags?: MentorshipTag | "";
}

interface FiltersProps {
  search: (filters: FilterValues) => void;
  showTags?: boolean;
}

const emptyFilters: FilterValues = { skill: "", tags: "" };
const inputClass =
  "w-full rounded-xl border border-[#dce5d8] bg-[#fbfcfa] px-4 py-2.5 text-sm text-[#23392f] outline-none transition placeholder:text-[#98a59a] focus:border-[#24543f] focus:ring-2 focus:ring-[#24543f]/10";

export const Filters = ({ search, showTags = false }: FiltersProps) => {
  const [filters, setFilters] = useState<FilterValues>(emptyFilters);
  const id = useId();
  const hasFilters =
    filters.batch_year !== undefined ||
    filters.cgpa !== undefined ||
    filters.skill !== "" ||
    Boolean(filters.tags);

  const updateFilters = (values: FilterValues) => {
    setFilters(values);
  };

  const searchList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    search(filters);
  };

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="rounded-2xl border border-[#e3eadf] bg-white p-5 shadow-[0_4px_16px_rgba(23,61,45,0.05)] mb-3"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id={`${id}-heading`}
          className="flex items-center gap-2 text-sm font-semibold text-[#23392f]"
        >
          <FaFilter className="text-[#24543f]" aria-hidden="true" />
          Filter
        </h2>
        <button
          type="button"
          disabled={!hasFilters}
          onClick={() => {
            updateFilters({ ...emptyFilters });
            search({ ...emptyFilters });
          }}
          className="cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold text-[#24543f] transition hover:bg-[#f0f4ec] disabled:cursor-default disabled:opacity-40"
        >
          Clear filters
        </button>
      </div>

      <div
        className={`grid gap-4 items-end ${showTags ? "sm:grid-cols-5" : "sm:grid-cols-4"}`}
      >
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#66746a]">
            Batch year
          </span>
          <input
            type="number"
            step="1"
            placeholder="e.g. 2024"
            value={filters.batch_year ?? ""}
            onChange={(event) =>
              updateFilters({
                ...filters,
                batch_year: Number.isFinite(event.target.valueAsNumber)
                  ? event.target.valueAsNumber
                  : undefined,
              })
            }
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#66746a]">
            CGPA greater than
          </span>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            placeholder="e.g. 8.0"
            value={filters.cgpa ?? ""}
            onChange={(event) =>
              updateFilters({
                ...filters,
                cgpa: Number.isFinite(event.target.valueAsNumber)
                  ? event.target.valueAsNumber
                  : undefined,
              })
            }
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#66746a]">
            Skill
          </span>
          <input
            type="text"
            placeholder="e.g. React"
            value={filters.skill}
            onChange={(event) =>
              updateFilters({ ...filters, skill: event.target.value })
            }
            className={inputClass}
          />
        </label>
        {showTags && (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#66746a]">
              Tags
            </span>
            <select
              value={filters.tags ?? ""}
              onChange={(event) =>
                updateFilters({
                  ...filters,
                  tags: event.target.value as MentorshipTag | "",
                })
              }
              className={inputClass}
            >
              <option value="">All tags</option>
              <option value="placements">#placements</option>
              <option value="higher_studies">#higher studies</option>
              <option value="general">#general</option>
            </select>
          </label>
        )}
        <button
          onClick={searchList}
          className="flex justify-center px-3 py-3 cursor-pointer items-center gap-2 rounded-xl bg-[#24543f] text-sm font-medium text-white transition hover:bg-[#1d4332] disabled:opacity-60"
        >
          Search
        </button>
      </div>
    </section>
  );
};
