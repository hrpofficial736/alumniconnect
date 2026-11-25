import { Database } from "../../db/setup.js";
import { Resend } from "resend";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const requestTags = new Set(["placements", "higher_studies", "general"]);

const sendRequest = async (req, res) => {
  const { studentId, alumId, tags, description = "" } = req.body;
  if (
    !studentId ||
    !alumId ||
    !Array.isArray(tags) ||
    !tags.length ||
    tags.some((tag) => !requestTags.has(tag)) ||
    typeof description !== "string"
  ) {
    return res.status(400).json({
      message: "Choose at least one valid tag and provide request details",
    });
  }

  const db = new Database(process.env.DATABASE_URL);
  try {
    const rows = await db.query(
      "INSERT INTO mentorship_requests (student_id, alum_id, tags, description, status) VALUES ($1, $2, $3, $4, 'pending') RETURNING id",
      [studentId, alumId, tags, description.trim()],
    );
    res.status(201).json({ request_id: rows[0].id, message: "Request sent" });
  } catch (error) {
    console.error("Error sending mentorship request:", error);
    res.status(500).json({ message: "Error sending request" });
  } finally {
    await db.close();
  }
};

const getRequests = async (req, res) => {
  const db = new Database(process.env.DATABASE_URL);
  try {
    const result = await db.query(
      `SELECT students.*, mentorship_requests.id AS request_id, mentorship_requests.tags::VARCHAR[],
      mentorship_requests.description, mentorship_requests.status
       FROM mentorship_requests
       JOIN students ON students.id = mentorship_requests.student_id
       WHERE mentorship_requests.alum_id = $1 ORDER BY mentorship_requests.id DESC`,
      [req.params.id],
    );
    console.log("result is", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching mentorship requests:", error);
    res.status(500).json({ message: "Error fetching requests" });
  } finally {
    await db.close();
  }
};

const getStudentRequests = async (req, res) => {
  const db = new Database(process.env.DATABASE_URL);
  try {
    const result = await db.query(
      `SELECT alumni.*, mentorship_requests.id AS request_id, mentorship_requests.tags::VARCHAR[], mentorship_requests.description, mentorship_requests.status
       FROM mentorship_requests
       JOIN alumni ON alumni.id = mentorship_requests.alum_id
       WHERE mentorship_requests.student_id = $1 ORDER BY mentorship_requests.id DESC`,
      [req.params.id],
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching student mentorship requests:", error);
    res.status(500).json({ message: "Error fetching requests" });
  } finally {
    await db.close();
  }
};

const acceptRequest = async (req, res) => {
  const db = new Database(process.env.DATABASE_URL);
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT student_id, alum_id, tags FROM mentorship_requests WHERE id = $1 FOR UPDATE",
      [req.params.id],
    );
    if (!rows[0]) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Request not found" });
    }
    await client.query(
      "INSERT INTO mentorship (student_id, alum_id, tags) VALUES ($1, $2, $3)",
      [rows[0].student_id, rows[0].alum_id, rows[0].tags ?? []],
    );
    await client.query("DELETE FROM mentorship_requests WHERE id = $1", [
      req.params.id,
    ]);
    await client.query("COMMIT");
    res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error accepting mentorship request:", error);
    res.status(500).json({ message: "Error accepting request" });
  } finally {
    client.release();
    await db.close();
  }
};

const rejectRequest = async (req, res) => {
  const db = new Database(process.env.DATABASE_URL);
  try {
    const result = await db.query(
      "DELETE FROM mentorship_requests WHERE id = $1 RETURNING id",
      [req.params.id],
    );
    if (!result.length)
      return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    console.error("Error rejecting mentorship request:", error);
    res.status(500).json({ message: "Error rejecting request" });
  } finally {
    await db.close();
  }
};

const getAllMentors = async (req, res) => {
  const db = new Database(process.env.DATABASE_URL);
  try {
    const result = await db.query(
      "SELECT alumni.* FROM mentorship JOIN alumni ON alumni.id = mentorship.alum_id WHERE mentorship.student_id = $1",
      [req.params.id],
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({ message: "Error fetching mentors" });
  } finally {
    await db.close();
  }
};

const getConnectedStudents = async (req, res) => {
  const db = new Database(process.env.DATABASE_URL);
  try {
    const result = await db.query(
      "SELECT students.* FROM mentorship JOIN students ON students.id = mentorship.student_id WHERE mentorship.alum_id = $1",
      [req.params.id],
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching connected students:", error);
    res.status(500).json({ message: "Error fetching connected students" });
  } finally {
    await db.close();
  }
};

const mailTags = new Set(["placements", "higher_studies", "general"]);

const sendMentorshipMail = async (req, res) => {
  const alumniId = req.params.id;
  const { tags, subject, body } = req.body ?? {};

  if (
    !Array.isArray(tags) ||
    tags.length === 0 ||
    tags.some((tag) => typeof tag !== "string" || !mailTags.has(tag)) ||
    typeof subject !== "string" ||
    !subject.trim() ||
    subject.length > 180 ||
    typeof body !== "string" ||
    !body.trim() ||
    body.length > 30000
  ) {
    return res.status(400).json({
      message:
        "Choose valid tags and provide a subject and message (up to 30,000 characters).",
    });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return res.status(503).json({
      message: "Email sending is not configured on the server.",
    });
  }

  const db = new Database(process.env.DATABASE_URL);
  try {
    const alumniRows = await db.query(
      "SELECT name, email FROM alumni WHERE id = $1",
      [alumniId],
    );
    if (!alumniRows.length) {
      return res.status(404).json({ message: "Alumni account not found." });
    }

    const students = await db.query(
      `SELECT DISTINCT students.id, students.name, students.email
       FROM mentorship
       JOIN students ON students.id = mentorship.student_id
       WHERE mentorship.alum_id = $1
         AND NULLIF(BTRIM(students.email), '') IS NOT NULL
         AND COALESCE(to_jsonb(mentorship.tags), '[]'::jsonb) ?| $2::text[]`,
      [alumniId, [...new Set(tags)]],
    );

    if (!students.length) {
      return res.status(404).json({
        message: "No connected students match the selected tags.",
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const rendered = await marked.parse(body, { gfm: true, breaks: true });
    const safeHtml = sanitizeHtml(rendered);
    let sentCount = 0;
    let failedCount = 0;

    for (const student of students) {
      try {
        const { error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: process.env.RECEIVER_EMAIL,
          replyTo: alumniRows[0].email || undefined,
          subject: subject.trim().replace(/[\r\n]+/g, " "),
          html: `<main style="font-family:Arial,sans-serif;line-height:1.6;color:#23392f"><p>Hello ${sanitizeHtml(student.name || "there")},</p>${safeHtml}<p>— ${sanitizeHtml(alumniRows[0].name || "Your mentor")}</p></main>`,
          text: `Hello ${student.name || "there"},\n\n${body}\n\n— ${alumniRows[0].name || "Your mentor"}`,
        });
        if (error) {
          console.error("Resend failed to deliver mentorship email:", error);
          failedCount += 1;
        } else {
          sentCount += 1;
        }
      } catch (error) {
        console.error("Failed to send mentorship email:", error);
        failedCount += 1;
      }
    }

    if (sentCount === 0) {
      return res.status(502).json({
        message: `Email delivery failed for all ${failedCount} matching students.`,
      });
    }

    res.status(200).json({
      message: "Mentorship email delivery completed.",
      sentCount,
      failedCount,
    });
  } catch (error) {
    console.error("Error sending mentorship email:", error);
    res.status(500).json({ message: "Unable to send mentorship email." });
  } finally {
    await db.close();
  }
};

const removeMentor = async (req, res) => {
  const db = new Database(process.env.DATABASE_URL);
  try {
    await db.query(
      "DELETE FROM mentorship WHERE student_id = $1 AND alum_id = $2",
      [req.body.studentId, req.body.alumId],
    );
    res.status(200).json({ message: "Mentor removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing mentor" });
  } finally {
    await db.close();
  }
};

export {
  sendRequest,
  getRequests,
  getStudentRequests,
  acceptRequest,
  rejectRequest,
  getAllMentors,
  getConnectedStudents,
  sendMentorshipMail,
  removeMentor,
};
