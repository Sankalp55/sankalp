"use client";

import { useState } from "react";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

export default function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [ok, setOk] = useState("");

  function setField(name: Field, v: string) {
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Required";
    if (!values.email.trim()) next.email = "Required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim()))
      next.email = "Enter a valid email";
    if (!values.message.trim()) next.message = "Required";

    setErrors(next);
    if (Object.keys(next).length === 0) {
      setOk("Message sent. I will reply shortly.");
      setValues({ name: "", email: "", message: "" });
      setTimeout(() => setOk(""), 4000);
    }
  }

  return (
    <section className="contact shell section-pad" id="contact" data-screen-label="Contact">
      <div data-reveal>
        <div className="reveal-line">
          <span className="kicker">04 — Contact</span>
        </div>
      </div>
      <h2 className="contact-head" data-split>
        Let us build something.
      </h2>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-block" data-fade>
            <div className="l">Phone</div>
            <a
              className="b magnetic"
              data-strength="0.2"
              href="tel:+919068499273"
              data-cursor="Call"
            >
              +91 90684 99273
            </a>
          </div>
          <div className="contact-block" data-fade="0.06">
            <div className="l">LinkedIn</div>
            <a
              className="b magnetic"
              data-strength="0.2"
              href="https://www.linkedin.com/in/sankalp-tyagi-173844265/"
              target="_blank"
              rel="noopener"
              data-cursor="Open"
            >
              in/sankalp-tyagi
            </a>
          </div>
          <div className="contact-block" data-fade="0.12">
            <div className="l">Availability</div>
            <div className="b">Open to frontend roles, 2026</div>
          </div>
        </div>

        <form className="form" id="contact-form" noValidate data-fade onSubmit={onSubmit}>
          <div className={`field${errors.name ? " err" : ""}`}>
            <label>Your name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
            />
            <div className="msg">{errors.name || ""}</div>
          </div>
          <div className={`field${errors.email ? " err" : ""}`}>
            <label>Email</label>
            <input
              type="email"
              placeholder="jane@studio.com"
              autoComplete="email"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
            />
            <div className="msg">{errors.email || ""}</div>
          </div>
          <div className={`field${errors.message ? " err" : ""}`}>
            <label>Message</label>
            <textarea
              rows={3}
              placeholder="Tell me about the project."
              value={values.message}
              onChange={(e) => setField("message", e.target.value)}
            />
            <div className="msg">{errors.message || ""}</div>
          </div>
          <button
            type="submit"
            className="form-submit magnetic"
            data-strength="0.4"
            data-cursor="Send"
          >
            <span className="t">Send message</span>
          </button>
          <div className="form-ok" role="status" aria-live="polite">
            {ok}
          </div>
        </form>
      </div>
    </section>
  );
}
