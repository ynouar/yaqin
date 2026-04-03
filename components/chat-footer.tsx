export function ChatFooter() {
  return (
    <footer className="border-t bg-background py-2" role="contentinfo" aria-label="Chat page footer">
      <nav className="mx-auto flex max-w-4xl items-center justify-center gap-1 px-4 text-xs text-muted-foreground" aria-label="Footer navigation">
        <a href="/quran" className="hover:text-foreground transition-colors">
          Quran
        </a>
        <span aria-hidden="true">·</span>
        <a href="/hadith" className="hover:text-foreground transition-colors">
          Hadith
        </a>
        <span aria-hidden="true">·</span>
        <a href="/topics" className="hover:text-foreground transition-colors">
          Topics
        </a>
        <div className="sr-only">
          <a href="/quran/search" className="hover:text-foreground transition-colors">
            Search Quran
          </a>
          <a href="/hadith/search" className="hover:text-foreground transition-colors">
            Search Hadith
          </a>
        </div>
        <span aria-hidden="true">·</span>
        <a href="/about" className="hover:text-foreground transition-colors">
          About
        </a>
        <span aria-hidden="true">·</span>
        <a href="/faq" className="hover:text-foreground transition-colors">
          FAQ
        </a>
        <span aria-hidden="true">·</span>
        <a href="/privacy" className="hover:text-foreground transition-colors">
          Privacy
        </a>
        <span aria-hidden="true">·</span>
        <a
          href="https://github.com/ynouar/yaqin"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
          aria-label="View source code on GitHub (opens in new tab)"
        >
          GitHub
        </a>
      </nav>
    </footer>
  );
}
