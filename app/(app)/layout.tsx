import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getUserBalance } from "@/lib/wallet";
import LogoutButton from "./LogoutButton";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const balance = await getUserBalance(session.user.id);

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
            <span className="text-enc-rose text-sm font-medium tabular-nums">
              ♥ {balance.toLocaleString()}
            </span>
            <span className="text-enc-muted text-sm hidden sm:block">
              {session.user.username}
            </span>
            {session.user.role === "ADMIN" && (
              <span className="text-enc-dim text-xs border border-enc-dim px-2 py-0.5 rounded">
                admin
              </span>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
