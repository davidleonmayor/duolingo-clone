import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import db from "./drizzle";
import {
  courses,
  lessons,
  userProgress,
  units,
  challengeProgress,
} from "@/db/schema";

/**
 * Retrieves the user progress from the database.
 *
 * @returns {Promise<UserProgress|null>} A promise that resolves to the user progress or null if no user is authenticated.
 */
export const getUserProgress = cache(async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  // Fetch user progress including active course details
  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  return data;
});

/**
 * Retrieves a course by its ID from the database.
 *
 * @param {number} courseId - The ID of the course to retrieve.
 * @returns {Promise<Course|null>} A promise that resolves to the course data or null if no course is found.
 */
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
  // Fetch units, lessons, and challenges with challenge progress for the active course
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

  // Normalize the data to include completion status for each lesson
  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedChallenges = unit.lessons.map((lesson) => {
      if (lesson.challenges.length === 0) {
        return {
          ...lesson,
          completed: false,
        };
      }

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

/**
 * Fetches the active course progress for the authenticated user.
 *
 * @returns {Object|null} An object containing the active lesson and its ID, or null if no user is authenticated or no active course is found.
 */
export const getCourseProgress = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  // Fetch units and lessons of the active course, ordered by unit order
  const unitsInAcitveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          unit: true,
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

  // Find the first lesson with uncompleted challenges
  const firstUncopmletedLesson = unitsInAcitveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        // TODO: if sonthing is not working, check the last clause
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some(
            (progress) => progress.completed === false
          )
        );
      });
    });

  return {
    activeLesson: firstUncopmletedLesson,
    activeLessonId: firstUncopmletedLesson?.id,
  };
});

/**
 * Retrieves a lesson by its ID or the active lesson for the authenticated user.
 *
 * @param {number} [id] - The ID of the lesson to retrieve. If not provided, retrieves the active lesson.
 * @returns {Promise<Lesson|null>} A promise that resolves to the lesson data, including normalized challenges, or null if no lesson is found.
 */
export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const courseProgress = await getCourseProgress();

  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) {
    return null;
  }

  // Fetch lesson details including challenges
  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) {
    return null;
  }

  // Normalize challenges to include completion status
  const normalizedChallenges = data.challenges.map((challenge) => {
    // TODO: if sonthing is not working, check the last clause
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed);

    return {
      ...challenge,
      completed,
    };
  });

  return {
    ...data,
    challenges: normalizedChallenges,
  };
});

/**
 * Calculates the completion percentage of the active lesson.
 * @returns {Promise<number>} The completion percentage of the active lesson.
 */
export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  // If there is no active lesson, return 0%
  if (!courseProgress?.activeLessonId) {
    return 0;
  }

  const lesson = await getLesson(courseProgress.activeLessonId);

  // If the lesson is not found, return 0%
  if (!lesson) {
    return 0;
  }

  // Filter out completed challenges from the lesson
  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.completed
  );
  // Calculate the percentage of completed challenges
  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100
  );

  return percentage;
});
