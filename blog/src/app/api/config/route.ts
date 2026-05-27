import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const configs = await prisma.siteConfig.findMany();
  return NextResponse.json(
    Object.fromEntries(configs.map((c) => [c.key, c.value]))
  );
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const operations = Object.entries(body).map(([key, value]) =>
    prisma.siteConfig.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })
  );

  await Promise.all(operations);

  return NextResponse.json({ success: true });
}
