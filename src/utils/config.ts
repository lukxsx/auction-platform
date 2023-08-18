export const DATABASE_CREDENTIALS = {
  host: process.env.DB_HOST || "docker.for.mac.localhost",
  database: process.env.DB_NAME || "kysely_test",
  user: process.env.DB_USER || "username",
  password: process.env.DB_PASS || "password",
}

