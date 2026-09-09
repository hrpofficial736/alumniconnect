import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

import {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni,
} from "../controllers/alumniController.js";

import {
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";


const router = Router();

// student routes
router.get("/students/get-all", authMiddleware, getAllStudents);
router.get("/students/get/:id", authMiddleware, getStudentById);
router.post("/students/create", authMiddleware, createStudent);
router.put("/students/update/:id", authMiddleware, updateStudent);
router.delete("/students/delete/:id", authMiddleware, deleteStudent);

// alumni routes
router.get("/alumni/get-all", authMiddleware, getAllAlumni);
router.get("/alumni/get/:id", authMiddleware, getAlumniById);
router.post("/alumni/create", authMiddleware, createAlumni);
router.put("/alumni/update/:id", authMiddleware, updateAlumni);
router.delete("/alumni/delete/:id", authMiddleware, deleteAlumni);

// admin routes

router.get("/admin/get/:id", authMiddleware, getAdminById);
router.post("/admin/create", authMiddleware, createAdmin);
router.put("/admin/update/:id", authMiddleware, updateAdmin);
router.delete("/admin/delete/:id", authMiddleware, deleteAdmin);
