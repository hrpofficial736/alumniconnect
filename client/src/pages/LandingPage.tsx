import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

const featureList = [
  {
    number: "01",
    title: "Centralized Verified Database",
    description:
      "Maintain a single institutional record of alumni, verified through authenticated login so there are no duplicates and no unverifiable entries.",
  },
  {
    number: "02",
    title: "OAuth-Based Authentication",
    description:
      "Use OAuth or institutional email login so only verified individuals can create or access accounts.",
  },
  {
    number: "03",
    title: "Mentorship Matching",
    description:
      "Allow students to submit mentorship requests, while alumni opt in as mentors and get matched by domain, graduation year, or field.",
  },
  {
    number: "04",
    title: "Admin Portal with Reporting",
    description:
      "Give college staff a dashboard to view alumni data, generate reports, and manage the directory for accreditation or placement use.",
  },
  {
    number: "05",
    title: "Searchable Alumni Directory",
    description:
      "Enable search by graduation year, domain, company, or location so the right person can actually be found when needed.",
  },
  {
    number: "06",
    title: "Engagement Tracking",
    description:
      "Track profile activity, mentorship completions, and directory usage so admins can understand platform health and participation.",
  },
];

const quickStats = [
  { label: "Verified source of truth", value: "1" },
  { label: "Core feature blocks", value: "6" },
  { label: "Search dimensions", value: "4+" },
  { label: "Admin visibility", value: "Full" },
];

const navigationLinks = ["Overview", "Features", "Use cases", "Contact"];

function Icon({ name }: { name: string }) {
  const className = "h-4 w-4 shrink-0";

  if (name === "book-open") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16.5H6.5A2.5 2.5 0 0 0 4 22V5.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M20 19.5H6.5A2.5 2.5 0 0 0 4 22"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "arrow-up-right") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path d="M7 17 17 7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 7h8v8" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "shield-check") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="m12 2 7 3v5c0 5-3.1 8.8-7 12-3.9-3.2-7-7-7-12V5l7-3Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="m9.5 12 1.8 1.8L15.8 9.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <circle
          cx="11"
          cy="11"
          r="6.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "refresh-cw") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M3 12a9 9 0 0 1 15-6.7L21 8"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M3 20v-4h4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "handshake") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path d="M7 13 3 9l4-4 4 4" stroke="currentColor" strokeWidth="1.8" />
        <path d="m17 13 4-4-4-4-4 4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 13h3l2 2h2l1-1h2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "database") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <ellipse
          cx="12"
          cy="6"
          rx="7"
          ry="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "user-round") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="8"
          r="3.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M5 20a7 7 0 0 1 14 0"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "badge-check") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="m12 2 2.2 1.6 2.7.2 1.1 2.5 2.5 1.1-.2 2.7L22 12l-1.6 2.2.2 2.7-2.5 1.1-1.1 2.5-2.7.2L12 22l-2.2-1.6-2.7-.2-1.1-2.5-2.5-1.1.2-2.7L2 12l1.6-2.2-.2-2.7 2.5-1.1 1.1-2.5 2.7-.2L12 2Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="m9.5 12 1.8 1.8L15.6 9.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "briefcase-business") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M4 8h16v10H4z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 12h16" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  return null;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#24543F]">
      <span className="h-px w-[18px] bg-[#24543F]" />
      <span>{children}</span>
    </div>
  );
}

export const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const parsedUser: { role?: string; id?: string } = JSON.parse(storedUser);
      if (parsedUser.role && parsedUser.id) {
        navigate(`/dashboard/${parsedUser.role}/${parsedUser.id}`, {
          replace: true,
        });
      }
    } catch {
      localStorage.removeItem("user");
    }
  }, [navigate]);
  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#23392F]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col overflow-hidden">
        <header className="flex h-[96px] items-center justify-between border-b border-[#E6EBE3] px-6 sm:px-10 lg:px-20">
          <div className="flex items-center gap-3">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] bg-[#24543F] text-white shadow-[0_10px_20px_rgba(36,84,63,0.18)]">
              <Icon name="book-open" />
            </div>
            <div>
              <p className="text-[23px] font-semibold leading-[30px] text-[#23392F]">
                AlumniConnect
              </p>
              <p className="text-[12px] text-[#6B766D]">
                Verified alumni network for colleges
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navigationLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="cursor-pointer text-[14px] text-[#59665E] transition hover:text-[#23392F]"
              >
                {link}
              </a>
            ))}
          </nav>

          <Link
            to="/auth"
            className="inline-flex cursor-pointer items-center gap-3 rounded-[8px] bg-[#24543F] px-5 py-3 text-[13px] font-semibold text-white! transition hover:bg-[#1d4332]"
          >
            <span>Get started</span>
            <Icon name="arrow-up-right" />
          </Link>
        </header>

        <section className="relative overflow-hidden px-6 py-12 sm:px-10 lg:px-20 lg:py-16">
          <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(36,84,63,0.12),_transparent_34%),radial-gradient(circle_at_85%_18%,_rgba(160,194,167,0.22),_transparent_24%)]" />
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div className="space-y-8">
              <SectionLabel>Welcome</SectionLabel>

              <div className="space-y-6">
                <h1 className="max-w-[620px] font-serif text-[56px] leading-[1.05] text-[#23392F] sm:text-[68px] lg:text-[82px]">
                  A beautiful alumni platform built on trust, search, and
                  connection.
                </h1>
                <p className="max-w-[540px] text-[17px] leading-[1.7] text-[#59665E]">
                  AlumniConnect gives institutions a polished way to verify
                  alumni, match students to mentors, manage engagement, and keep
                  records useful for placements, reporting, and long-term
                  community building.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/auth"
                  className="inline-flex h-[52px] cursor-pointer items-center gap-3 rounded-[8px] bg-[#24543F] px-6 text-[14px] font-semibold text-white! transition hover:bg-[#1d4332]"
                >
                  <span>Get started</span>
                  <Icon name="arrow-up-right" />
                </Link>
                <a
                  href="#use-cases"
                  className="inline-flex h-[52px] cursor-pointer items-center rounded-[8px] border border-[#D8E1D5] bg-white px-6 text-[14px] font-semibold text-[#23392F] transition hover:bg-[#F9FAF8]"
                >
                  Learn more
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "One verified institutional alumni record",
                  "Searchable by year, domain, company, and location",
                  "Mentorship requests with alumni opt-in",
                  "Reporting for admin and accreditation needs",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] border border-[#E7ECE3] bg-white p-4 shadow-[0_12px_30px_rgba(23,61,45,0.06)]"
                  >
                    <p className="text-[14px] leading-[1.6] text-[#3E4C43]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[36px] bg-[linear-gradient(135deg,rgba(36,84,63,0.12),rgba(255,255,255,0))] blur-2xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-[#E5E9E1] bg-[#FAFBF8] p-5 shadow-[0_24px_70px_rgba(24,48,36,0.08)] lg:p-7">
                <div className="flex items-center justify-between border-b border-[#E6EBE3] pb-4">
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.2em] text-[#6B766D]">
                      Dashboard preview
                    </p>
                    <p className="mt-1 text-[22px] font-semibold text-[#23392F]">
                      Alumni directory at a glance
                    </p>
                  </div>
                  <div className="rounded-full bg-[#E9EEE5] px-3 py-1 text-[11px] font-semibold text-[#24543F]">
                    Verified profiles
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {quickStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[20px] border border-[#E7ECE3] bg-white p-5"
                    >
                      <p className="text-[12px] text-[#6B766D]">{stat.label}</p>
                      <p className="mt-2 text-[34px] leading-none font-semibold text-[#23392F]">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 rounded-[24px] border border-[#E7ECE3] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-[#23392F]">
                        Engagement snapshot
                      </p>
                      <p className="text-[12px] text-[#6B766D]">
                        Mentorship completions and directory activity
                      </p>
                    </div>
                    <Icon name="refresh-cw" />
                  </div>
                  <div className="h-2 rounded-full bg-[#EAEFE4]">
                    <div className="h-2 w-[72%] rounded-full bg-[linear-gradient(90deg,#24543F,#5E8A72,#8FB79C)]" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["Profile activity", "92% updated"],
                      ["Mentorships", "Active matching"],
                      ["Directory usage", "Staff + students"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-[14px] bg-[#F7F9F4] p-3"
                      >
                        <p className="text-[11px] text-[#6B766D]">{label}</p>
                        <p className="mt-1 text-[12px] font-semibold text-[#23392F]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-8 sm:px-10 lg:px-20">
          <div className="flex flex-col gap-5 border-y border-[#E6EBE3] py-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[720px] space-y-4">
              <SectionLabel>Core features</SectionLabel>
              <h2 className="font-serif text-[44px] leading-[1.08] text-[#23392F] sm:text-[52px]">
                Six features that keep alumni data useful, structured, and ready
                for action.
              </h2>
            </div>
            <p className="max-w-[420px] text-[16px] leading-[1.7] text-[#59665E]">
              The design keeps the interface calm and white so the product feels
              credible, modern, and easy to scan for staff, students, and
              alumni.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureList.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-[28px] border border-[#E7ECE3] bg-white p-6 shadow-[0_18px_50px_rgba(23,61,45,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(23,61,45,0.09)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E9EEE5] text-[12px] font-bold tracking-[0.18em] text-[#24543F]">
                    {feature.number}
                  </span>
                  <div className="h-11 w-11 rounded-2xl bg-[linear-gradient(135deg,#24543F,#7A9F85)] opacity-90" />
                </div>
                <h3 className="mt-6 text-[22px] font-semibold leading-[1.2] text-[#23392F]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#59665E]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="use-cases" className="px-6 py-12 sm:px-10 lg:px-20">
          <div className="grid gap-8 rounded-[32px] bg-[#F6F8F4] px-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:px-10 lg:py-10">
            <div className="space-y-5">
              <SectionLabel>Why it works</SectionLabel>
              <h2 className="font-serif text-[42px] leading-[1.08] text-[#23392F]">
                A simple system for colleges that need alumni data to actually
                do something.
              </h2>
              <p className="text-[16px] leading-[1.7] text-[#59665E]">
                AlumniConnect supports the full cycle of alumni engagement:
                verification, discovery, matching, administration, and
                reporting. Each part is built to feel lightweight for users and
                reliable for staff.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Verified identity",
                  text: "Authenticated login reduces duplicate records and keeps the directory trustworthy.",
                  icon: "shield-check",
                },
                {
                  title: "Fast discovery",
                  text: "Search by graduation year, domain, company, or location to find the right alumni quickly.",
                  icon: "search",
                },
                {
                  title: "Mentor-ready flow",
                  text: "Students can request mentorship, and alumni can opt in by domain, year, or field.",
                  icon: "handshake",
                },
                {
                  title: "Admin visibility",
                  text: "Staff can review data, export reports, and manage the directory from one dashboard.",
                  icon: "database",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[22px] border border-[#E2E7DD] bg-white p-5 shadow-[0_14px_30px_rgba(23,61,45,0.05)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9EEE5] text-[#24543F]">
                    <Icon name={item.icon} />
                  </div>
                  <h3 className="mt-4 text-[18px] font-semibold text-[#23392F]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#59665E]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-16 sm:px-10 lg:px-20">
          <div className="rounded-[34px] border border-[#E7ECE3] bg-[linear-gradient(135deg,#F9FAF7_0%,#FFFFFF_52%,#EEF4EC_100%)] px-6 py-10 shadow-[0_26px_70px_rgba(23,61,45,0.06)] lg:px-10 lg:py-12">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-5">
                <SectionLabel>Searchable alumni directory</SectionLabel>
                <h2 className="max-w-[620px] font-serif text-[42px] leading-[1.08] text-[#23392F]">
                  A search experience that feels premium, not administrative.
                </h2>
                <p className="max-w-[580px] text-[16px] leading-[1.7] text-[#59665E]">
                  Directory search should feel immediate. This layout emphasizes
                  whitespace, soft contrast, and a clear accent color so the
                  platform looks polished while still handling complex alumni
                  data.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Graduation year", "Domain", "Company", "Location"].map(
                    (chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-[#DCE5D7] bg-white px-4 py-2 text-[13px] text-[#3F4D44]"
                      >
                        {chip}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#E2E7DD] bg-white p-5 shadow-[0_18px_50px_rgba(23,61,45,0.06)]">
                <div className="rounded-[20px] bg-[#F7F9F4] p-4">
                  <div className="flex items-center gap-3 rounded-[16px] border border-[#E2E7DD] bg-white px-4 py-3 text-[14px] text-[#6B766D]">
                    <Icon name="search" />
                    <span>Search alumni by year, company, or location</span>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    ["Ananya Rao", "Product Design", "2017", "Bengaluru"],
                    [
                      "Rohan Mehta",
                      "Software Engineering",
                      "2015",
                      "Hyderabad",
                    ],
                    ["Sara Thomas", "Program Management", "2018", "Mumbai"],
                  ].map(([name, domain, year, city]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-[16px] border border-[#E7ECE3] px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-[#23392F]">{name}</p>
                        <p className="text-[12px] text-[#6B766D]">{domain}</p>
                      </div>
                      <div className="text-right text-[12px] text-[#59665E]">
                        <p>{year}</p>
                        <p>{city}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#E6EBE3] px-6 py-8 sm:px-10 lg:px-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] bg-[#24543F] text-white">
                  <Icon name="book-open" />
                </div>
                <p className="text-[22px] font-semibold text-[#23392F]">
                  AlumniConnect
                </p>
              </div>
              <p className="mt-3 max-w-[520px] text-[14px] leading-[1.7] text-[#59665E]">
                Verified alumni data, thoughtful mentorship flows, and a clean
                administrative experience for institutions that want long-term
                connection.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-[13px] text-[#59665E]">
              <a
                href="#features"
                className="cursor-pointer hover:text-[#23392F]"
              >
                Features
              </a>
              <a
                href="#use-cases"
                className="cursor-pointer hover:text-[#23392F]"
              >
                Use cases
              </a>
              <a href="#" className="cursor-pointer hover:text-[#23392F]">
                Privacy
              </a>
              <a href="#" className="cursor-pointer hover:text-[#23392F]">
                Terms
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};
