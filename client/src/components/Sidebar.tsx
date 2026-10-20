import { NavLink } from 'react-router'
import { useClerk } from '@clerk/react'
import {
  FaHome,
  FaUsers,
  FaUserGraduate,
  FaBriefcase,
  FaSearch,
  FaSignOutAlt,
} from 'react-icons/fa'

type UserRole = 'student' | 'alumni' | 'admin'

const getNavItems = (role: UserRole, id: string) => ({
  student: [
    { to: `/dashboard/students/${id}`, icon: <FaHome />, label: 'Overview' },
    { to: `/dashboard/students/${id}/alumni`, icon: <FaSearch />, label: 'Browse Alumni' },
    { to: `/dashboard/students/${id}/profile`, icon: <FaUserGraduate />, label: 'My Profile' },
  ],
  alumni: [
    { to: `/dashboard/alumni/${id}`, icon: <FaHome />, label: 'Overview' },
    { to: `/dashboard/alumni/${id}/students`, icon: <FaSearch />, label: 'Browse Students' },
    { to: `/dashboard/alumni/${id}/profile`, icon: <FaBriefcase />, label: 'My Profile' },
  ],
  admin: [
    { to: `/dashboard/admin/${id}`, icon: <FaHome />, label: 'Overview' },
    { to: `/dashboard/admin/${id}/students`, icon: <FaUserGraduate />, label: 'Students' },
    { to: `/dashboard/admin/${id}/alumni`, icon: <FaUsers />, label: 'Alumni' },
  ],
}[role])

const roleLabel: Record<UserRole, string> = {
  student: 'Student',
  alumni: 'Alumni',
  admin: 'Admin',
}

interface SidebarProps {
  role: UserRole
  id: string
  userName: string
}

export const Sidebar = ({ role, id, userName }: SidebarProps) => {
  const { signOut } = useClerk()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-[#e3eadf] bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#e3eadf]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#24543f] text-white text-sm font-bold shadow-sm">
          A
        </div>
        <div>
          <p className="text-sm font-semibold text-[#23392f]">AlumniConnect</p>
          <p className="text-xs text-[#66746a]">{roleLabel[role]} Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {getNavItems(role, id).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive
                ? 'bg-[#e8f0e8] text-[#24543f]'
                : 'text-[#66746a] hover:bg-[#f4f7f2] hover:text-[#23392f]'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + sign-out */}
      <div className="border-t border-[#e3eadf] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f0e8] text-sm font-semibold text-[#24543f]">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#23392f]">{userName}</p>
            <p className="text-xs text-[#66746a]">{roleLabel[role]}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            title="Sign out"
            className="cursor-pointer rounded-lg p-1.5 text-[#97a398] transition hover:bg-[#f4f7f2] hover:text-[#23392f]"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </aside>
  )
}
