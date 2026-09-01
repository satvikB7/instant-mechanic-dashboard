import bcrypt from "bcrypt";
import { pool } from "../config/database";

async function createAdmin() {
  try {
    const name = "Admin";
    const email = "admin@instantmechanic.com";
    const password = "Admin@123";

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    await pool.query(
      `
        INSERT INTO users (
          name,
          email,
          password_hash,
          role
        )
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email)
        DO NOTHING
      `,
      [
        name,
        email,
        passwordHash,
        "ADMIN",
      ]
    );

    console.log("Admin user created successfully");

  } catch (error) {
    console.error(
      "Failed to create admin:",
      error
    );
  } finally {
    await pool.end();
  }
}

createAdmin();