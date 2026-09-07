import "./globals.css";

export const metadata = {
  title: "Smart Attendance — Cloud Case Study",
  description: "Face-recognition attendance system, built on Vercel",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
