"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";

export default function NewsletterSignup({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const dark = variant === "dark";

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="thanks"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={clsx(
            "py-4 label",
            dark ? "text-bone/85" : "text-ink",
          )}
        >
          Thank you. — A.
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setSubmitted(true);
          }}
        >
          <div
            className={clsx(
              "flex border-b transition-colors",
              dark
                ? "border-bone/40 focus-within:border-bone"
                : "border-charcoal/40 focus-within:border-ink",
            )}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className={clsx(
                "flex-1 bg-transparent py-3 outline-none placeholder:opacity-50 uppercase tracking-[0.34em] text-[11px]",
                dark ? "text-bone" : "text-ink",
              )}
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className={clsx(
                "px-3 transition-opacity",
                dark ? "text-bone hover:opacity-60" : "text-ink hover:opacity-60",
              )}
            >
              →
            </button>
          </div>
          <p
            className={clsx(
              "text-[11px] leading-relaxed mt-4 text-left",
              dark ? "text-bone/55" : "text-charcoal/55",
            )}
          >
            By subscribing you agree to receive emails about new drops.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
