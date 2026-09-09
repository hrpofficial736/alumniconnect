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
  const { name, email, password, college } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const db = new Database(process.env.DATABASE_URL);
    const alreadyExists = await db.query("SELECT * FROM admin");
    if (alreadyExists.length > 0) {
      return res.status(400).json({ error: "Admin already exists" });
    }
    const result = await db.query(
      "INSERT INTO admin (name, email, password, college) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, college],
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

export { getAdminById, createAdmin, updateAdmin, deleteAdmin };
