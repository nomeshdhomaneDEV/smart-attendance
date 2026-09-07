"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { loadModels, getFaceDescriptor } from "../../lib/loadModels";

export default function RegisterPage() {
  const videoRef = useRef(null);
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [status, setStatus] = useState({ type: "pending", text: "Loading face-detection models..." });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function setup() {
      await loadModels();
      // "user" = front/selfie camera. Falls back to any camera if the
      // device doesn't support facingMode (most laptops).
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStatus({ type: "ok", text: "Camera ready. Position your face and submit." });
      setReady(true);
    }
    setup().catch((err) => {
      console.error(err);
      setStatus({ type: "err", text: "Could not access camera. Check browser permissions." });
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !rollNumber) {
      setStatus({ type: "err", text: "Enter both name and roll number." });
      return;
    }

    try {
      setStatus({ type: "pending", text: "Detecting face..." });
      const descriptor = await getFaceDescriptor(videoRef.current);

      if (!descriptor) {
        setStatus({ type: "err", text: "No face detected. Center your full face in frame, ensure good lighting, and try again." });
        return;
      }

      setStatus({ type: "pending", text: "Saving..." });
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rollNumber, descriptor }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ type: "ok", text: `Registered ${data.student.name} successfully.` });
        setName("");
        setRollNumber("");
      } else {
        setStatus({ type: "err", text: data.error || "Registration failed." });
      }
    } catch (err) {
      console.error("Register submit error:", err);
      setStatus({ type: "err", text: "Something went wrong. Please try again." });
    }
  }

  return (
    <div className="shell">
      <div className="topbar">
        <span className="mark">smart-attendance / vercel</span>
        <nav>
          <Link href="/register" className="active">Register</Link>
          <Link href="/attendance">Attendance</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </div>

      <h1>Register a student</h1>
      <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
        Capture one clear photo per student. This face becomes their attendance key.
      </p>

      <div className="panel">
        <div className="video-wrap">
          <video ref={videoRef} autoPlay muted playsInline />
        </div>

        <form onSubmit={handleSubmit}>
          <label>Full name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nomesh Ambadkar" />

          <label>Roll number</label>
          <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="e.g. CE-45" />

          <button type="submit" disabled={!ready}>Register face</button>
        </form>

        <div className={`status ${status.type}`}>{status.text}</div>
      </div>
    </div>
  );
}
