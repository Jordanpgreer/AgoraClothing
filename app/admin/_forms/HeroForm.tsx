"use client";

import { useTransition } from "react";
import { updateHero } from "@/lib/actions";
import type { SiteContent } from "@/lib/data";
import { AdminSection, FormGrid, FieldRow } from "@/components/admin/Section";
import { TextInput, ImagePicker, SaveButton } from "@/components/admin/Field";
import { useSavedFlag } from "@/components/admin/useSavedFlag";

export default function HeroForm({ hero }: { hero: SiteContent["hero"] }) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useSavedFlag();

  function action(formData: FormData) {
    start(async () => {
      await updateHero({
        subtitle: String(formData.get("subtitle") || ""),
        ctaLabel: String(formData.get("ctaLabel") || ""),
        ctaHref: String(formData.get("ctaHref") || ""),
        leftMeta: String(formData.get("leftMeta") || ""),
        rightMeta: String(formData.get("rightMeta") || ""),
        coverImage: String(formData.get("coverImage") || ""),
      });
      setSaved();
    });
  }

  return (
    <AdminSection title="Hero" description="The first screen of the homepage.">
      <form action={action}>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <FieldRow label="Cover image">
              <ImagePicker name="coverImage" defaultValue={hero.coverImage} ratio="aspect-[3/4]" />
            </FieldRow>
          </div>
          <div className="md:col-span-2 space-y-5">
            <FormGrid>
              <FieldRow label="Subtitle (under the wordmark)" span={2}>
                <TextInput name="subtitle" defaultValue={hero.subtitle} />
              </FieldRow>
              <FieldRow label="CTA label">
                <TextInput name="ctaLabel" defaultValue={hero.ctaLabel} />
              </FieldRow>
              <FieldRow label="CTA href">
                <TextInput name="ctaHref" defaultValue={hero.ctaHref} />
              </FieldRow>
              <FieldRow label="Bottom-left meta">
                <TextInput name="leftMeta" defaultValue={hero.leftMeta} />
              </FieldRow>
              <FieldRow label="Bottom-right meta">
                <TextInput name="rightMeta" defaultValue={hero.rightMeta} />
              </FieldRow>
            </FormGrid>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <SaveButton>{pending ? "Saving…" : "Save Hero"}</SaveButton>
          {saved && <span className="label-sm text-charcoal/60">Saved.</span>}
        </div>
      </form>
    </AdminSection>
  );
}
