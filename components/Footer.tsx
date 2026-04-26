import Link from "next/link";
import { loadContent } from "@/lib/data";

export default async function Footer() {
  const { footer } = await loadContent();
  return (
    <footer className="bg-charcoal text-bone">
      <div className="px-8 md:px-12 py-20 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <p className="wordmark text-xl text-bone mb-6">AGORA</p>
          <p className="text-[14px] text-bone/65 leading-[1.7] max-w-sm">
            {footer.tagline}
          </p>
        </div>
        <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
          <FCol title="Shop">
            <FLink href="/drops">Current Drop</FLink>
            <FLink href="/drops">Archive</FLink>
            <FLink href="/shop">All Pieces</FLink>
          </FCol>
          <FCol title="Studio">
            <FLink href="/about">About</FLink>
            <FLink href="/care">Garment Care</FLink>
            <FLink href="/contact">Contact</FLink>
          </FCol>
          <FCol title="Service">
            <FLink href="/shipping">Shipping</FLink>
            <FLink href="/returns">Returns</FLink>
            <FLink href="/faq">FAQ</FLink>
          </FCol>
        </div>
      </div>
      <div className="border-t border-bone/10 px-8 md:px-12 py-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <p className="label-sm text-bone/45">
          © {new Date().getFullYear()} Agora — Porto
        </p>
        <p className="label-sm text-bone/45">
          Privacy · Terms · Accessibility
        </p>
      </div>
    </footer>
  );
}

function FCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label-sm text-bone/55 mb-5">{title}</p>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[13px] text-bone/85 hover:text-bone transition"
      >
        {children}
      </Link>
    </li>
  );
}
