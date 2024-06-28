import { redirect } from "next/navigation";

import { getUnits, getUserProgress } from "@/db/queries";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";

import { Unit } from "./unit";
import { Header } from "./header";

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const unitsData = getUnits();

  const [userProgress, units] = await Promise.all([
    userProgressData,
    unitsData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 ">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        <div className="w-auto h-auto px-auto">
          {units.map((unit) => (
            <div key={unit.id} className="mb-10">
              <Unit
                id={unit.id}
                order={unit.order}
                description={unit.description}
                title={unit.title}
                lessons={unit.lessons}
                activeLesson={undefined}
                activeLessonPorcentage={0}
              />
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
