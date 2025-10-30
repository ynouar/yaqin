import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2025 Criterion. Open source Islamic knowledge assistant.</p>
            <div className="flex gap-4">
              <Link href="/developers" className="hover:underline">
                Developers
              </Link>
              <a
                href="https://github.com/BalajSaleem/criterion"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
