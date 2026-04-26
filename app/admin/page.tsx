import { loadContent } from "@/lib/data";
import HeroForm from "./_forms/HeroForm";
import PhilosophyForm from "./_forms/PhilosophyForm";
import NewsletterForm from "./_forms/NewsletterForm";
import AboutForm from "./_forms/AboutForm";
import FooterForm from "./_forms/FooterForm";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const content = await loadContent();
  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="label-sm text-charcoal/65 mb-2">Site Content</p>
        <h1 className="wordmark text-2xl text-ink font-light">Edit your homepage and standing pages.</h1>
      </div>
      <HeroForm hero={content.hero} />
      <PhilosophyForm philosophy={content.philosophy} />
      <NewsletterForm newsletter={content.newsletter} />
      <AboutForm about={content.about} />
      <FooterForm footer={content.footer} />
    </div>
  );
}
