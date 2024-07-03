"use client";

import { useState } from "react";

import {
  SelectChallenges,
  SelectChallengeOptions,
  SelectChallengeProgress,
} from "@/db/schema";

import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";

type InitialLessonChallenges = SelectChallenges & {
  completed: boolean;
  challengeOptions: SelectChallengeOptions[];
};

type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: InitialLessonChallenges[];
  userDescription: any; // TODO: Define userDescription type from db
};

/**
 * Quiz component for displaying a quiz with challenges.
 *
 * @param {number} initialPercentage - Initial percentage of quiz progress.
 * @param {number} initialHearts - Initial number of user's hearts.
 * @param {number} initialLessonId - ID of the initial lesson.
 * @param {InitialLessonChallenges[]} initialLessonChallenges - List of initial lesson challenges.
 * @param {any} userDescription - User description (for verifying active subscription, for example).
 */
export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userDescription,
}: Props) => {
  const [hearts, setHearts] = useState<number>(initialHearts);
  const [Percentage, setPercentage] = useState<number>(initialPercentage);
  const [challenges, setchallenges] = useState<InitialLessonChallenges[]>(
    initialLessonChallenges
  );
  // index of first uncompleted challenge or 0 if all are completed
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  return (
    <>
      <Header
        hearts={hearts}
        percentage={Percentage}
        hasActiveSubscription={!!userDescription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700 ">
              {title}
            </h1>
            <div className="">
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={() => {}}
                status="none"
                selectedOption={undefined}
                disabled={false}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
