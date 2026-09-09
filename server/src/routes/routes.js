import { Router } from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/students/controllers.js";

import {
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
router.get("/students/get-all", getAllStudents);
router.get("/students/get/:id", getStudentById);
router.post("/students/create", createStudent);
router.put("/students/update/:id", updateStudent);
router.delete("/students/delete/:id", deleteStudent);

// alumni routes
router.get("/alumni/get-all", getAllAlumni);
router.get("/alumni/get/:id", getAlumniById);
router.post("/alumni/create", createAlumni);
router.put("/alumni/update/:id", updateAlumni);
router.delete("/alumni/delete/:id", deleteAlumni);

// admin routes

router.get("/admin/get/:id", getAdminById);
router.post("/admin/create", createAdmin);
router.put("/admin/update/:id", updateAdmin);
router.delete("/admin/delete/:id", deleteAdmin);

export default router;
