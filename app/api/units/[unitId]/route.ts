import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { eq } from "drizzle-orm";

import { isAdminUser } from "@/lib/admin";

type Options = {
  params: {
    unitId: number;
  };
};

export async function GET(req: Request, options: Options) {
  if (!isAdminUser()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.units.findFirst({
    where: eq(units.id, options.params.unitId),
  });

  return NextResponse.json(data);
}

export async function PUT(req: Request, options: Options) {
  if (!isAdminUser) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const body = await req.json();
  const data = await db
    .update(units)
    .set({
      ...body,
    })
    .where(eq(units.id, options.params.unitId))
    .returning();

  return NextResponse.json(data[0]);
}

export async function DELETE(req: Request, options: Options) {
  if (!isAdminUser) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const data = await db
    .delete(units)
    .where(eq(units.id, options.params.unitId))
    .returning();

  return NextResponse.json(data[0]);
}
