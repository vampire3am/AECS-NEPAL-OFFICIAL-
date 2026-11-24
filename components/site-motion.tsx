"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function SiteMotion() {
  const path = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const main = document.getElementById("main");
    const animation = main?.animate(
      reduced.matches
        ? [{ opacity: 0.96 }, { opacity: 1 }]
        : [{ opacity: 0.88 }, { opacity: 1 }],
      { duration: reduced.matches ? 90 : 180, easing: "ease-out" },
    );
    const progress = document.querySelector<HTMLElement>(".reading-progress");
    let frame = 0;
    const update = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      progress?.style.setProperty(
        "--reading-progress",
        String(range > 0 ? Math.min(1, window.scrollY / range) : 0),
      );
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    const mosaic = document.querySelector(".destination-mosaic");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          if (!reduced.matches) mosaic?.classList.add("mosaic-in-view");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (mosaic) observer.observe(mosaic);
    return () => {
      animation?.cancel();
      observer.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      cancelAnimationFrame(frame);
    };
  }, [path]);
  return <div className="reading-progress" aria-hidden="true" />;
}
