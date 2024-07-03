import type { SelectUnits, SelectLessons } from "@/db/schema";

import { UnitBanner } from "./unit-banner";
import { LessonButton } from "./lesson-button";

type Lesson = SelectLessons & {
  completed: boolean;
};

type Unit = Omit<SelectUnits, "courseId">;

type ActiveLesson = SelectLessons & {
  unit: Unit;
};

type Props = Unit & {
  lessons: Lesson[];
  activeLesson: ActiveLesson | undefined;
  activeLessonPorcentage: number;
};

export const Unit = ({
  id,
  order,
  title,
  description,
  lessons,
  activeLesson,
  activeLessonPorcentage,
}: Props) => {
  return (
    <>
      <UnitBanner title={title} description={description} />
      <div className="flex items-center flex-col relative">
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLesson?.id;
          const isLocked = !lesson.completed && !isCurrent;

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              locked={isLocked}
              current={isCurrent}
              percentage={activeLessonPorcentage}
            />
          );
        })}
      </div>
    </>
  );
};
