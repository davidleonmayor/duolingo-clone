import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import db from "./drizzle";
import { courses, userProgress, units, challengeProgress } from "@/db/schema";

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

/**
 * Retrieves the units data from the database and normalizes the response.
 * @returns {Promise<Array<Unit>>} The units data.
 */
export const getUnits = cache(async () => {
  const { userId } = auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return [];
  }

  // TODO: Confirm whether order is needed
  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedChallenges = unit.lessons.map((lesson) => {
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        );
      });

      return {
        ...lesson,
        completed: allCompletedChallenges,
      };
    });

    return {
      ...unit,
      lessons: lessonsWithCompletedChallenges,
    };
  });

  return normalizedData;
});
