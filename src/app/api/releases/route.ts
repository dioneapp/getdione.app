import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "No GitHub token configured" }, { status: 500 });
  }

  const response = await fetch(
    "https://api.github.com/repos/dioneapp/dioneapp/releases",
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch releases" },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}