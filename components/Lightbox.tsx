"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";

export default function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: string[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (index === null) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex(Math.min(images.length - 1, index + 1));
      if (e.key === "ArrowLeft") onIndex(Math.max(0, index - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onIndex]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="fixed inset-0 z-[150] bg-ink/95 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-6 right-6 label text-bone hover:opacity-60"
            data-cursor="default"
          >
            Close ✕
          </button>

          <div
            className="relative w-[88vw] h-[82vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={images[index]}
                  alt=""
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {index > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); onIndex(index - 1); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 label text-bone hover:opacity-60"
              data-cursor="default"
            >
              ← Prev
            </button>
          )}
          {index < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); onIndex(index + 1); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 label text-bone hover:opacity-60"
              data-cursor="default"
            >
              Next →
            </button>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 label-sm text-bone/70">
            {index + 1} / {images.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
