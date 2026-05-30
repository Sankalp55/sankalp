"use client";

import { usePathname } from "next/navigation";
import { useTransition } from "./TransitionProvider";

const LINKS: { href: string; idx: string; label: string; wipe: "HOME" | "WORK" | "ABOUT" }[] = [
  { href: "/", idx: "01", label: "Home", wipe: "HOME" },
  { href: "/projects", idx: "02", label: "Projects", wipe: "WORK" },
  { href: "/about", idx: "03", label: "About", wipe: "ABOUT" },
];

export default function Nav() {
  const pathname = usePathname();
  const { navigateWithWipe } = useTransition();

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    wipe: "HOME" | "WORK" | "ABOUT"
  ) => {
    e.preventDefault();
    if (pathname === href) return;
    navigateWithWipe(href, wipe);
  };

  return (
    <nav className="nav">
      <a
        className="nav-brand magnetic"
        data-strength="0.25"
        href="/"
        data-cursor="Top"
        onClick={(e) => handleClick(e, "/", "HOME")}
      >
        <span className="dot" />
        <span className="full">SANKALP TYAGI</span>
      </a>
      <div className="nav-links">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <a
              key={l.href}
              className={`nav-link${active ? " active" : ""}`}
              href={l.href}
              onClick={(e) => handleClick(e, l.href, l.wipe)}
            >
              <span className="idx">{l.idx}</span>
              {l.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
