"use client";

import { useState, useTransition } from "react";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import type { SelectChallenges, SelectChallengeOptions } from "@/db/schema";

import { toast } from "sonner";
import { Header } from "./header";
import { Footer } from "./footer";
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
  const [pending, startTransition] = useTransition();

  const [hearts, setHearts] = useState(initialHearts);
  const [Percentage, setPercentage] = useState(initialPercentage);
  const [challenges, setchallenges] = useState(initialLessonChallenges);
  // index of first uncompleted challenge or 0 if all are completed
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>(); // ID of the option selected by the user. Initially, no option is selected (undefined)
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none"); // state of the selected user response as 'correct', 'wrong', or 'none'

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  // advances to the next challenge
  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  // sets the selected option ID, but only if no option has been selected yet
  const onSelect = (id: number) => {
    if (status !== "none") {
      return;
    }

    setSelectedOption(id);
  };

  // handles the user's response to the challenge
  const onContinue = async () => {
    if (!selectedOption) {
      return;
    }

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (!correctOption) {
      return;
    }

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              console.log("Missing hearts");
              return;
            }

            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            // This is a preactice
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again"));
      });
    } else {
      // TODO: validate errors sends fron backend
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "practice") {
              toast.error("This is a practice. No hearts to reduce.");
              // console.log("This is a practice. No hearts to reduce.");
              return;
            } else if (response?.error === "hearts") {
              toast.error("Missing hearts.");
              // console.log("Missing hearts");
              return;
            }

            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again"));
      });
    }
  };

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
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
