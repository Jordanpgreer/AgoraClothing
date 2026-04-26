"use client";

import { useTransition } from "react";
import { updateAbout } from "@/lib/actions";
import type { SiteContent } from "@/lib/data";
import { AdminSection, FormGrid, FieldRow } from "@/components/admin/Section";
import { TextInput, TextArea, ImagePicker, SaveButton } from "@/components/admin/Field";
import { useSavedFlag } from "@/components/admin/useSavedFlag";

export default function AboutForm({ about }: { about: SiteContent["about"] }) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useSavedFlag();

  function action(formData: FormData) {
    start(async () => {
      await updateAbout({
        eyebrow: String(formData.get("eyebrow") || ""),
        heading: String(formData.get("heading") || ""),
        intro: String(formData.get("intro") || ""),
        image: String(formData.get("image") || ""),
        practiceLabel: String(formData.get("practiceLabel") || ""),
        practiceBody: String(formData.get("practiceBody") || ""),
        spaceLabel: String(formData.get("spaceLabel") || ""),
        spaceBody: String(formData.get("spaceBody") || ""),
      });
      setSaved();
    });
  }

  return (
    <AdminSection title="About Page" description="The /about page.">
      <form action={action}>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <FieldRow label="Studio image">
              <ImagePicker name="image" defaultValue={about.image} ratio="aspect-[3/4]" />
            </FieldRow>
          </div>
          <div className="md:col-span-2 space-y-5">
            <FormGrid>
              <FieldRow label="Eyebrow">
                <TextInput name="eyebrow" defaultValue={about.eyebrow} />
              </FieldRow>
              <FieldRow label="Heading">
                <TextInput name="heading" defaultValue={about.heading} />
              </FieldRow>
              <FieldRow label="Intro" span={2}>
                <TextArea name="intro" defaultValue={about.intro} rows={5} />
              </FieldRow>
              <FieldRow label="Practice column label">
                <TextInput name="practiceLabel" defaultValue={about.practiceLabel} />
              </FieldRow>
              <FieldRow label="Space column label">
                <TextInput name="spaceLabel" defaultValue={about.spaceLabel} />
              </FieldRow>
              <FieldRow label="Practice body" span={2}>
                <TextArea name="practiceBody" defaultValue={about.practiceBody} rows={4} />
              </FieldRow>
              <FieldRow label="Space body" span={2}>
                <TextArea name="spaceBody" defaultValue={about.spaceBody} rows={4} />
              </FieldRow>
            </FormGrid>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <SaveButton>{pending ? "Saving…" : "Save About"}</SaveButton>
          {saved && <span className="label-sm text-charcoal/60">Saved.</span>}
        </div>
      </form>
    </AdminSection>
  );
}
