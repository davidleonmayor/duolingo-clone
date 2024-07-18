import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found in .env file");

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema }); // If you have a type error here, maybe is for incopatibility versions of drizzle-orm and neon-http

/**
 * Clean the complete database.
 */
const seed = async () => {
  console.log("Deleting all data...");

  await db.delete(schema.courses);
  await db.delete(schema.userProgress);
  await db.delete(schema.units);
  await db.delete(schema.lessons);
  await db.delete(schema.challenges);
  await db.delete(schema.challengeOption);
  await db.delete(schema.challengeProgress);
  await db.delete(schema.userSubscription);

  console.log("Finished!");
};

const main = async () => {
  try {
    await seed();
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

main();
