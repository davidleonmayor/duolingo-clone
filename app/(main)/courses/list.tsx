"use client";
// import { courses, type userProgress } from "@/db/schema"; // TODO: is better only import the type?
import { courses, userProgress } from "@/db/schema";
import { Card } from "./card";

type Props = {
  courses: (typeof courses.$inferInsert)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

export const List = ({ courses, activeCourseId }: Props) => {
  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4  ">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id as number}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={() => console.log("clicked")}
          disabled={false}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  );
};
