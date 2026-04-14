"use client";

import { useEffect, useMemo, useState } from "react";
import classes from "./ImageCarousel.module.scss";

const TYPING_MS = 46;
const PAUSE_FULL_MS = 2400;
const DELETING_MS = 26;
const PAUSE_EMPTY_MS = 400;

type Phase = "typing" | "pauseFull" | "deleting" | "pauseEmpty";

type Props = {
  phrases: string[];
  className?: string;
};

export default function RotatingTypewriter({ phrases, className }: Props) {
  const list = useMemo(() => phrases.filter(Boolean), [phrases]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const current = list[phraseIndex % list.length] ?? "";
  const visible = reducedMotion ? current : current.slice(0, charCount);

  useEffect(() => {
    if (list.length === 0 || reducedMotion) return;

    let t: ReturnType<typeof setTimeout>;

    switch (phase) {
      case "typing":
        if (charCount < current.length) {
          t = setTimeout(() => setCharCount((c) => c + 1), TYPING_MS);
        } else {
          t = setTimeout(() => setPhase("pauseFull"), PAUSE_FULL_MS);
        }
        break;
      case "pauseFull":
        t = setTimeout(() => setPhase("deleting"), 0);
        break;
      case "deleting":
        if (charCount > 0) {
          t = setTimeout(() => setCharCount((c) => c - 1), DELETING_MS);
        } else {
          t = setTimeout(() => setPhase("pauseEmpty"), PAUSE_EMPTY_MS);
        }
        break;
      case "pauseEmpty":
        t = setTimeout(() => {
          setPhraseIndex((i) => (i + 1) % list.length);
          setPhase("typing");
        }, 0);
        break;
      default:
        break;
    }

    return () => clearTimeout(t);
  }, [phase, charCount, current.length, list.length, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || list.length === 0) return;
    setCharCount(0);
    setPhase("typing");
  }, [phraseIndex, reducedMotion, list.length]);

  if (list.length === 0) return null;

  const showCaret =
    !reducedMotion && (phase === "typing" || phase === "deleting" || phase === "pauseFull");

  return (
    <p
      className={[classes.rotatingLine, className].filter(Boolean).join(" ")}
      aria-live="polite"
    >
      <span className={classes.rotatingGradient}>{visible}</span>
      {showCaret && (
        <span className={classes.rotatingCaret} aria-hidden>
          |
        </span>
      )}
    </p>
  );
}
