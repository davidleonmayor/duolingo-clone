"use server";

import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { and, eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { userProgress, challengeProgress, challenges } from "@/db/schema";
import { getCourseById, getUserProgress } from "@/db/queries";

const POINTS_TO_REFILL = 10;

/**
 * Updates or inserts user progress for a given course.
 *
 * @param {number} courseId - The ID of the course.
 * @throws {Error} Throws an error if the user is not authenticated or the course is not found.
 */
export const upserUserProgress = async (courseId: number) => {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const course = await getCourseById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  // TODO: Enable once units and lessons are added
  // if (!course.units.length || !course.units[0].lessons.length) {
  //   throw new Error("Course is empty");
  // }

  const existingUserProgress = await getUserProgress();

  // If user progress exists, update it and redirect to the learn page
  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg",
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  }

  // Otherwise, insert a new user progress record
  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/mascot.svg",
  });

  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};

/**
 * Reduces a heart for a user when fail a challenge.
 *
 * @param {number} challengeId - The ID of the challenge being attempted.
 *
 * @throws Will throw an error if the user is unauthorized, if the user/challenge progress is not found, or if the challenge is not found.
 * @returns {Object} An error object if the user has no hearts left or if it is a practice session.
 */
export const reduceHearts = async (challengeId: number) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Retrieve the current user's progress
  const currentUserProgress = await getUserProgress();
  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  // TODO: Get user subscription

  // Retrieve the challenge
  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });
  if (!challenge) {
    throw new Error("Challenge not found");
  }

  const lessonId = challenge.lessonId;

  // Check if there's existing progress for this challenge
  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  });
  // Check if there's existing progress for this challenge
  const isPractice = !!existingChallengeProgress;
  if (isPractice) {
    return { error: "practice" };
  }

  // TODO Handle subscription

  if (currentUserProgress.hearts === 0) {
    return { error: "hearts" };
  }

  // Reduce the number of hearts for the user
  await db
    .update(userProgress)
    .set({
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    })
    .where(eq(userProgress.userId, userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson${lessonId}`);
};

export const refillHearts = async () => {
  const currentUserProgress = await getUserProgress();
  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  if (currentUserProgress.hearts === 5) {
    return { error: "hearts" };
  }

  if (currentUserProgress.points < POINTS_TO_REFILL) {
    return { error: "points" };
  }

  await db
    .update(userProgress)
    .set({
      hearts: 5, // max hearts can have
      points: currentUserProgress.points - POINTS_TO_REFILL,
    })
    .where(eq(userProgress.userId, currentUserProgress.userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};
