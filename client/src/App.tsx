
import { Route, Routes } from 'react-router'
import { AuthPage } from './pages/AuthPage'
import { LandingPage } from './pages/LandingPage'
import { SSOCallback } from './pages/SSOCallback'
import { DashboardPage } from './pages/DashboardPage'
import { DashboardRedirect } from './pages/DashboardRedirect'
import { StudentsList } from './pages/admin/StudentsList'
import { AlumniList } from './pages/admin/AlumniList'
import { AlumniListPageForStudents } from './pages/student/AlumniListPageForStudents'


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/sso-callback" element={<SSOCallback />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route path="/dashboard/students/:studentId" element={<DashboardPage />} />
      <Route path="/dashboard/students/:studentId/alumni" element={<AlumniListPageForStudents />} />
      <Route path="/dashboard/alumni/:alumniId" element={<DashboardPage />} />
      <Route path="/dashboard/admin/:adminId" element={<DashboardPage />} />
      <Route path="/dashboard/admin/:adminId/students" element={<StudentsList />} />
      <Route path="/dashboard/admin/:adminId/alumni" element={<AlumniList />} />
    </Routes>
  )
}

export default App
