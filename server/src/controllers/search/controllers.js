import { Database } from "../../db/setup.js";

const searchAlumni = async (req, res) => {
  const { query } = req.query;
  console.log(query);
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      `SELECT * FROM alumni
        WHERE name ILIKE $1
        OR bio ILIKE $1
        OR email ILIKE $1
        OR college ILIKE $1
        OR branch ILIKE $1
        OR current_company ILIKE $1
        OR current_position ILIKE $1
        OR portfolio_link ILIKE $1
        OR linkedin_link ILIKE $1
        OR roll_no::text ILIKE $1
        OR phone::text ILIKE $1
        OR age::text ILIKE $1
        OR cgpa::text ILIKE $1
        OR batch_year::text ILIKE $1
  OR EXISTS (SELECT 1 FROM unnest(skills) s WHERE s ILIKE $1)`,
      [`%${query}%`],
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching alumni:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchStudents = async (req, res) => {
  const { query } = req.query;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      `SELECT * FROM students
      WHERE name ILIKE $1
        OR bio ILIKE $1
        OR email ILIKE $1
        OR college ILIKE $1
        OR branch ILIKE $1
        OR portfolio_link ILIKE $1
        OR linkedin_link ILIKE $1
        OR roll_no::text ILIKE $1
        OR phone::text ILIKE $1
        OR age::text ILIKE $1
        OR cgpa::text ILIKE $1
        OR batch_year::text ILIKE $1
  OR EXISTS (SELECT 1 FROM unnest(skills) s WHERE s ILIKE $1)`,
      [`%${query}%`],
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { searchAlumni, searchStudents };
