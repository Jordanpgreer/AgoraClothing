import { login } from "@/lib/actions";
import { LogoPrimary } from "@/components/Logo";

export const metadata = { title: "Admin · Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const sp = (await searchParams) || {};
  const hasError = sp.error === "1";
  return (
    <div className="min-h-screen flex items-center justify-center bg-bone px-6">
      <form
        action={login}
        className="w-full max-w-sm space-y-6 border border-charcoal/15 p-10 bg-white"
      >
        <div className="text-center">
          <LogoPrimary size="sm" />
          <p className="label-sm text-charcoal/65 mt-6">Studio Admin</p>
        </div>
        <div>
          <label className="label-sm text-charcoal/65 mb-2 block">Password</label>
          <input
            name="password"
            type="password"
            required
            autoFocus
            className="w-full border border-charcoal/25 bg-bone px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </div>
        {hasError && (
          <p className="label-sm text-charcoal/80 text-center">Incorrect password.</p>
        )}
        <button
          type="submit"
          className="w-full bg-ink text-bone py-3 label hover:bg-charcoal transition-colors"
        >
          Enter
        </button>
        <p className="text-[11px] text-charcoal/55 text-center leading-relaxed">
          Default password: <code>agora-admin</code>
          <br />
          Override with <code>ADMIN_PASSWORD</code> env variable.
        </p>
      </form>
    </div>
  );
}
