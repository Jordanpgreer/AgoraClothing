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
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
                <Link href="/admin" className="wordmark text-sm text-ink">
                AGORA / ADMIN
                </Link>
                <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
                  <AdminLink href="/admin">Site</AdminLink>
                  <AdminLink href="/admin/drops">Drops</AdminLink>
                  <AdminLink href="/admin/products">Products</AdminLink>
                  <AdminLink href="/admin/finance">Finance</AdminLink>
                  <AdminLink href="/admin/todos">To-Do</AdminLink>
                  <AdminLink href="/">View Site →</AdminLink>
                </nav>
              </div>
              <form action={logout} className="lg:self-start">
                <button className="label-sm text-charcoal/65 hover:text-ink">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </header>
      )}
      <main>{children}</main>
    </div>
  );
}

function AdminLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="label-sm shrink-0 border border-charcoal/15 px-3 py-2 text-charcoal/75 transition-colors hover:border-charcoal/35 hover:text-ink lg:border-0 lg:px-0 lg:py-0"
    >
      {children}
    </Link>
  );
}
