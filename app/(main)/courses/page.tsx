import { getCourses } from "@/db/queries";
import { List } from "./list";

const CoursesPage = async () => {
  const courses = await getCourses();

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700">Languages Courses</h1>
      <List courses={courses} activeCourseId={1} />
      {/* {data.map((course) => (
        <div key={course.id} className="flex items-center gap-3 mt-4">
          <img
            src={course.imageSrc}
            alt={course.title}
            className="w-16 h-16 rounded-lg"
          />
          <div>
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <p className="text-neutral-500">Description</p>
          </div>
        </div>
      ))} */}
    </div>
  );
};

export default CoursesPage;
