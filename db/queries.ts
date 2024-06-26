import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import db from "./drizzle";
import { courses, userProgress } from "@/db/schema";

/**
 * Retrieves the user progress from the database.
 * @returns {Promise<UserProgress>} A promise that resolves to the user progress.
 */
export const getUserProgress = cache(async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  return data;
});

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    // TODO: Populate the course's lessons.
  });

  return data;
});

/**
 * Retrieves the courses from the database.
 * @returns {Promise<Course[]>} A promise that resolves to an array of courses.
 */
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data;
});
