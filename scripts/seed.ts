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
  await db.delete(schema.units);
  await db.delete(schema.lessons);
  await db.delete(schema.challenges);
  await db.delete(schema.challengeOption);
  await db.delete(schema.challengeProgress);

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
  await db.insert(schema.units).values([
    {
      id: 1,
      title: "Unit 1",
      description: "Learn the basics of Spanish",
      courseId: 1,
      order: 1,
    },
    // {
    //   id: 2,
    //   title: "Verbs ",
    //   description: "Learn to greet people",
    //   courseId: 1,
    //   order: 2,
    // },
  ]);
  await db.insert(schema.lessons).values([
    {
      id: 1,
      title: "Nouns",
      unitId: 1,
      order: 1,
    },
    {
      id: 2,
      title: "To Eat",
      unitId: 1,
      order: 2,
    },
  ]);
  await db.insert(schema.challenges).values([
    {
      id: 1,
      lessonId: 1,
      type: "SELECT",
      question: 'Which one of these is the "the man"?',
      order: 1,
    },
    {
      id: 2,
      lessonId: 1,
      type: "ASSIST",
      question: "What is the translation of 'To Eat'?",
      order: 2,
    },
  ]);
  await db.insert(schema.challengeOption).values([
    {
      id: 1,
      challengeId: 1,
      text: "el hombre",
      correct: true,
      imageSrc: "/man.svg",
      audioSrc: "/es_man.mp3",
    },
    {
      id: 2,
      challengeId: 1,
      text: "la mujer",
      correct: false,
      imageSrc: "/woman.svg",
      audioSrc: "/es_woman.mp3",
    },
    {
      id: 3,
      challengeId: 1,
      text: "el robot",
      correct: false,
      imageSrc: "/robot.svg",
      audioSrc: "/es_robot.mp3",
    },
    // -- second challenge
    {
      id: 4,
      challengeId: 2,
      text: "Comer",
      correct: true,
    },
    {
      id: 5,
      challengeId: 2,
      text: "Beber",
      correct: false,
    },
  ]);

  await db.insert(schema.userProgress).values({
    userId: "test", // the correct user auth id
    userName: "david",
    userImageSrc: "/mascot.svg",
    activeCourseId: 1,
    hearts: 5,
    points: 0,
  });

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
