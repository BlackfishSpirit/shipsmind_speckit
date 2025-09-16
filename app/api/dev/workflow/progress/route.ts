import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { UserProgress } from "@/types/workflow";

// Get user-specific progress file path
function getUserProgressPath(username: string): string {
  const homeDir = os.homedir();
  const shipsmindDir = path.join(homeDir, ".shipsmind", "workflows");
  return path.join(shipsmindDir, `${username}.json`);
}

// Ensure directory exists
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("user");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const progressPath = getUserProgressPath(username);

    try {
      const fileContents = await fs.readFile(progressPath, "utf8");
      const userProgress = JSON.parse(fileContents);
      return NextResponse.json(userProgress);
    } catch (error) {
      // File doesn't exist, return empty progress
      return NextResponse.json(null, { status: 404 });
    }
  } catch (error) {
    console.error("Error loading user progress:", error);
    return NextResponse.json(
      { error: "Failed to load user progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userProgress: UserProgress = await request.json();

    if (!userProgress.username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const progressPath = getUserProgressPath(userProgress.username);
    const progressDir = path.dirname(progressPath);

    // Ensure directory exists
    await ensureDirectoryExists(progressDir);

    // Save user progress
    await fs.writeFile(
      progressPath,
      JSON.stringify(userProgress, null, 2),
      "utf8"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving user progress:", error);
    return NextResponse.json(
      { error: "Failed to save user progress" },
      { status: 500 }
    );
  }
}
