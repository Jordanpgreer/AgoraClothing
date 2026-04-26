"use client";

import { useEffect, useRef, useState } from "react";

// Pure UI toggle. To enable actual room-tone, drop an mp3 at /public/sound/room-tone.mp3
// and uncomment the audio block below.
export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("agora-sound") === "1";
    if (stored) setOn(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("agora-sound", on ? "1" : "0");
    const a = audioRef.current;
    if (!a) return;
    if (on) {
      a.volume = 0.18;
      a.loop = true;
      a.play().catch(() => {/* autoplay blocked until user gesture */});
    } else {
      a.pause();
    }
  }, [on]);

  return (
    <>
      <button
        onClick={() => setOn((v) => !v)}
        aria-label="Toggle ambient sound"
        className="label hover:opacity-60 transition-opacity flex items-center gap-2"
      >
        <span className="hidden md:inline">Sound</span>
        <span className="inline-flex items-end gap-[2px] h-3">
          <span className={`w-px transition-all duration-500 ${on ? "h-3 bg-ink" : "h-1 bg-ink/40"}`} />
          <span className={`w-px transition-all duration-500 delay-75 ${on ? "h-2 bg-ink" : "h-1 bg-ink/40"}`} />
          <span className={`w-px transition-all duration-500 delay-150 ${on ? "h-3 bg-ink" : "h-1 bg-ink/40"}`} />
        </span>
      </button>
      <audio ref={audioRef} src="/sound/room-tone.mp3" preload="none" />
    </>
  );
}
