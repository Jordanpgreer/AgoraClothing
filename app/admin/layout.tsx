import Link from "next/link";
import { logout } from "@/lib/actions";
import { isAuthed } from "@/lib/auth";

export const metadata = { title: "Admin · Agora" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthed();

  return (
    <div className="min-h-screen bg-bone">
      {authed && (
        <header className="border-b border-charcoal/15 bg-white">
          <div className="px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="wordmark text-sm text-ink">
                AGORA / ADMIN
              </Link>
              <nav className="flex items-center gap-6">
                <AdminLink href="/admin">Site</AdminLink>
                <AdminLink href="/admin/drops">Drops</AdminLink>
                <AdminLink href="/admin/products">Products</AdminLink>
                <AdminLink href="/">View Site ↗</AdminLink>
              </nav>
            </div>
            <form action={logout}>
              <button className="label-sm text-charcoal/65 hover:text-ink">
                Sign Out
              </button>
            </form>
          </div>
        </header>
      )}
      <main>{children}</main>
    </div>
  );
}

function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="label-sm text-charcoal/75 hover:text-ink transition-opacity"
    >
      {children}
    </Link>
  );
}
