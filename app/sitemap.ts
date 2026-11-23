import type { MetadataRoute } from "next";
import { destinations, guides } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return [
    "",
    "/destinations",
    "/courses",
    "/pricing",
    "/about",
    "/book",
    "/plan",
    "/guides",
    "/privacy",
    "/terms",
    ...destinations.map((d) => "/destinations/" + d.slug),
    ...guides.map((g) => "/guides/" + g.slug),
  ].map((path) => ({ url: base + path, lastModified: "2026-11-23" }));
}

