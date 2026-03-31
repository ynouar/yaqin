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

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 Yaqin — Sadaqah Jariyah. Assistant islamique open source.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:underline">
                Confidentialité
              </Link>
              <Link href="/developers" className="hover:underline">
                Développeurs
              </Link>
              <a
                href="https://github.com/ynouar/yaqin"
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
