"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  loadModels,
  getFaceDescriptor,
  euclideanDistance,
  isValidDescriptor,
} from "../../lib/loadModels";

const MATCH_THRESHOLD = 0.5;

export default function AttendancePage() {
  const videoRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState({ type: "pending", text: "Loading models and student data..." });
  const [ready, setReady] = useState(false);
  const [matched, setMatched] = useState(null);

  useEffect(() => {
    async function setup() {
      await loadModels();

      const res = await fetch("/api/students");
      const data = await res.json();
      const registeredStudents = Array.isArray(data.students) ? data.students : [];
      const validStudents = registeredStudents.filter((student) =>
        isValidDescriptor(student.descriptor)
      );
      setStudents(validStudents);

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      if (videoRef.current) videoRef.current.srcObject = stream;

      setStatus({ type: "ok", text: "Camera ready. Click 'Scan face' to mark attendance." });
      setReady(true);
    }
    setup().catch((err) => {
      console.error(err);
      setStatus({ type: "err", text: "Setup failed. Check camera permissions." });
    });
  }, []);

  async function handleScan() {
    setMatched(null);
    setStatus({ type: "pending", text: "Scanning..." });

    try {
      const descriptor = await getFaceDescriptor(videoRef.current);
      if (!descriptor) {
        setStatus({ type: "err", text: "No face detected. Center your full face in frame and try again." });
        return;
      }

      if (students.length === 0) {
        setStatus({
          type: "err",
          text: "No valid student face data found. Register the student again.",
        });
        return;
      }

      // Compare against every registered student, keep the closest match
      let best = null;
      let bestDistance = Infinity;
      for (const student of students) {
        const distance = euclideanDistance(descriptor, student.descriptor);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = student;
        }
      }

      if (!best || bestDistance > MATCH_THRESHOLD) {
        setStatus({ type: "err", text: "Face not recognized. Are they registered?" });
        return;
      }

      const res = await fetch("/api/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: best.student_id }),
      });
      const data = await res.json();

      setMatched(best);
      setStatus({
        type: "ok",
        text: data.alreadyMarked
          ? `${best.name} already marked present today.`
          : `${best.name} marked present.`,
      });
    } catch (err) {
      console.error("Scan error:", err);
      setStatus({ type: "err", text: "Something went wrong. Please try again." });
    }
  }

  return (
    <div className="shell">
      <div className="topbar">
        <span className="mark">smart-attendance / vercel</span>
        <nav>
          <Link href="/register">Register</Link>
          <Link href="/attendance" className="active">Attendance</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </div>

      <h1>Take attendance</h1>
      <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
        {students.length} student{students.length === 1 ? "" : "s"} registered.
      </p>

      <div className="panel">
        <div className="video-wrap">
          <video ref={videoRef} autoPlay muted playsInline />
        </div>

        <button onClick={handleScan} disabled={!ready}>Scan face</button>

        <div className={`status ${status.type}`}>{status.text}</div>

        {matched && (
          <div style={{ marginTop: 16, fontSize: 14 }}>
            <span className="badge">MATCH</span>{" "}
            <span className="mono">{matched.name} · {matched.roll_number}</span>
          </div>
        )}
      </div>
    </div>
  );
}
