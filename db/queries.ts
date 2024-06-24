import { cache } from "react";
import db from "./drizzle";

/**
 * Retrieves the courses from the database.
 * @returns {Promise<Course[]>} A promise that resolves to an array of courses.
 */
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data;
});

// import { asc, between, count, eq, getTableColumns, sql } from "drizzle-orm";
// import db from "./drizzle";
// import {
//   InsertUser,
//   SelectUser,
//   postsTable,
//   usersTable,
//   courses,
// } from "./schema";

// export async function getCourses(): Promise<
//   Array<{
//     id: number;
//     title: string;
//     imageSrc: string;
//   }>
// > {
//   // return db.select().from(courses).where(eq(usersTable.id, id));
//   return db.select().from(courses);
// }
