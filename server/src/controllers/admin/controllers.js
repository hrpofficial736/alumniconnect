const getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query("SELECT * FROM admins WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching admin with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createAdmin = async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "INSERT INTO admins (name, email, role) VALUES ($1, $2, $3) RETURNING *",
      [name, email, role],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "UPDATE admins SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *",
      [name, email, role, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(result.rows[0]);
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
      "DELETE FROM admins WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(`Error deleting admin with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAdminById, createAdmin, updateAdmin, deleteAdmin };
