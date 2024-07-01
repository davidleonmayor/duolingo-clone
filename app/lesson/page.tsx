import { redirect } from "next/navigation";
import { getLesson, getUserProgress } from "@/db/queries";

import { Quiz } from "./quiz";

type Props = {};

const LessonPage = async ({}: Props) => {
  const getLessonData = getLesson();
  const getUserProgressData = getUserProgress();

  const [lesson, userProgress] = await Promise.all([
    getLessonData,
    getUserProgressData,
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userDescription={null}
    />
  );
};

export default LessonPage;
