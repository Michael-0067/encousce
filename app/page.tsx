import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-enc-bg flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-lg space-y-6">
        <h1 className="font-serif text-5xl text-enc-cream tracking-tight leading-tight">
          Encousce
        </h1>
        <p className="text-enc-muted text-lg">
          Step into a scene. Start an encounter.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/browse"
            className="bg-enc-plum hover:bg-enc-plum-light text-enc-cream font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-center"
          >
            Enter
          </Link>
          <Link
            href="/login"
            className="border border-enc-border hover:border-enc-plum text-enc-cream-muted hover:text-enc-cream font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-center"
          >
            Sign In
          </Link>
        </div>
      </div>
      <p className="absolute bottom-8 text-enc-dim text-xs">
        A place where moments begin.
      </p>
    </main>
  );
}
