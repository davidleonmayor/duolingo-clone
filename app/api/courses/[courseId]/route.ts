import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";

import { isAdminUser } from "@/lib/admin";

type Options = {
  params: {
    courseId: number;
  };
};

export async function GET(req: Request, options: Options) {
  if (!isAdminUser()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.courses.findFirst({
    where: eq(courses.id, options.params.courseId),
  });

  return NextResponse.json(data);
}

export async function PUT(req: Request, options: Options) {
  if (!isAdminUser) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const body = await req.json();
  const data = await db
    .update(courses)
    .set({
      ...body,
    })
    .where(eq(courses.id, options.params.courseId))
    .returning();

  return NextResponse.json(data[0]);
}

export async function DELETE(req: Request, options: Options) {
  if (!isAdminUser) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const data = await db
    .delete(courses)
    .where(eq(courses.id, options.params.courseId))
    .returning();

  return NextResponse.json(data[0]);
}
