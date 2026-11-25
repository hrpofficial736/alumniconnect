import { Route, Routes } from "react-router";
import { AuthPage } from "./pages/AuthPage";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { StudentsList } from "./pages/admin/StudentsList";
import { AlumniList } from "./pages/admin/AlumniList";
import { AlumniListPageForStudents } from "./pages/student/AlumniListPageForStudents";
import { StudentsListPage } from "./pages/alumni/StudentsListPage";
import Mentors from "./pages/student/Mentors";
import MentorshipRequests from "./pages/alumni/MentorshipRequests";
import Requests from "./pages/student/Requests";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import AlumniProfilePage from "./pages/alumni/AlumniProfilePage";
import MailPage from "./pages/alumni/MailPage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* student routes */}
      <Route path="/dashboard/student/:studentId" element={<DashboardPage />} />
      <Route
        path="/dashboard/student/:studentId/alumni"
        element={<AlumniListPageForStudents />}
      />
      <Route
        path="/dashboard/student/:studentId/mentors"
        element={<Mentors />}
      />
      <Route
        path="/dashboard/student/:studentId/requests"
        element={<Requests />}
      />
      <Route
        path="/dashboard/student/:studentId/profile"
        element={<StudentProfilePage />}
      />

      {/*alumni routes*/}
      <Route
        path="/dashboard/alumni/:alumniId/mentorship-requests"
        element={<MentorshipRequests />}
      />
      <Route path="/dashboard/alumni/:alumniId" element={<DashboardPage />} />
      <Route
        path="/dashboard/alumni/:alumniId/students"
        element={<StudentsListPage />}
      />
      <Route
        path="/dashboard/alumni/:alumniId/profile"
        element={<AlumniProfilePage />}
      />
      <Route path="/dashboard/alumni/:alumniId/mail" element={<MailPage />} />

      {/*admin routes*/}
      <Route path="/dashboard/admin/:adminId" element={<DashboardPage />} />
      <Route
        path="/dashboard/admin/:adminId/students"
        element={<StudentsList />}
      />
      <Route path="/dashboard/admin/:adminId/alumni" element={<AlumniList />} />
    </Routes>
  );
}

export default App;
