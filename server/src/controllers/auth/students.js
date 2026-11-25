import { Database } from "../../db/setup.js";
import bcrypt from "bcrypt";

export async function loginStudent(req, res) {
  const { email, password } = req.body;
  console.log(email, password)
  const db = new Database(process.env.DATABASE_URL);
  try {
    const result = await db.query("SELECT * FROM students WHERE email = $1", [
      email,
    ]);
    if (!result || result.length === 0)
      return res
        .status(404)
        .json({ error: "Student not registered. Please sign up first." });
    const student = result[0];
    if (!(await bcrypt.compare(password, student.password)))
      return res.status(401).json({ error: "Invalid credentials" });
    res.json(student);
  } catch (error) {
    console.error("Student login failed:", error);
    res.status(500).json({ error: "Unable to log in student" });
  } finally {
    await db.close();
  }
}
