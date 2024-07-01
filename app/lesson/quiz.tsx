"use client";

import { useState } from "react";

import {
  SelectChallenges,
  SelectChallengeOptions,
  SelectChallengeProgress,
} from "@/db/schema";

import { Header } from "./header";

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

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userDescription,
}: Props) => {
  const [hearts, setHearts] = useState<number>(initialHearts);
  const [Percentage, setPercentage] = useState<number>(initialPercentage);

  return (
    <>
      <Header
        hearts={hearts}
        percentage={Percentage}
        hasActiveSubscription={!!userDescription?.isActive}
      />
    </>
  );
};
