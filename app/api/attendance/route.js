// app/api/attendance/route.js
// Returns attendance records joined with student names, for the dashboard.
// Optional ?date=YYYY-MM-DD query param filters to one day.

export const dynamic = "force-dynamic";

import { sql } from "../../../lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const result = date
      ? await sql`
          SELECT a.id, a.marked_at, a.attendance_date, s.name, s.roll_number
          FROM attendance a
          JOIN students s ON s.student_id = a.student_id
          WHERE a.attendance_date = ${date}
          ORDER BY a.marked_at DESC;
        `
      : await sql`
          SELECT a.id, a.marked_at, a.attendance_date, s.name, s.roll_number
          FROM attendance a
          JOIN students s ON s.student_id = a.student_id
          ORDER BY a.marked_at DESC
          LIMIT 200;
        `;

    return Response.json({ records: result.rows });
  } catch (err) {
    console.error("Attendance list error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
