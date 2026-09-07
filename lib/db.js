import postgres from "postgres";

export const sql = postgres(
  process.env.POSTGRES_URL || "postgres://postgres:postgres@localhost:5432/postgres",
  {
  max: 1,
  prepare: false,
  ssl: "require",
  },
);