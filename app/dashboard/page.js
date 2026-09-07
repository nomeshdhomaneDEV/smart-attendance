"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [attendanceRes, studentsRes] = await Promise.all([
        fetch("/api/attendance"),
        fetch("/api/students"),
      ]);
      const attendanceData = await attendanceRes.json();
      const studentsData = await studentsRes.json();
      setRecords(attendanceData.records || []);
      setStudents(studentsData.students || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="shell">
      <div className="topbar">
        <span className="mark">smart-attendance / vercel</span>
        <nav>
          <Link href="/register">Register</Link>
          <Link href="/attendance">Attendance</Link>
          <Link href="/dashboard" className="active">Dashboard</Link>
        </nav>
      </div>

      <h1>Dashboard</h1>
      <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
        {students.length} registered · {records.length} attendance record{records.length === 1 ? "" : "s"} shown
      </p>

      <div className="panel">
        <h3>Recent attendance</h3>
        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : records.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No attendance marked yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No.</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td className="mono">{r.roll_number}</td>
                    <td>{new Date(r.attendance_date).toLocaleDateString()}</td>
                    <td className="mono">{new Date(r.marked_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <h3>Registered students</h3>
        {students.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No students registered yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No.</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.student_id}>
                    <td>{s.name}</td>
                    <td className="mono">{s.roll_number}</td>
                    <td>{new Date(s.registered_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
