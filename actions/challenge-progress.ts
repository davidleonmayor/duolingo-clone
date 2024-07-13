"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { and, eq } from "drizzle-orm";

import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challenges, challengeProgress, userProgress } from "@/db/schema";
import { revalidatePath } from "next/cache";

/**
 * Updates or inserts challenge progress for a user
 *
 * @param {number} challengeId - The ID of the challenge to update or insert progress for.
 * @returns {Object} An error object if the user has no hearts left, otherwise returns void.
 */
export const upsertChallengeProgress = async (challengeId: number) => {
  // Authenticate the user
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Retrieve the current user's progress
  const currentUserProgress = await getUserProgress();
  const userSubscription = await getUserSubscription();

  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  // Retrieve the challenge information
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

  const isPractice = !!existingChallengeProgress; // If there's existing progress, it's a practice challenge
  if (
    !userSubscription?.isActive &&
    currentUserProgress.hearts === 0 &&
    !isPractice
  ) {
    return { error: "hearts" };
  }

  if (isPractice) {
    // Update existing challenge progress
    await db
      .update(challengeProgress)
      .set({
        completed: true,
      })
      .where(eq(challengeProgress.id, existingChallengeProgress.id));

    // Update user progress with additional hearts and points
    await db
      .update(userProgress)
      .set({
        hearts: Math.min(currentUserProgress.hearts + 1, 5),
        points: currentUserProgress.points + 10,
      })
      .where(eq(userProgress.userId, userId));

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson${lessonId}`);
    return;
  }

  // Insert new challenge progress record
  await db.insert(challengeProgress).values({
    challengeId,
    userId,
    completed: true,
  });
  // Update user progress with additional points
  await db
    .update(userProgress)
    .set({
      points: currentUserProgress.points + 10,
    })
    .where(eq(userProgress.userId, userId));

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson${lessonId}`);
};
