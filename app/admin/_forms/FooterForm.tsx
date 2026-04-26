"use client";

import { useTransition } from "react";
import { updateFooter } from "@/lib/actions";
import type { SiteContent } from "@/lib/data";
import { AdminSection, FieldRow } from "@/components/admin/Section";
import { TextArea, SaveButton } from "@/components/admin/Field";
import { useSavedFlag } from "@/components/admin/useSavedFlag";

export default function FooterForm({ footer }: { footer: SiteContent["footer"] }) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useSavedFlag();

  function action(formData: FormData) {
    start(async () => {
      await updateFooter({
        tagline: String(formData.get("tagline") || ""),
      });
      setSaved();
    });
  }

  return (
    <AdminSection title="Footer" description="Studio tagline shown in the dark footer.">
      <form action={action}>
        <FieldRow label="Tagline">
          <TextArea name="tagline" defaultValue={footer.tagline} rows={3} />
        </FieldRow>
        <div className="mt-6 flex items-center gap-4">
          <SaveButton>{pending ? "Saving…" : "Save Footer"}</SaveButton>
          {saved && <span className="label-sm text-charcoal/60">Saved.</span>}
        </div>
      </form>
    </AdminSection>
  );
}
