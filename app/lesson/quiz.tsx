"use client";

import { useState, useTransition } from "react";
import { useAudio, useMount } from "react-use";
import { useRouter } from "next/navigation";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import type { SelectChallenges, SelectChallengeOptions } from "@/db/schema";

import Image from "next/image";
import { Header } from "./header";
import { ResultCard } from "./result-card";
import { toast } from "sonner";
import { Footer } from "./footer";
import { QuestionBubble } from "./question-bubble";
import { WithoutHeatsModal } from "./without-heats-modal";
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
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { width, height } = useWindowSize();

  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const [lessonId] = useState(initialLessonId); // ID of the lesson

  const [hearts, setHearts] = useState(initialHearts);
  // if the initial percentage is 100, the quiz is a practice, else is a lesson
  const [Percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
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

  // Audio for correct and wrong responses
  const [correctAudio, , correctControls] = useAudio({
    src: "/correct.mp3",
  });
  const [wrongAudio, , wrongControls] = useAudio({
    src: "/wrong.mp3",
  });
  const [successAudio] = useAudio({
    src: "/success.mp3",
    autoPlay: true,
  });
  const [failfareAudio, , failfareControls] = useAudio({
    src: "/failfare.mp3",
  });

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  // advances to the next challenge
  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  // sets the selected option ID,  but only if no option has been selected yet
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
              failfareControls.play();
              openHeartsModal();
              return;
            }

            setStatus("correct");
            correctControls.play();
            setPercentage((prev) => prev + 100 / challenges.length);

            // This is a preactice
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again"));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "practice") {
              toast.error("This is a practice. No hearts to reduce.");
              return;
            } else if (response?.error === "hearts") {
              failfareControls.play();
              openHeartsModal();
              return;
            }

            setStatus("wrong");
            wrongControls.play();

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again"));
      });
    }
  };

  // if there are no more challenges, is because the lesson is completed. Show the finish screen
  if (!challenge) {
    return (
      <>
        {successAudio}
        <Confetti
          recycle={false}
          numberOfPieces={300}
          tweenDuration={10000}
          width={width}
          height={height}
        />

        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          {/* TODO: Add finish.svg image */}
          <Image
            src="/mascot.svg"
            alt="Finish"
            className="block lg:hidden"
            height={50}
            width={50}
          />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            Great job! <br /> you&apos;ve completed the lesson.
          </h1>
          <div className="flex item-center gap-x-4 w-full">
            <ResultCard
              variant="points"
              // 10 is how many points you get for each challenge
              value={challenges.length * 10}
            />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  return (
    <>
      {correctAudio}
      {wrongAudio}
      {failfareAudio}

      <Header
        hearts={hearts}
        percentage={Percentage}
        hasActiveSubscription={!!userDescription?.isActive}
      />
      {/* {hearts === 0 && <WithoutHeatsModal />} */}
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
