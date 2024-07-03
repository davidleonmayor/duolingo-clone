import { getCourses, getUserProgress } from "@/db/queries";
import { List } from "./list";

const CoursesPage = async () => {
  // const coursesData = getCourses();
  // const userProgressData = getUserProgress();

  // const [courses, userProgress] = await Promise.all([
  //   coursesData,
  //   userProgressData,
  // ]);
  // TODO: check if this wey doesn't cause a bug
  const [courses, userProgress] = await Promise.all([
    getCourses(),
    getUserProgress(),
  ]);

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700">Languages Courses</h1>
      <List courses={courses} activeCourseId={userProgress?.activeCourseId} />
    </div>
  );
};

export default CoursesPage;
