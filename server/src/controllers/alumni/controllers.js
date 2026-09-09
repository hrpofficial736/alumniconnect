import {Database} from "../../db/setup.js"

const getAllAlumni = async (req, res) => {
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query("SELECT * FROM alumni");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching alumni:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAlumniById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query("SELECT * FROM alumni WHERE id = $1", [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: "Alumni not found" });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.error(`Error fetching alumni with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createAlumni = async (req, res) => {
  const {
    name,
    bio,
    roll_no,
    age,
    gender,
    email,
    current_company,
    current_position,
    batch_year,
    cgpa,
    college,
    skills,
    portfolio_link,
    linkedin_link,
    branch,
    phone,
  } = req.body;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "INSERT INTO alumni (name, bio, roll_no, age, gender, email, current_company, current_position, batch_year, cgpa, college, skills, portfolio_link, linkedin_link, branch, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
      [
        name,
        bio,
        roll_no,
        age,
        gender,
        email,
        current_company,
        current_position,
        batch_year,
        cgpa,
        college,
        skills,
        portfolio_link,
        linkedin_link,
        branch,
        phone,
      ],
    );
    res.status(201).json({
      message: "Alumni created successfully",
      alumni: result[0],
    });
  } catch (error) {
    console.error("Error creating alumni:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const updateAlumni = async (req, res) => {
  const { id } = req.params;
  const { 
    name,
    bio,
    roll_no,
    age,
    gender,
    email,
    current_company,
    current_position,
    batch_year,
    cgpa,
    college,
    skills,
    portfolio_link,
    linkedin_link,
    branch,
    phone,
   } = req.body;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "UPDATE alumni SET name = $1, bio = $2, roll_no = $3, age = $4, gender = $5, email = $6, current_company = $7, current_position = $8, batch_year = $9, cgpa = $10, college = $11, skills = $12, portfolio_link = $13, linkedin_link = $14, branch = $15, phone = $16 WHERE id = $17 RETURNING *",
      [name, bio, roll_no, age, gender, email, current_company, current_position, batch_year, cgpa, college, skills, portfolio_link, linkedin_link, branch, phone, id],
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "Alumni not found" });
    }
    res.status(200).json({
      message: "Alumni updated successfully",
      alumni: result[0],
    });
  } catch (error) {
    console.error(`Error updating alumni with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAlumni = async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "DELETE FROM alumni WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "Alumni not found" });
    }
    res.status(200).json({ message: "Alumni deleted successfully" });
  } catch (error) {
    console.error(`Error deleting alumni with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni,
};
