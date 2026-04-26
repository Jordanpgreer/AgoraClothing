"use client";

import { useEffect, useState } from "react";

export function useSavedFlag(): [boolean, () => void] {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2200);
      return () => clearTimeout(t);
    }
  }, [saved]);
  return [saved, () => setSaved(true)];
}
