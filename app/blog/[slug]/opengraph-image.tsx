/*
  Per-post Open Graph image (1200x630), generated at build time for each
  blog post via the segment's static params. Shows the post title, date,
  and tags on the brand gradient.
*/

import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const runtime = "nodejs";
export const alt = "Blog post on AI Journey";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "AI Journey";
  const date = post ? formatDate(post.date) : "";
  const tags = post?.tags.slice(0, 3) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #14532d 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #22c55e, #f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "30px",
            }}
          >
            AI
          </div>
          <div style={{ color: "#4ade80", fontSize: "30px", fontWeight: 600 }}>
            AI Journey
          </div>
        </div>

        <div
          style={{
            fontSize: title.length > 50 ? "60px" : "76px",
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 22px",
                borderRadius: "9999px",
                background: "rgba(34, 197, 94, 0.18)",
                color: "#4ade80",
                fontSize: "26px",
              }}
            >
              {tag}
            </div>
          ))}
          <div style={{ color: "#94a3b8", fontSize: "26px", marginLeft: "auto" }}>
            {date}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
