import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-enc-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-serif text-2xl text-enc-cream hover:text-enc-rose transition-colors"
          >
            Encousce
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
