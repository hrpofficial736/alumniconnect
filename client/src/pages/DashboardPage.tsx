import { Sidebar } from "../components/Sidebar";
import { useGetAllStudents } from "../hooks/use-students";
import { useGetAllAlumni } from "../hooks/use-alumni";
import {
  FaUserGraduate,
  FaUsers,
  FaBriefcase,
  FaChartBar,
  FaArrowRight,
} from "react-icons/fa";

type UserRole = "student" | "alumni" | "admin";

/* ── Helpers ── */

const Spinner = () => (
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#24543f] border-t-transparent" />
);

const StatCard = ({
  label,
  value,
  icon,
  sub,
  loading,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
  loading?: boolean;
}) => (
  <div className="rounded-2xl border border-[#e3eadf] bg-white p-5 shadow-[0_4px_16px_rgba(23,61,45,0.05)]">
    <div className="flex items-center justify-between">
      <p className="text-sm text-[#66746a]">{label}</p>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f0e8] text-[#24543f]">
        {icon}
      </span>
    </div>
    {loading ? (
      <div className="mt-3 h-9 w-16 animate-pulse rounded-lg bg-[#e8f0e8]" />
    ) : (
      <p className="mt-3 text-3xl font-semibold text-[#23392f]">{value}</p>
    )}
    {sub && <p className="mt-1 text-xs text-[#97a398]">{sub}</p>}
  </div>
);

const QuickLinks = ({
  links,
}: {
  links: { label: string; description: string; to: string }[];
}) => (
  <>
    <h2 className="mt-10 mb-4 text-base font-semibold text-[#23392f]">
      Quick actions
    </h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <a
          key={link.to}
          href={link.to}
          className="group flex flex-col justify-between rounded-2xl border border-[#e3eadf] bg-white p-5 shadow-[0_4px_16px_rgba(23,61,45,0.05)] transition hover:border-[#24543f] hover:shadow-[0_8px_24px_rgba(36,84,63,0.1)]"
        >
          <div>
            <p className="font-semibold text-[#23392f]">{link.label}</p>
            <p className="mt-1 text-sm leading-6 text-[#66746a]">
              {link.description}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#24543f] opacity-0 transition group-hover:opacity-100">
            Go <FaArrowRight className="text-xs" />
          </div>
        </a>
      ))}
    </div>
  </>
);

/* ── Role content components (each calls only its own hooks) ── */

const StudentContent = ({ id }: { id: string }) => {
  const { data: alumni, isLoading } = useGetAllAlumni();
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Alumni Network"
          value={alumni?.length ?? 0}
          icon={<FaUsers />}
          sub="Verified alumni"
          loading={isLoading}
        />
        <StatCard
          label="Your CGPA"
          value="—"
          icon={<FaChartBar />}
          sub="Update your profile"
        />
        <StatCard
          label="Connections"
          value={0}
          icon={<FaUserGraduate />}
          sub="Start connecting"
        />
      </div>
      <QuickLinks
        links={[
          {
            label: "Browse Alumni",
            description: "Discover alumni by company, role, or batch.",
            to: `/dashboard/student/${id}/alumni`,
          },
          {
            label: "Update Profile",
            description: "Keep your academic profile current.",
            to: `/dashboard/student/${id}/profile`,
          },
        ]}
      />
    </>
  );
};

const AlumniContent = ({ id }: { id: string }) => {
  const { data: students, isLoading } = useGetAllStudents();
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Student Network"
          value={students?.length ?? 0}
          icon={<FaUserGraduate />}
          sub="Enrolled students"
          loading={isLoading}
        />
        <StatCard
          label="Your Company"
          value="—"
          icon={<FaBriefcase />}
          sub="Update your profile"
        />
        <StatCard
          label="Connections"
          value={0}
          icon={<FaUsers />}
          sub="Start connecting"
        />
      </div>
      <QuickLinks
        links={[
          {
            label: "Browse Students",
            description: "Find students by branch, batch, or skills.",
            to: `/dashboard/alumni/${id}/students`,
          },
          {
            label: "Update Profile",
            description: "Showcase your current role and experience.",
            to: `/dashboard/alumni/${id}/profile`,
          },
        ]}
      />
    </>
  );
};

const AdminContent = () => {
  const { data: students, isLoading: sl } = useGetAllStudents();
  const { data: alumni, isLoading: al } = useGetAllAlumni();
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Students"
          value={students?.length ?? 0}
          icon={<FaUserGraduate />}
          sub="Across all branches"
          loading={sl}
        />
        <StatCard
          label="Total Alumni"
          value={alumni?.length ?? 0}
          icon={<FaUsers />}
          sub="Verified profiles"
          loading={al}
        />
      </div>
      <QuickLinks
        links={[
          {
            label: "Manage Students",
            description: "View, add, edit or remove student records.",
            to: "/dashboard/students",
          },
          {
            label: "Manage Alumni",
            description: "Oversee alumni profiles and verifications.",
            to: "/dashboard/alumni",
          },
        ]}
      />
    </>
  );
};

const headings: Record<UserRole, { greeting: string; description: string }> = {
  student: {
    greeting: "Your student dashboard",
    description:
      "Explore alumni, track your profile, and find mentorship opportunities.",
  },
  alumni: {
    greeting: "Your alumni dashboard",
    description:
      "Stay connected with students, share experience, and grow the network.",
  },
  admin: {
    greeting: "Admin dashboard",
    description:
      "Manage students, alumni, and institutional data in one place.",
  },
};

/* ── Page ── */

export const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fbfaf6]">
        <Spinner />
      </div>
    );
  }

  const { id, role, email: userEmail } = user;
  console.log(id, role, userEmail);
  const { greeting, description } = headings[role];

  return (
    <div className="flex h-screen bg-[#fbfaf6]">
      <Sidebar role={role} id={id} userEmail={userEmail} />

      <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#24543f]">
            Welcome back, {userEmail}
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-[#23392f]">
            {greeting}
          </h1>
          <p className="mt-1 text-sm text-[#66746a]">{description}</p>
        </div>

        {role === "student" && <StudentContent id={id} />}
        {role === "alumni" && <AlumniContent id={id} />}
        {role === "admin" && <AdminContent />}
      </main>
    </div>
  );
};
