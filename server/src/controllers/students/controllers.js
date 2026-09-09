
const getAllStudents = async (req, res) => {
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query("SELECT * FROM students WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching student with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const createStudent = async (req, res) => {
  const { name, email, course } = req.body;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "INSERT INTO students (name, email, course) VALUES ($1, $2, $3) RETURNING *",
      [name, email, course]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, course } = req.body;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query(
      "UPDATE students SET name = $1, email = $2, course = $3 WHERE id = $4 RETURNING *",
      [name, email, course, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating student with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database(process.env.DATABASE_URL);
    const result = await db.query("DELETE FROM students WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(`Error deleting student with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };