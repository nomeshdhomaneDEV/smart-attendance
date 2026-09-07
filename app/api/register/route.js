// app/api/register/route.js
// Receives a student's name, roll number, and a "face descriptor"
// (a list of 128 numbers that uniquely represents their face, computed
// in the browser by face-api.js) and saves it to the database.

import { sql } from "../../../lib/db";

export async function POST(request) {
  try {
    const { name, rollNumber, descriptor } = await request.json();

    if (!name || !rollNumber || !descriptor) {
      return Response.json({ error: "Missing name, rollNumber, or face data" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO students (name, roll_number, descriptor)
      VALUES (${name}, ${rollNumber}, ${JSON.stringify(descriptor)})
      RETURNING student_id, name;
    `;

    return Response.json({ success: true, student: result.rows[0] });
  } catch (err) {
    console.error("Register error:", err);
    return Response.json({ error: err.message || "Registration failed" }, { status: 500 });
  }
}
