"use client";

import React from "react";
import Btn from "./Btn";
import { useTransition } from "./TransitionProvider";

type Props = {
  flip?: boolean;
  index: string;
  phLabel: string;
  teaser?: boolean;
  name: React.ReactNode;
  meta: string;
  blurb: string;
  stack: string[];
  detailCta?: boolean;
  /** When set, the media slot renders a live, interactive iframe instead
   * of the styled placeholder. Used for projects with a running demo. */
  embedUrl?: string;
  /** Shown as the "URL bar" in the embed chrome (host only, no protocol). */
  embedHost?: string;
  /** External link for "view live" CTA on the detail card. */
  liveUrl?: string;
};

export default function ProjectArticle({
  flip,
  index,
  phLabel,
  teaser,
  name,
  meta,
  blurb,
  stack,
  detailCta,
  embedUrl,
  embedHost,
  liveUrl,
}: Props) {
  const { navigateWithWipe } = useTransition();
  const className = `proj${flip ? " flip" : ""}`;

  const media = embedUrl ? (
    <div className="proj-media proj-media--embed" data-clip>
      <span className="proj-idx">{index}</span>
      <div className="embed-chrome">
        <span className="embed-dots">
          <span />
          <span />
          <span />
        </span>
        <span className="embed-url">{embedHost || embedUrl}</span>
        <span className="embed-live">LIVE</span>
      </div>
      <iframe
        className="embed-iframe"
        src={embedUrl}
        title={typeof name === "string" ? `${name} live preview` : "Project live preview"}
        loading="lazy"
      />
    </div>
  ) : (
    <div className="proj-media" data-clip>
      <span className="proj-idx">{index}</span>
      <div className="ph" data-parallax="6">
        <span className="ph-tag">{phLabel}</span>
      </div>
      <div className="scrim" />
    </div>
  );

  const inner = (
    <>
      {media}
      <div className="proj-info">
        {teaser ? (
          <h3 className="proj-name" data-split>
            {name}
          </h3>
        ) : (
          <h2 className="proj-name" data-split>
            {name}
          </h2>
        )}
        <div className="proj-meta" data-fade>
          {meta}
        </div>
        <p className="proj-blurb" data-fade="0.05">
          {blurb}
        </p>
        <div className="proj-stack" data-fade="0.1">
          {stack.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
        {detailCta && (
          <div className="proj-cta" data-fade="0.15" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {liveUrl ? (
              <Btn arrow strength={0.4} cursor="Open" href={liveUrl} external>
                View live
              </Btn>
            ) : (
              <Btn arrow strength={0.4} cursor="Soon">
                Case study soon
              </Btn>
            )}
          </div>
        )}
      </div>
    </>
  );

  if (teaser) {
    const onActivate = (e: React.SyntheticEvent) => {
      // Don't intercept clicks that originated inside the embedded iframe area —
      // the visitor is interacting with the demo, not navigating away.
      if (
        e.target instanceof Element &&
        e.target.closest(".proj-media--embed")
      ) {
        return;
      }
      e.preventDefault();
      navigateWithWipe("/projects", "WORK");
    };
    return (
      <article
        className={className}
        data-parallax-scope
        data-cursor={embedUrl ? "Try it" : "Open"}
        role="link"
        tabIndex={0}
        onClick={onActivate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onActivate(e);
        }}
      >
        {inner}
      </article>
    );
  }

  return (
    <article className={className} data-parallax-scope>
      {inner}
    </article>
  );
}
