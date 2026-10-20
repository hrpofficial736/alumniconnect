import { useEffect } from 'react'
import { useUser } from '@clerk/react'
import { useNavigate } from 'react-router'

type UserRole = 'student' | 'alumni' | 'admin'

const roleBase: Record<UserRole, string> = {
  student: 'students',
  alumni: 'alumni',
  admin: 'admin',
}

export const DashboardRedirect = () => {
  const { user, isLoaded } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoaded || !user) return
    const role = (user.unsafeMetadata?.role as UserRole) ?? 'student'
    navigate(`/dashboard/${roleBase[role]}/${user.id}`, { replace: true })
  }, [isLoaded, user, navigate])

  return (
    <div className="flex h-screen items-center justify-center bg-[#fbfaf6]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#24543f] border-t-transparent" />
    </div>
  )
}
