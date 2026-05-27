import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.NEXT_EXPORT === "true") {
    return NextResponse.json(
      { error: "Deploy is not available in static export mode" },
      { status: 400 }
    );
  }

  try {
    const { stdout: repoRoot } = await execAsync("git rev-parse --show-toplevel");
    const cwd = repoRoot.trim();

    let message = `deploy: ${new Date().toISOString()}`;
    try {
      const body = await request.json();
      if (typeof body.message === "string" && body.message.trim()) {
        message = body.message.trim();
      }
    } catch {
      // no body or invalid JSON, use default message
    }

    const { stdout: statusOut } = await execAsync("git status --porcelain", { cwd });
    if (!statusOut.trim()) {
      return NextResponse.json({ message: "No changes to deploy" });
    }

    await execAsync("git add -A", { cwd });
    await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd });
    await execAsync("git push", { cwd });

    return NextResponse.json({ success: true, message: "Deployed successfully" });
  } catch (error: unknown) {
    const err = error as { stderr?: string; message?: string };
    const errorMessage = err.stderr || err.message || "Unknown error";
    return NextResponse.json(
      { error: `Deploy failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
