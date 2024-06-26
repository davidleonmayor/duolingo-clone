import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found in .env file");

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema }); // If you have a type error here, maybe is for incopatibility versions of drizzle-orm and neon-http

const seed = async () => {
  console.log("Seeding database...");
  console.log("Deleting all data...");
  await db.delete(schema.courses);
  await db.delete(schema.userProgress);

  console.log("Inserting data...");
  await db.insert(schema.courses).values([
    {
      id: 1,
      title: "Spanish",
      imageSrc: "es.svg",
    },
    {
      id: 2,
      title: "Italian",
      imageSrc: "it.svg",
    },
    {
      id: 3,
      title: "French",
      imageSrc: "fr.svg",
    },
    {
      id: 4,
      title: "Croatian",
      imageSrc: "hr.svg",
    },
  ]);

  console.log("Seeding Finished!");
};

const main = async () => {
  try {
    await seed();
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
  // finally {
  //   console.log("Closing connection...");
  //   process.exit(1);
  // }
};

main();
