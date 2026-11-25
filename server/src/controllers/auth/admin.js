import { Database } from "../../db/setup.js";

export async function loginAdmin(req, res) {
  const db = new Database(process.env.DATABASE_URL);
  try {
    const [admin] = await db.query(
      "SELECT id, name, email, college FROM admin WHERE id = $1",
      [req.body.id],
    );
    if (!admin)
      return res
        .status(404)
        .json({ error: "Admin not registered. Please sign up first." });
    res.json(admin);
  } catch (error) {
    console.error("Admin login failed:", error);
    res.status(500).json({ error: "Unable to log in admin" });
  } finally {
    await db.close();
  }
}

export async function registerAdmin(req, res) {
  const db = new Database(process.env.DATABASE_URL);
  try {
    const [existing] = await db.query(
      "SELECT id, name, email, college FROM admin WHERE id = $1",
      [req.body.id],
    );
    if (existing) return res.json(existing);

    const adminEmails = (process.env.CLERK_ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase());
    const user = req.clerkUser;
    if (
      user.publicMetadata.role !== "admin" &&
      user.privateMetadata.role !== "admin" &&
      !adminEmails.includes(req.body.email.toLowerCase())
    ) {
      return res
        .status(403)
        .json({ error: "Admin registration requires administrator approval" });
    }

    // Clerk owns passwords, including Google accounts which have no local password.
    const { id, name, email, college } = req.body;
    const [admin] = await db.query(
      "INSERT INTO admin (id, name, email, college) VALUES ($1, $2, $3, $4) RETURNING id, name, email, college",
      [id, name, email, college],
    );
    res.status(201).json(admin);
  } catch (error) {
    console.error("Admin registration failed:", error);
    res.status(500).json({ error: "Unable to register admin" });
  } finally {
    await db.close();
  }
}
