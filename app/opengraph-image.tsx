/*
  Site-wide Open Graph image (1200x630), generated at build time.
  Shown when the homepage (or any page without its own OG image) is
  shared on X, LinkedIn, Slack, etc.
*/

import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "AI Journey — learning AI in public, one post at a time";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #14532d 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #22c55e, #f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "40px",
            }}
          >
            AI
          </div>
          <div style={{ color: "#94a3b8", fontSize: "32px" }}>
            ai-journey-blog-iota.vercel.app
          </div>
        </div>
        <div
          style={{
            fontSize: "96px",
            fontWeight: 700,
            background: "linear-gradient(135deg, #22c55e, #4ade80, #f97316)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.1,
          }}
        >
          AI Journey
        </div>
        <div
          style={{
            marginTop: "28px",
            fontSize: "40px",
            color: "#cbd5e1",
          }}
        >
          Learning AI in public, one post at a time.
        </div>
      </div>
    ),
    { ...size }
  );
}
