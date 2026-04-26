"use client";

import { useTransition } from "react";
import { updateNewsletter } from "@/lib/actions";
import type { SiteContent } from "@/lib/data";
import { AdminSection, FormGrid, FieldRow } from "@/components/admin/Section";
import { TextInput, TextArea, ImagePicker, SaveButton } from "@/components/admin/Field";
import { useSavedFlag } from "@/components/admin/useSavedFlag";

export default function NewsletterForm({
  newsletter,
}: {
  newsletter: SiteContent["newsletter"];
}) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useSavedFlag();

  function action(formData: FormData) {
    start(async () => {
      await updateNewsletter({
        eyebrow: String(formData.get("eyebrow") || ""),
        heading: String(formData.get("heading") || ""),
        body: String(formData.get("body") || ""),
        background: String(formData.get("background") || ""),
      });
      setSaved();
    });
  }

  return (
    <AdminSection title="Newsletter" description="Footer signup section.">
      <form action={action}>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <FieldRow label="Background image">
              <ImagePicker name="background" defaultValue={newsletter.background} ratio="aspect-[3/4]" />
            </FieldRow>
          </div>
          <div className="md:col-span-2 space-y-5">
            <FormGrid>
              <FieldRow label="Eyebrow">
                <TextInput name="eyebrow" defaultValue={newsletter.eyebrow} />
              </FieldRow>
              <FieldRow label="Heading">
                <TextInput name="heading" defaultValue={newsletter.heading} />
              </FieldRow>
              <FieldRow label="Body" span={2}>
                <TextArea name="body" defaultValue={newsletter.body} rows={3} />
              </FieldRow>
            </FormGrid>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <SaveButton>{pending ? "Saving…" : "Save Newsletter"}</SaveButton>
          {saved && <span className="label-sm text-charcoal/60">Saved.</span>}
        </div>
      </form>
    </AdminSection>
  );
}
