import { Router } from "express";
import {
  getAllStudents,
  getStudentById,
  updateStudent,
  getStudentProfile,
  updateStudentProfile,
  deleteStudent,
} from "../controllers/students/controllers.js";

import {
  getAllAlumni,
  getAlumniById,
  updateAlumni,
  getAlumniProfile,
  updateAlumniProfile,
  deleteAlumni,
} from "../controllers/alumni/controllers.js";

import {
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateStudents,
  seedAlumni,
  seedStudents,
} from "../controllers/admin/controllers.js";
import {
  getAllMentors,
  removeMentor,
  getRequests,
  getStudentRequests,
  getConnectedStudents,
  sendRequest,
  acceptRequest,
  rejectRequest,
  sendMentorshipMail,
} from "../controllers/mentorship/controllers.js";

import authMiddleware from "../middleware/middleware.js";
import { loginStudent } from "../controllers/auth/students.js";
import { loginAlumni } from "../controllers/auth/alumni.js";
import { loginAdmin, registerAdmin } from "../controllers/auth/admin.js";

const router = Router();

router.post("/auth/students/login", authMiddleware, loginStudent);
router.post("/auth/alumni/login", authMiddleware, loginAlumni);
router.post("/auth/admin/login", authMiddleware, loginAdmin);
router.post("/auth/admin/register", authMiddleware, registerAdmin);

// student routes
router.post("/students/seed", seedStudents);
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);
router.patch("/students/:id", updateStudent);
router.get("/students/:id/profile", getStudentProfile);
router.patch("/students/:id/profile", updateStudentProfile);
router.delete("/students/:id", deleteStudent);

// alumni routes
router.post("/alumni/seed", seedAlumni);
router.get("/alumni", getAllAlumni);
router.get("/alumni/:id", getAlumniById);
router.patch("/alumni/:id", updateAlumni);
router.get("/alumni/:id/profile", getAlumniProfile);
router.patch("/alumni/:id/profile", updateAlumniProfile);
router.delete("/alumni/:id", deleteAlumni);

// mentorship routes
router.post("/mentorship/requests", sendRequest);
router.get("/mentorship/requests/:id", getRequests);
router.get("/mentorship/student-requests/:id", getStudentRequests);
router.get("/mentorship/students/:id", getConnectedStudents);
router.patch("/mentorship/requests/:id/accept", acceptRequest);
router.patch("/mentorship/requests/:id/reject", rejectRequest);
router.get("/mentorship/mentors/:id", getAllMentors);
router.post("/mentorship/mail/:id", sendMentorshipMail);
router.delete("/mentorship/mentors", removeMentor);

// admin routes

router.get("/admin/:id", getAdminById);
router.post("/admin", createAdmin);
router.patch("/admin/:id", updateAdmin);
router.delete("/admin/:id", deleteAdmin);
router.post("/admin/:id/seed/students", seedStudents);
router.post("/admin/:id/seed/alumni", seedAlumni);
router.post("/admin/:id/update/students", updateStudents);

export default router;
