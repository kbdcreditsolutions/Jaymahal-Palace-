"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ScrollExpandHeroProps {
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  kicker?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

/**
 * Scroll-driven hero: the video card grows from a portrait tile to full screen
 * as the user scrolls through a 250vh runway, then normal content takes over.
 * Uses native scroll (no wheel hijacking) so keyboard, a11y and mobile all work.
 */
const ScrollExpandHero = ({
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  kicker,
  scrollToExpand,
  children,
}: ScrollExpandHeroProps) => {
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  const width = useTransform(scrollYProgress, [0, 1], ["min(320px, 80vw)", "100vw"]);
  const height = useTransform(scrollYProgress, [0, 1], ["min(420px, 60vh)", "100vh"]);
  const radius = useTransform(scrollYProgress, [0, 0.9, 1], [16, 16, 0]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const veilOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0.2]);
  const leftX = useTransform(scrollYProgress, [0, 1], ["0vw", "-42vw"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["0vw", "42vw"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div className="overflow-x-clip">
      <div ref={runwayRef} className="relative h-[250vh]">
        <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden">
          {/* Aerial backdrop, fades out as the video takes over */}
          <motion.div className="absolute inset-0 z-0" style={{ opacity: prefersReduced ? 0 : bgOpacity }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bgImageSrc}
              alt="Jaya Mahal Palace grounds from above"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
          </motion.div>

          {/* Expanding video card */}
          <motion.div
            className="relative z-10 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)]"
            style={
              prefersReduced
                ? { width: "100vw", height: "100vh", borderRadius: 0 }
                : { width, height, borderRadius: radius }
            }
          >
            <video
              src={mediaSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="pointer-events-none h-full w-full object-cover"
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
            />
            <motion.div className="absolute inset-0 bg-black" style={{ opacity: prefersReduced ? 0.25 : veilOpacity }} />
          </motion.div>

          {/* Title splits apart as the card expands */}
          <motion.div
            className="pointer-events-none absolute z-20 flex w-full flex-col items-center gap-2 text-center"
            style={{ opacity: prefersReduced ? 1 : titleOpacity }}
          >
            <motion.h1
              className="font-display text-6xl font-semibold text-[var(--jm-ivory)] drop-shadow-[0_2px_18px_rgba(0,0,0,0.7)] md:text-8xl"
              style={prefersReduced ? undefined : { x: leftX }}
            >
              {firstWord}
            </motion.h1>
            <motion.h1
              className="font-display text-6xl font-semibold text-gold-gradient drop-shadow-[0_2px_18px_rgba(0,0,0,0.7)] md:text-8xl"
              style={prefersReduced ? undefined : { x: rightX }}
            >
              {restOfTitle}
            </motion.h1>
          </motion.div>

          {/* Kicker + scroll hint */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex flex-col items-center gap-2"
            style={{ opacity: prefersReduced ? 1 : hintOpacity }}
          >
            {kicker && (
              <p className="px-4 text-center text-xs uppercase tracking-[0.35em] text-[var(--jm-gold-soft)]">
                {kicker}
              </p>
            )}
            {scrollToExpand && (
              <p className="animate-pulse text-sm text-[var(--jm-ivory)]/80">{scrollToExpand}</p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 bg-[var(--jm-bg)]">{children}</div>
    </div>
  );
};

export default ScrollExpandHero;
