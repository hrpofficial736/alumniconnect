import { Database } from "../../db/setup.js";

const getAllStudents = async (req, res) => {
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query("SELECT * FROM students");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query("SELECT * FROM students WHERE id = $1", [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.error(`Error fetching student with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createStudent = async (req, res) => {
  const {
    name,
    bio,
    age,
    gender,
    semester,
    cgpa,
    college,
    roll_no,
    email,
    branch,
    batch_year,
    phone,
    skills,
    portfolio_link,
    linkedin_link,
  } = req.body;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "INSERT INTO students (name, bio, age, gender, semester, cgpa, college, roll_no, email, branch, batch_year, phone, skills, portfolio_link, linkedin_link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
      [name, bio, age, gender, semester, cgpa, college, roll_no, email, branch, batch_year, phone, skills, portfolio_link, linkedin_link],
    );
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    bio,
    age,
    gender,
    semester,
    cgpa,
    college,
    roll_no,
    email,
    branch,
    batch_year,
    phone,
    skills,
    portfolio_link,
    linkedin_link,
  } = req.body;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "UPDATE students SET name = $1, bio = $2, age = $3, gender = $4, semester = $5, cgpa = $6, college = $7, roll_no = $8, email = $9, branch = $10, batch_year = $11, phone = $12, skills = $13, portfolio_link = $14, linkedin_link = $15 WHERE id = $16 RETURNING *",
      [name, bio, age, gender, semester, cgpa, college, roll_no, email, branch, batch_year, phone, skills, portfolio_link, linkedin_link, id],
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.error(`Error updating student with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(`Error deleting student with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
