"use client";

import type { SelectCourses, SelectUserProgress } from "@/db/schema";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { upserUserProgress } from "@/actions/user-progress";
import { toast } from "sonner";

import { Card } from "./card";

type Props = {
  courses: SelectCourses[];
  activeCourseId?: SelectUserProgress["activeCourseId"];
};

/**
 * Displays a grid of course cards, allowing the user to select a course.
 *
 * @param props.courses - List of courses to display.
 * @param props.activeCourseId - ID of the currently active course. Optional.
 */
export const List = ({ courses, activeCourseId }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Callback triggered when is clicked, updates user progress
  const onClick = (id: number) => {
    if (pending) return;

    if (id === activeCourseId) {
      return router.push("/learn");
    }

    startTransition(() => {
      upserUserProgress(id).catch(() => toast.error("Something went wrong."));
    });
  };

  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4  ">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id as number}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={pending}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  );
};
