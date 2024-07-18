import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { eq } from "drizzle-orm";

import { isAdminUser } from "@/lib/admin";

type Options = {
  params: {
    lessonId: number;
  };
};

export async function GET(req: Request, options: Options) {
  if (!isAdminUser()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, options.params.lessonId),
  });

  return NextResponse.json(data);
}

export async function PUT(req: Request, options: Options) {
  if (!isAdminUser) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const body = await req.json();
  const data = await db
    .update(lessons)
    .set({
      ...body,
    })
    .where(eq(lessons.id, options.params.lessonId))
    .returning();

  return NextResponse.json(data[0]);
}

export async function DELETE(req: Request, options: Options) {
  if (!isAdminUser) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const data = await db
    .delete(lessons)
    .where(eq(lessons.id, options.params.lessonId))
    .returning();

  return NextResponse.json(data[0]);
}
