import { Database } from "../../db/setup.js";
import bcrypt from "bcrypt";

export async function loginAlumni(req, res) {
  const { email, password } = req.body;
  
  const db = new Database(process.env.DATABASE_URL);
  try {
    const [alumni] = await db.query("SELECT * FROM alumni WHERE email = $1", [
      email,
    ]);
    if (!alumni)
      return res
        .status(404)
        .json({ error: "Alumni not registered. Please sign up first." });
    if (!(await bcrypt.compare(password, alumni.password)))
      return res.status(401).json({ error: "Invalid credentials" });
    res.json(alumni);
  } catch (error) {
    console.error("Alumni login failed:", error);
    res.status(500).json({ error: "Unable to log in alumni" });
  } finally {
    await db.close();
  }
}