import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ success: false, data: null, error: "url is required" }, { status: 400 });
    }

    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") {
      return NextResponse.json({ success: false, data: null, error: "Only GitHub URLs are supported" }, { status: 400 });
    }

    const [, owner, repo] = parsed.pathname.split("/");
    if (!owner || !repo) {
      return NextResponse.json({ success: false, data: null, error: "Invalid GitHub URL format" }, { status: 400 });
    }

    const cleanRepo = repo.replace(/\.git$/, "");
    const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}`;

    const res = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "GitBoost",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, data: null, error: "GitHub repository not found" }, { status: res.status });
    }

    const data = await res.json();

    const metadata = {
      title: data.name ?? cleanRepo,
      description: data.description ?? "",
      language: data.language ?? null,
      github_stars: data.stargazers_count ?? 0,
      github_forks: data.forks_count ?? 0,
      github_updated: data.updated_at ?? null,
      owner: data.owner?.login ?? owner,
      avatar_url: data.owner?.avatar_url ?? null,
    };

    return NextResponse.json({ success: true, data: metadata, error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to fetch GitHub metadata" }, { status: 500 });
  }
}
