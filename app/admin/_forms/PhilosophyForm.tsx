"use client";

import { useState, useTransition } from "react";
import { updatePhilosophy } from "@/lib/actions";
import type { SiteContent } from "@/lib/data";
import { AdminSection, FieldRow } from "@/components/admin/Section";
import { TextInput, TextArea, SaveButton } from "@/components/admin/Field";
import { useSavedFlag } from "@/components/admin/useSavedFlag";

export default function PhilosophyForm({
  philosophy,
}: {
  philosophy: SiteContent["philosophy"];
}) {
  const [tenets, setTenets] = useState(philosophy.tenets);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useSavedFlag();

  function action(formData: FormData) {
    start(async () => {
      await updatePhilosophy({
        eyebrow: String(formData.get("eyebrow") || ""),
        heading: String(formData.get("heading") || ""),
        tenets: tenets.map((_, i) => ({
          n: String(formData.get(`tenet_${i}_n`) || ""),
          title: String(formData.get(`tenet_${i}_title`) || ""),
          body: String(formData.get(`tenet_${i}_body`) || ""),
        })),
      });
      setSaved();
    });
  }

  return (
    <AdminSection title="Philosophy" description="The 'A space, not a store.' section.">
      <form action={action} className="space-y-5">
        <div className="grid md:grid-cols-3 gap-5">
          <FieldRow label="Eyebrow">
            <TextInput name="eyebrow" defaultValue={philosophy.eyebrow} />
          </FieldRow>
          <div className="md:col-span-2">
            <FieldRow label="Heading">
              <TextInput name="heading" defaultValue={philosophy.heading} />
            </FieldRow>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {tenets.map((t, i) => (
            <div key={i} className="border border-charcoal/15 p-4 space-y-3">
              <FieldRow label="Numeral (e.g. I)">
                <TextInput name={`tenet_${i}_n`} defaultValue={t.n} />
              </FieldRow>
              <FieldRow label="Title">
                <TextInput name={`tenet_${i}_title`} defaultValue={t.title} />
              </FieldRow>
              <FieldRow label="Body">
                <TextArea name={`tenet_${i}_body`} defaultValue={t.body} rows={4} />
              </FieldRow>
              {tenets.length > 1 && (
                <button
                  type="button"
                  onClick={() => setTenets((p) => p.filter((_, j) => j !== i))}
                  className="label-sm text-charcoal/60 hover:text-ink"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setTenets((p) => [...p, { n: "", title: "", body: "" }])}
          className="label-sm text-ink border border-ink/40 px-3 py-2 hover:bg-ink hover:text-bone transition"
        >
          + Add Tenet
        </button>

        <div className="flex items-center gap-4 pt-2">
          <SaveButton>{pending ? "Saving…" : "Save Philosophy"}</SaveButton>
          {saved && <span className="label-sm text-charcoal/60">Saved.</span>}
        </div>
      </form>
    </AdminSection>
  );
}
