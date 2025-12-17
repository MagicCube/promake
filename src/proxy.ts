import fs from "fs";
import path from "path";

import { NextResponse, type NextRequest } from "next/server";

import { getSession } from "@/server/better-auth/server";

const PROTECTED_PATHS = ["/workspace"];

export default async function proxy(req: NextRequest) {
  const session = await getSession();

  if (
    !session?.user &&
    PROTECTED_PATHS.some((path) => req.nextUrl.pathname.includes(path))
  ) {
    const signInURL = new URL("/sign-in", req.url);
    signInURL.searchParams.set(
      "redirect",
      req.nextUrl.pathname + req.nextUrl.search,
    );
    return NextResponse.redirect(signInURL);
  }

  const parts = req.nextUrl.pathname.split("/").filter(Boolean);

  if (
    parts[0] === "workspace" &&
    parts[1] === "projects" &&
    parts[2] &&
    parts[2] !== "not-found"
  ) {
    const projectId = parts[2];
    const projectPath = path.join("./public/data/projects/", projectId);

    if (fs.existsSync(projectPath)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(
          `/workspace/projects/not-found?projectId=${projectId}`,
          req.nextUrl,
        ),
      );
    }
  }

  return NextResponse.next();
}
