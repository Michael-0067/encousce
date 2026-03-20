import Link from "next/link";
import { getSession } from "@/lib/session";
import { getSpendableBalance } from "@/lib/wallet";
import LogoutButton from "./LogoutButton";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const balance = session ? await getSpendableBalance(session.user.id) : null;

  return (
    <div className="min-h-screen bg-enc-bg flex flex-col">
      <header className="border-b border-enc-border bg-enc-surface sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link
            href="/browse"
            className="font-serif text-xl text-enc-cream hover:text-enc-rose transition-colors shrink-0"
          >
            Encousce
          </Link>

          <div className="flex items-center gap-5">
            {session ? (
              <>
                <Link href="/create/scene" className="text-enc-muted hover:text-enc-text text-sm transition-colors hidden sm:block">
                  + Scene
                </Link>
                <Link href="/create/character" className="text-enc-muted hover:text-enc-text text-sm transition-colors hidden sm:block">
                  + Character
                </Link>
                <Link href="/account/hearts" className="text-enc-rose text-sm font-medium tabular-nums hover:text-enc-rose/80 transition-colors">
                  ♥ {balance!.toLocaleString()}
                </Link>
                <Link href="/account" className="text-enc-muted hover:text-enc-text text-sm hidden sm:block transition-colors">
                  {session.user.username}
                </Link>
                {session.user.role === "ADMIN" && (
                  <span className="text-enc-dim text-xs border border-enc-dim px-2 py-0.5 rounded">
                    admin
                  </span>
                )}
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="text-enc-muted hover:text-enc-text text-sm transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-enc-plum hover:bg-enc-plum-light text-enc-cream text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
