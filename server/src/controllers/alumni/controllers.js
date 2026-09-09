
const getAllAlumni = async (req, res) => {
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query("SELECT * FROM alumni");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching alumni:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getAlumniById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query("SELECT * FROM alumni WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Alumni not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching alumni with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const createAlumni = async (req, res) => {
  const { name, email, graduationYear } = req.body;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "INSERT INTO alumni (name, email, graduation_year) VALUES ($1, $2, $3) RETURNING *",
      [name, email, graduationYear]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating alumni:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const updateAlumni = async (req, res) => {
  const { id } = req.params;
  const { name, email, graduationYear } = req.body;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "UPDATE alumni SET name = $1, email = $2, graduation_year = $3 WHERE id = $4 RETURNING *",
      [name, email, graduationYear, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Alumni not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating alumni with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const deleteAlumni = async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query("DELETE FROM alumni WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Alumni not found" });
    }
    res.json({ message: "Alumni deleted successfully" });
  } catch (error) {
    console.error(`Error deleting alumni with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export { getAllAlumni, getAlumniById, createAlumni, updateAlumni, deleteAlumni };