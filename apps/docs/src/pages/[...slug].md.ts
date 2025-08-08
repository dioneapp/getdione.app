import type { APIRoute } from "astro";

// serve raw markdown for any docs page when the url ends with .md
const rawMdFiles = import.meta.glob("/src/pages/**/*.md", { as: "raw", eager: true }) as Record<string, string>;

export const GET: APIRoute = async ({ params }) => {
  const slug = (params.slug as string | undefined) ?? "";
  const key = `/src/pages/${slug}.md`;
  const content = rawMdFiles[key];

  if (!content) {
    return new Response("not found", { status: 404 });
  }

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
};


