"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateDrop, deleteDrop } from "@/lib/actions";
import type { Drop } from "@/lib/data";
import { AdminSection, FormGrid, FieldRow } from "@/components/admin/Section";
import { TextInput, TextArea, ImagePicker, SaveButton } from "@/components/admin/Field";
import { useSavedFlag } from "@/components/admin/useSavedFlag";

export default function EditDropForm({ drop }: { drop: Drop }) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useSavedFlag();
  const router = useRouter();

  function action(formData: FormData) {
    start(async () => {
      await updateDrop(drop.slug, {
        slug: drop.slug,
        number: String(formData.get("number") || ""),
        numeric: String(formData.get("numeric") || ""),
        title: String(formData.get("title") || ""),
        subtitle: String(formData.get("subtitle") || ""),
        season: String(formData.get("season") || ""),
        releaseDate: String(formData.get("releaseDate") || ""),
        status: String(formData.get("status") || "upcoming") as Drop["status"],
        palette: String(formData.get("palette") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        cover: String(formData.get("cover") || ""),
        story: String(formData.get("story") || ""),
      });
      setSaved();
    });
  }

  async function handleDelete() {
    if (!confirm(`Delete Drop ${drop.numeric}: ${drop.title}? This cannot be undone.`)) return;
    await deleteDrop(drop.slug);
    router.push("/admin/drops");
  }

  return (
    <AdminSection title="Drop Details">
      <form action={action}>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <FieldRow label="Cover image">
              <ImagePicker name="cover" defaultValue={drop.cover} ratio="aspect-[3/4]" />
            </FieldRow>
          </div>
          <div className="md:col-span-2 space-y-5">
            <FormGrid>
              <FieldRow label="Status">
                <select
                  name="status"
                  defaultValue={drop.status}
                  className="w-full border border-charcoal/25 bg-white px-3 py-2 text-sm outline-none focus:border-ink"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="archived">Archived</option>
                </select>
              </FieldRow>
              <FieldRow label="Release date (ISO)">
                <TextInput name="releaseDate" defaultValue={drop.releaseDate} />
              </FieldRow>
              <FieldRow label="Numeral (I, II…)">
                <TextInput name="number" defaultValue={drop.number} />
              </FieldRow>
              <FieldRow label="Numeric (01, 02…)">
                <TextInput name="numeric" defaultValue={drop.numeric} />
              </FieldRow>
              <FieldRow label="Title">
                <TextInput name="title" defaultValue={drop.title} />
              </FieldRow>
              <FieldRow label="Season">
                <TextInput name="season" defaultValue={drop.season} />
              </FieldRow>
              <FieldRow label="Subtitle" span={2}>
                <TextInput name="subtitle" defaultValue={drop.subtitle} />
              </FieldRow>
              <FieldRow label="Palette (comma-separated hex)" span={2}>
                <TextInput name="palette" defaultValue={drop.palette.join(", ")} />
              </FieldRow>
              <FieldRow label="Story" span={2}>
                <TextArea name="story" defaultValue={drop.story} rows={4} />
              </FieldRow>
            </FormGrid>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <SaveButton>{pending ? "Saving…" : "Save Drop"}</SaveButton>
            {saved && <span className="label-sm text-charcoal/60">Saved.</span>}
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="label-sm text-charcoal/65 hover:text-ink"
          >
            Delete Drop
          </button>
        </div>
      </form>
    </AdminSection>
  );
}
