"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTransition } from "./TransitionProvider";

type Wipe = "HOME" | "WORK" | "ABOUT";

type Props = {
  children: React.ReactNode;
  solid?: boolean;
  arrow?: boolean;
  magnetic?: boolean;
  strength?: number;
  cursor?: string;
  href?: string;
  external?: boolean;
  wipe?: Wipe;
  anchor?: string;
  scrollTo?: string;
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent) => void;
};

export default function Btn({
  children,
  solid,
  arrow,
  magnetic = true,
  strength = 0.4,
  cursor,
  href,
  external,
  wipe,
  anchor,
  scrollTo,
  type,
  onClick,
}: Props) {
  const pathname = usePathname();
  const { navigateWithWipe } = useTransition();

  const className = `btn${solid ? " solid" : ""}${magnetic ? " magnetic" : ""}`;

  function lenisScroll(target: string) {
    const lenis = (window as unknown as {
      __lenis?: { scrollTo: (t: string | HTMLElement, o?: object) => void };
    }).__lenis;
    if (lenis) lenis.scrollTo(target, { duration: 1.2 });
    else {
      const el = document.querySelector(target);
      if (el)
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY,
          behavior: "smooth",
        });
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick(e);
    if (external) return; // let browser handle
    if (scrollTo) {
      e.preventDefault();
      lenisScroll(scrollTo);
      return;
    }
    if (wipe && href) {
      e.preventDefault();
      if (pathname === href) {
        if (anchor) lenisScroll(anchor);
        return;
      }
      navigateWithWipe(href, wipe, anchor);
      return;
    }
  };

  const content = (
    <>
      <span className="t">{children}</span>
      {arrow && <span className="arrow" />}
    </>
  );

  if (type === "submit" || (!href && !scrollTo)) {
    return (
      <button
        type={type || "button"}
        className={className}
        data-strength={strength}
        data-cursor={cursor}
        onClick={handleClick}
      >
        {content}
      </button>
    );
  }

  return (
    <a
      className={className}
      href={href || "#"}
      data-strength={strength}
      data-cursor={cursor}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      onClick={handleClick}
    >
      {content}
    </a>
  );
}
