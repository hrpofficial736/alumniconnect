import bcrypt from "bcrypt";
import { Database } from "../../db/setup.js";

const getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query("SELECT * FROM admin WHERE id = $1", [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(`Error fetching admin with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createAdmin = async (req, res) => {
  const { id, name, email, password, college } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const db = new Database(process.env.DATABASE_URL);
    const alreadyExists = await db.query("SELECT * FROM admin");
    if (alreadyExists.length > 0) {
      return res.status(400).json({ error: "Admin already exists" });
    }
    const result = await db.query(
      "INSERT INTO admin (id, name, email, password, college) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, name, email, hashedPassword, college],
    );
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "college": "ABC College"
}
*/

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, college } = req.body;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "UPDATE admin SET name = $1, email = $2, password = $3, college = $4 WHERE id = $5 RETURNING *",
      [name, email, password, college, id],
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(`Error updating admin with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "DELETE FROM admin WHERE id = $1 RETURNING *",
      [id],
    );
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(`Error deleting admin with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const seedStudents = async (req, res) => {
  const { id } = req.params;
  const students = req.body;
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ error: "Request body must be a non-empty array of students" });
  }
  try {
    const db = new Database(process.env.DATABASE_URL);
    for (const s of students) {
      await db.query(
        `INSERT INTO student
          (id, name, bio, age, gender, semester, cgpa, college, roll_no, email, branch, batch_year, phone, skills, portfolio_link, linkedin_link, admin_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [s.id, s.name, s.bio, s.age, s.gender, s.semester, s.cgpa, s.college, s.roll_no, s.email, s.branch, s.batch_year, s.phone, s.skills, s.portfolio_link, s.linkedin_link, id]
      );
    }
    res.status(201).json({ message: `${students.length} student(s) seeded successfully` });
  } catch (error) {
    console.error(`Error seeding students for admin with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const seedAlumni = async (req, res) => {
  const { id } = req.params;
  const alumniList = req.body;
  if (!Array.isArray(alumniList) || alumniList.length === 0) {
    return res.status(400).json({ error: "Request body must be a non-empty array of alumni" });
  }
  try {
    const db = new Database(process.env.DATABASE_URL);
    for (const a of alumniList) {
      await db.query(
        `INSERT INTO alumni
          (id, name, bio, roll_no, age, gender, email, current_company, current_position, batch_year, cgpa, college, skills, portfolio_link, linkedin_link, branch, phone, admin_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
        [a.id, a.name, a.bio, a.roll_no, a.age, a.gender, a.email, a.current_company, a.current_position, a.batch_year, a.cgpa, a.college, a.skills, a.portfolio_link, a.linkedin_link, a.branch, a.phone, id]
      );
    }
    res.status(201).json({ message: `${alumniList.length} alumni seeded successfully` });
  } catch (error) {
    console.error(`Error seeding alumni for admin with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAdminById, createAdmin, updateAdmin, deleteAdmin, seedStudents, seedAlumni };
