import Link from "next/link";
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
      <div className="mb-6 border border-charcoal/15 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="label-sm text-charcoal/55">Launch Checklist</p>
            <h2 className="wordmark mt-2 text-base text-ink">Track production work in the admin to-do board.</h2>
          </div>
          <Link
            href="/admin/todos"
            className="label inline-flex items-center justify-center border border-ink/35 px-4 py-3 text-ink transition hover:bg-ink hover:text-bone"
          >
            Open To-Do Board
          </Link>
        </div>
      </div>
      <div className="mb-6 border border-charcoal/15 bg-[linear-gradient(135deg,#0f172a,#020617)] p-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="label-sm text-white/55">Finance Dashboard</p>
            <h2 className="wordmark mt-2 text-base text-white">Model margins, shipping subsidies, and break-even before each drop goes live.</h2>
          </div>
          <Link
            href="/admin/finance"
            className="label inline-flex items-center justify-center border border-white/25 px-4 py-3 text-white transition hover:bg-white hover:text-[#020617]"
          >
            Open Finance
          </Link>
        </div>
      </div>
      <HeroForm hero={content.hero} />
      <PhilosophyForm philosophy={content.philosophy} />
      <NewsletterForm newsletter={content.newsletter} />
      <AboutForm about={content.about} />
      <FooterForm footer={content.footer} />
    </div>
  );
}
