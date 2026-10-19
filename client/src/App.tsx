
import { Route, Routes } from 'react-router'
import { AuthPage } from './pages/AuthPage'
import { LandingPage } from './pages/LandingPage'
import { SSOCallback } from './pages/SSOCallback'
import { DashboardPage } from './pages/DashboardPage'
import { StudentsList } from './pages/admin/StudentsList'
import { AlumniList } from './pages/admin/AlumniList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/sso-callback" element={<SSOCallback />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/students" element={<StudentsList />} />
      <Route path="/dashboard/alumni" element={<AlumniList />} />
    </Routes>
  )
}

export default App
