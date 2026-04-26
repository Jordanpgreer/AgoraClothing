"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";

type Mode = "default" | "view" | "plus" | "drag" | "hidden";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 30, stiffness: 350, mass: 0.4 });
  const sy = useSpring(y, { damping: 30, stiffness: 350, mass: 0.4 });

  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (coarse) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    const updateMode = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-cursor]");
      if (!el) {
        setMode("default");
        setLabel(null);
        return;
      }
      const m = (el.dataset.cursor as Mode) || "default";
      setMode(m);
      setLabel(el.dataset.cursorLabel || null);
    };

    const over = (e: MouseEvent) => updateMode(e.target);

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [x, y, visible, coarse]);

  if (coarse) return null;

  const size =
    mode === "view" ? 80 :
    mode === "plus" ? 64 :
    mode === "drag" ? 72 :
    12;

  return (
    <>
      <style>{`html, body, button, a, input, textarea, select { cursor: none !important; }`}</style>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{ x: sx, y: sy }}
      >
        <motion.div
          animate={{
            width: size,
            height: size,
            opacity: visible ? 1 : 0,
            backgroundColor: mode === "default" ? "#f5f0e6" : "transparent",
            borderColor: "#f5f0e6",
            borderWidth: mode === "default" ? 0 : 1,
          }}
          transition={{ type: "spring", damping: 24, stiffness: 320, mass: 0.6 }}
          style={{
            translateX: "-50%",
            translateY: "-50%",
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="wait">
            {(mode === "view" || mode === "plus" || mode === "drag") && (
              <motion.span
                key={mode + (label || "")}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="text-[10px] tracking-[0.3em] uppercase text-bone select-none"
                style={{ color: "#f5f0e6" }}
              >
                {label || (mode === "plus" ? "+" : mode === "drag" ? "Drag" : "View")}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
