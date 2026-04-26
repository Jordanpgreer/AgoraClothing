import Image from "next/image";
import { loadContent } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "About · Agora" };

export default async function About() {
  const { about } = await loadContent();
  return (
    <article className="pb-32 bg-bone">
      <section className="px-6 md:px-10 pt-32 pb-20 max-w-4xl mx-auto text-center">
        <p className="label text-charcoal/65 mb-8">{about.eyebrow}</p>
        <h1 className="wordmark text-3xl md:text-5xl text-ink font-light leading-[1.2] mb-10 max-w-3xl mx-auto">
          {about.heading}
        </h1>
        <p className="text-[15px] text-charcoal/80 leading-[1.8] max-w-2xl mx-auto whitespace-pre-line">
          {about.intro}
        </p>
      </section>

      <section className="relative aspect-[16/9] md:aspect-[16/7] mx-6 md:mx-10">
        <Image
          src={about.image}
          alt="The studio"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </section>

      <section className="px-6 md:px-10 py-24 max-w-5xl mx-auto grid md:grid-cols-2 gap-14">
        <div>
          <p className="label text-charcoal/65 mb-5">{about.practiceLabel}</p>
          <p className="text-[18px] leading-[1.7] text-ink/85 whitespace-pre-line">
            {about.practiceBody}
          </p>
        </div>
        <div>
          <p className="label text-charcoal/65 mb-5">{about.spaceLabel}</p>
          <p className="text-[14px] text-charcoal/80 leading-[1.8] whitespace-pre-line">
            {about.spaceBody}
          </p>
        </div>
      </section>
    </article>
  );
}
