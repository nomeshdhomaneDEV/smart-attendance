// app/api/mark-attendance/route.js
// Called once the browser has already matched a face to a student_id
// (matching itself happens client-side with face-api.js, since it's fast
// and keeps face data from needing extra round trips).
// This route just records that the student was present today,
// and prevents marking the same student twice in one day.

import { sql } from "@vercel/postgres";

export async function POST(request) {
  try {
    const { studentId } = await request.json();

    if (!studentId) {
      return Response.json({ error: "Missing studentId" }, { status: 400 });
    }

    // Check if already marked today
    const existing = await sql`
      SELECT id FROM attendance
      WHERE student_id = ${studentId} AND attendance_date = CURRENT_DATE;
    `;

    if (existing.rows.length > 0) {
      return Response.json({ success: true, alreadyMarked: true });
    }

    await sql`
      INSERT INTO attendance (student_id, attendance_date)
      VALUES (${studentId}, CURRENT_DATE);
    `;

    return Response.json({ success: true, alreadyMarked: false });
  } catch (err) {
    console.error("Mark attendance error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
