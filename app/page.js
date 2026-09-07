import Link from "next/link";

export default function Home() {
  return (
    <div className="shell">
      <div className="topbar">
        <span className="mark">smart-attendance / vercel</span>
        <nav>
          <Link href="/register">Register</Link>
          <Link href="/attendance">Attendance</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </div>

      <div className="hero">
        <h1>Face-recognition attendance, running entirely on Vercel.</h1>
        <p>
          No servers, no external cloud AI service — face matching runs in the
          browser. Register a face once, then mark attendance in a glance.
        </p>
      </div>

      <div className="route-grid">
        <Link href="/register" className="route-card">
          <div>
            <div className="label">Register a student</div>
            <div className="desc">Capture a face and save it to the database</div>
          </div>
          <span className="badge">01</span>
        </Link>
        <Link href="/attendance" className="route-card">
          <div>
            <div className="label">Take attendance</div>
            <div className="desc">Match a live face against registered students</div>
          </div>
          <span className="badge">02</span>
        </Link>
        <Link href="/dashboard" className="route-card">
          <div>
            <div className="label">Dashboard</div>
            <div className="desc">View attendance records and enrolled students</div>
          </div>
          <span className="badge">03</span>
        </Link>
      </div>
    </div>
  );
}
