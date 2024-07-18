import { NextRequest, NextResponse } from "next/server";

import { isAdminUser } from "@/lib/admin";

import db from "@/db/drizzle";
import { courses } from "@/db/schema";

export async function GET() {
  if (!isAdminUser()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.courses.findMany();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!isAdminUser()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = await db
    .insert(courses)
    .values({ ...body })
    .returning();

  return NextResponse.json(data[0]);
}

// export async function PUT(req: NextRequest) {
//   if (!isAdminUser()) {
//     return new NextResponse("Unauthorized", { status: 401 });
//   }

//   const body = await req.json();

//   try {
//     const updatedCourse = await db
//       .update(courses)
//       .set({ ...body })
//       .where(eq(courses.id, body))
//       .returning();

//     if (updatedCourse.length === 0) {
//       return new NextResponse("Not Found", { status: 404 });
//     }

//     return NextResponse.json(updatedCourse[0]);
//   } catch (error) {
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }
