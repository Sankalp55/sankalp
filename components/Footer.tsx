"use client";

import { useTransition } from "./TransitionProvider";

type Props = { variant?: "home" | "sub" };

export default function Footer({ variant = "home" }: Props) {
  const { navigateWithWipe } = useTransition();
  if (variant === "home") {
    return (
      <footer className="footer">
        <span>© 2026 Sankalp Tyagi</span>
        <span>Frontend Focused Full Stack Developer</span>
        <a
          href="https://www.linkedin.com/in/sankalp-tyagi-173844265/"
          target="_blank"
          rel="noopener"
          data-cursor="Open"
        >
          LinkedIn ↗
        </a>
      </footer>
    );
  }
  return (
    <footer className="footer">
      <span>© 2026 Sankalp Tyagi</span>
      <a
        href="/"
        data-cursor="Top"
        onClick={(e) => {
          e.preventDefault();
          navigateWithWipe("/", "HOME");
        }}
      >
        Back home ↑
      </a>
    </footer>
  );
}
