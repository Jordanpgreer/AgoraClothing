"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/actions";

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="label-sm text-charcoal/65 mb-2 block">{children}</label>
  );
}

export function TextInput({
  name,
  defaultValue,
  type = "text",
  placeholder,
}: {
  name: string;
  defaultValue?: string | number;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full border border-charcoal/25 bg-white px-3 py-2 text-sm outline-none focus:border-ink"
    />
  );
}

export function TextArea({
  name,
  defaultValue,
  rows = 4,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      placeholder={placeholder}
      className="w-full border border-charcoal/25 bg-white px-3 py-2 text-sm outline-none focus:border-ink leading-relaxed font-sans"
    />
  );
}

export function ImagePicker({
  name,
  defaultValue,
  ratio = "aspect-[4/5]",
}: {
  name: string;
  defaultValue?: string;
  ratio?: string;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { url: uploaded } = await uploadImage(fd);
      setUrl(uploaded);
    } catch (e) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />
      <div className={`relative ${ratio} bg-limestone border border-charcoal/15 overflow-hidden`}>
        {url ? (
          <Image
            src={url}
            alt=""
            fill
            sizes="200px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center label-sm text-charcoal/45">
            No image
          </div>
        )}
      </div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Image URL or upload below"
        className="w-full border border-charcoal/25 bg-white px-3 py-2 text-xs outline-none focus:border-ink font-mono"
      />
      <label className="block">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <span className="inline-block label-sm text-ink border border-ink/40 px-3 py-2 cursor-pointer hover:bg-ink hover:text-bone transition">
          {uploading ? "Uploading…" : "Upload File"}
        </span>
      </label>
    </div>
  );
}

export function MultiImagePicker({
  name,
  defaultValue = [],
}: {
  name: string;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList) {
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const { url } = await uploadImage(fd);
        uploaded.push(url);
      }
      setUrls((prev) => [...prev, ...uploaded]);
    } catch {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function addUrl() {
    const u = prompt("Image URL");
    if (u) setUrls((prev) => [...prev, u]);
  }

  function remove(i: number) {
    setUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    setUrls((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {urls.map((u, i) => (
          <div key={i} className="space-y-1.5">
            <div className="relative aspect-[4/5] bg-limestone border border-charcoal/15 overflow-hidden">
              <Image src={u} alt="" fill sizes="200px" className="object-cover" unoptimized />
            </div>
            <div className="flex justify-between items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="label-sm text-charcoal/65 hover:text-ink"
              >
                ←
              </button>
              <span className="label-sm text-charcoal/55">#{i + 1}</span>
              <button
                type="button"
                onClick={() => move(i, 1)}
                className="label-sm text-charcoal/65 hover:text-ink"
              >
                →
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="label-sm text-charcoal/65 hover:text-ink ml-auto"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <span className="inline-block label-sm text-ink border border-ink/40 px-3 py-2 hover:bg-ink hover:text-bone transition">
            {uploading ? "Uploading…" : "Upload Files"}
          </span>
        </label>
        <button
          type="button"
          onClick={addUrl}
          className="label-sm text-ink border border-ink/40 px-3 py-2 hover:bg-ink hover:text-bone transition"
        >
          Paste URL
        </button>
      </div>
    </div>
  );
}

export function StringListInput({
  name,
  defaultValue = [],
  placeholder = "Comma-separated",
}: {
  name: string;
  defaultValue?: string[];
  placeholder?: string;
}) {
  return (
    <TextInput name={name} defaultValue={defaultValue.join(", ")} placeholder={placeholder} />
  );
}

export function SaveButton({ children = "Save Changes" }: { children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="bg-ink text-bone px-6 py-3 label hover:bg-charcoal transition-colors"
    >
      {children}
    </button>
  );
}
