import { SelectLessons, SelectUnits } from "@/db/schema";

import { redirect } from "next/navigation";

import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
} from "@/db/queries";

import { Unit } from "./unit";
import { Header } from "./header";

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();

  const [userProgress, units, courseProgress, lessonPercentage] =
    await Promise.all([
      userProgressData,
      unitsData,
      courseProgressData,
      lessonPercentageData,
    ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  if (!courseProgress) {
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
                activeLesson={
                  courseProgress.activeLesson as
                    | (SelectLessons & {
                        unit: SelectUnits;
                      })
                    | undefined
                }
                activeLessonPorcentage={lessonPercentage}
              />
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
