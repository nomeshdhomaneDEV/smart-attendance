// app/api/init-db/route.js
// Visit this URL ONCE after deploying (e.g. yoursite.vercel.app/api/init-db)
// to create the database tables. Safe to visit again — it won't duplicate data.

import { sql } from "../../../lib/db";

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS students (
        student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        roll_number TEXT NOT NULL,
        descriptor JSONB NOT NULL,
        registered_at TIMESTAMPTZ DEFAULT now()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS attendance (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES students(student_id),
        marked_at TIMESTAMPTZ DEFAULT now(),
        attendance_date DATE DEFAULT CURRENT_DATE
      );
    `;
    return Response.json({ success: true, message: "Tables ready." });
  } catch (err) {
    console.error("Init DB error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
