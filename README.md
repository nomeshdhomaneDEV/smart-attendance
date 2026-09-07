# Smart Attendance — Deployment Guide (No AWS, 100% Vercel)

This app runs entirely on Vercel:
- Face recognition happens in the browser using face-api.js (free, open-source)
- Data is stored in Vercel Postgres
- No AWS account, no servers, nothing to maintain

Follow these steps exactly, in order.

## 1. Create a GitHub repository
1. Go to https://github.com/new
2. Name it `smart-attendance`, keep it Public or Private, click **Create repository**.
3. On the empty repo page, click **uploading an existing file**.
4. Upload every file/folder from this project (keep the folder structure intact — `app/`, `lib/`, `public/`, `package.json`).
5. Commit the files.

## 2. Deploy to Vercel
1. Go to https://vercel.com and sign in (use "Continue with GitHub").
2. Click **Add New → Project**.
3. Select your `smart-attendance` repository → click **Import**.
4. Leave all settings as default (Vercel auto-detects Next.js).
5. Click **Deploy**. Wait ~1-2 minutes.

## 3. Add Vercel Postgres (the database)
1. In your Vercel project dashboard, go to the **Storage** tab.
2. Click **Create Database → Postgres**.
3. Name it anything (e.g. `attendance-db`) → **Create**.
4. Click **Connect Project** and select your `smart-attendance` project.
   This automatically adds the required database environment variables —
   you don't need to copy/paste any keys yourself.
5. Go to **Deployments**, click the three dots on the latest deployment → **Redeploy**
   (this ensures the new database connection is picked up).

## 4. Initialize the database tables
Once redeployed, visit this URL once in your browser (replace with your actual domain):

```
https://your-project-name.vercel.app/api/init-db
```

You should see `{"success":true,"message":"Tables ready."}`. That's it — the database is set up permanently. You never need to visit this again unless you reset the database.

## 5. Use the app
- `/register` — enroll a student's face
- `/attendance` — scan a face and mark attendance
- `/dashboard` — view records

## Notes for your report
- **Face matching** runs client-side using a pretrained neural network (face-api.js, based on a MobileNet-style architecture) — no image ever leaves the browser during matching, only the final 128-number descriptor is sent to the server.
- **Vercel Postgres** is a managed, serverless Postgres database — you never provision or patch a database server.
- **Vercel serverless functions** power every `/api/*` route — each request spins up on demand and scales automatically, matching the same "pay-per-use, auto-scaling" principle AWS Lambda demonstrates.
- Good report section: compare this Vercel-native implementation against the AWS-native equivalent (S3 + Rekognition + DynamoDB + Lambda) — same architectural pattern, different provider.
