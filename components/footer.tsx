import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background" role="contentinfo" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Product */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Product</h3>
            <nav aria-label="Product links">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">
                    Chat Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/quran" className="hover:text-foreground transition-colors">
                    Browse Quran
                  </Link>
                </li>
                <li>
                  <Link href="/hadith" className="hover:text-foreground transition-colors">
                    Browse Hadith
                  </Link>
                </li>
                <li>
                  <Link href="/topics" className="hover:text-foreground transition-colors">
                    Islamic Topics
                  </Link>
                </li>
                <li>
                  <Link href="/quran/search" className="hover:text-foreground transition-colors">
                    Search Quran
                  </Link>
                </li>
                <li>
                  <Link href="/hadith/search" className="hover:text-foreground transition-colors">
                    Search Hadith
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Resources</h3>
            <nav aria-label="Resource links">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Developers */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Developers</h3>
            <nav aria-label="Developer links">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/developers" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/BalajSaleem/criterion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                    aria-label="View source code on GitHub (opens in new tab)"
                  >
                    GitHub ↗
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <nav aria-label="Legal links">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/BalajSaleem/criterion/blob/main/LICENSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                    aria-label="View project license on GitHub (opens in new tab)"
                  >
                    License
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Criterion. Open source AI assistant for Islamic learning.
          </p>
        </div>
      </div>
    </footer>
  );
}
