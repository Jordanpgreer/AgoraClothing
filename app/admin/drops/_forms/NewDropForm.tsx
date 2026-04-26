"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createDrop } from "@/lib/actions";
import { AdminSection, FormGrid, FieldRow } from "@/components/admin/Section";
import { TextInput, TextArea, ImagePicker, SaveButton } from "@/components/admin/Field";

export default function NewDropForm() {
  const [pending, start] = useTransition();
  const router = useRouter();

  function action(formData: FormData) {
    start(async () => {
      const slug = String(formData.get("slug") || "").trim();
      if (!slug) return alert("Slug required");
      try {
        await createDrop({
          slug,
          number: String(formData.get("number") || ""),
          numeric: String(formData.get("numeric") || ""),
          title: String(formData.get("title") || ""),
          subtitle: String(formData.get("subtitle") || ""),
          season: String(formData.get("season") || ""),
          releaseDate: String(formData.get("releaseDate") || new Date().toISOString()),
          status: (String(formData.get("status") || "upcoming") as "upcoming" | "live" | "archived"),
          palette: String(formData.get("palette") || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          cover: String(formData.get("cover") || ""),
          story: String(formData.get("story") || ""),
        });
        router.push(`/admin/drops/${slug}`);
      } catch (e) {
        alert((e as Error).message);
      }
    });
  }

  return (
    <AdminSection title="Drop Details">
      <form action={action}>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <FieldRow label="Cover image">
              <ImagePicker name="cover" ratio="aspect-[3/4]" />
            </FieldRow>
          </div>
          <div className="md:col-span-2 space-y-5">
            <FormGrid>
              <FieldRow label="Slug (URL, no spaces)">
                <TextInput name="slug" placeholder="drop-03-quiet-hours" />
              </FieldRow>
              <FieldRow label="Status">
                <select
                  name="status"
                  defaultValue="upcoming"
                  className="w-full border border-charcoal/25 bg-white px-3 py-2 text-sm outline-none focus:border-ink"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="archived">Archived</option>
                </select>
              </FieldRow>
              <FieldRow label="Numeral (I, II, III…)">
                <TextInput name="number" placeholder="III" />
              </FieldRow>
              <FieldRow label="Numeric (01, 02…)">
                <TextInput name="numeric" placeholder="03" />
              </FieldRow>
              <FieldRow label="Title">
                <TextInput name="title" placeholder="Quiet Hours" />
              </FieldRow>
              <FieldRow label="Season">
                <TextInput name="season" placeholder="Autumn 2026" />
              </FieldRow>
              <FieldRow label="Subtitle" span={2}>
                <TextInput name="subtitle" placeholder="An ode to the moments before the day begins." />
              </FieldRow>
              <FieldRow label="Release date (ISO)">
                <TextInput name="releaseDate" placeholder="2026-09-12T17:00:00Z" />
              </FieldRow>
              <FieldRow label="Palette (comma-separated hex)">
                <TextInput name="palette" placeholder="#f5f0e6, #c4b8a1, #2a2722" />
              </FieldRow>
              <FieldRow label="Story" span={2}>
                <TextArea name="story" rows={4} />
              </FieldRow>
            </FormGrid>
          </div>
        </div>
        <div className="mt-6">
          <SaveButton>{pending ? "Creating…" : "Create Drop"}</SaveButton>
        </div>
      </form>
    </AdminSection>
  );
}
