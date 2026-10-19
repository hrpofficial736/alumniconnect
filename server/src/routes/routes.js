import { Router } from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  seedStudents
} from "../controllers/students/controllers.js";

import {
  seedAlumni,
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni,
} from "../controllers/alumni/controllers.js";

import {
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/admin/controllers.js";
import { searchAlumni, searchStudents } from "../controllers/search/controllers.js";

const router = Router();

// search routes
router.get("/search/alumni", searchAlumni);
router.get("/search/students", searchStudents);

// student routes
router.post("/students/seed", seedStudents);
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);
router.post("/students", createStudent);
router.patch("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

// alumni routes
router.post("/alumni/seed", seedAlumni);
router.get("/alumni", getAllAlumni);
router.get("/alumni/:id", getAlumniById);
router.post("/alumni", createAlumni);
router.patch("/alumni/:id", updateAlumni);
router.delete("/alumni/:id", deleteAlumni);

// admin routes

router.get("/admin/:id", getAdminById);
router.post("/admin", createAdmin);
router.patch("/admin/:id", updateAdmin);
router.delete("/admin/:id", deleteAdmin);

export default router;
