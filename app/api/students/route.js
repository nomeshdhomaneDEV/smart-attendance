// app/api/students/route.js
// Returns all registered students (used by the attendance page to match
// against, and by the dashboard to show who's enrolled).

import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    const result = await sql`
      SELECT student_id, name, roll_number, descriptor, registered_at
      FROM students
      ORDER BY registered_at DESC;
    `;
    return Response.json({ students: result.rows });
  } catch (err) {
    console.error("Students list error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
