import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/browse");
  }

  return (
    <div className="min-h-screen bg-enc-bg">
      <header className="border-b border-enc-border bg-enc-surface sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-6">
          <Link href="/admin" className="text-enc-rose text-sm font-medium tracking-wide uppercase">
            Admin
          </Link>
          <Link href="/admin/scenes" className="text-enc-muted hover:text-enc-cream text-sm transition-colors">
            Scenes
          </Link>
          <Link href="/admin/characters" className="text-enc-muted hover:text-enc-cream text-sm transition-colors">
            Characters
          </Link>
          <Link href="/admin/users" className="text-enc-muted hover:text-enc-cream text-sm transition-colors">
            Users
          </Link>
          <div className="ml-auto">
            <Link href="/browse" className="text-enc-dim hover:text-enc-muted text-xs transition-colors">
              ← Back to site
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
