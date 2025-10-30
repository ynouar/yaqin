import Link from 'next/link';

interface NarrationHeaderProps {
  collection: string;
  collectionArabic?: string;
  hadithNumber: number;
  reference: string;
  compiler?: string;
  links?: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
  }>;
}

export function NarrationHeader({
  collection,
  collectionArabic,
  hadithNumber,
  reference,
  compiler,
  links = [],
}: NarrationHeaderProps) {
  return (
    <div className="mb-8 border-b pb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {collection} #{hadithNumber}
          </h1>
          <h2 className="text-muted-foreground mb-2">
            {reference}
          </h2>
          {compiler && (
            <p className="text-sm text-muted-foreground">
              Compiled by {compiler}
            </p>
          )}
        </div>

        {collectionArabic && (
          <div className="font-arabic text-3xl text-muted-foreground">
            {collectionArabic}
          </div>
        )}
      </div>

      {/* Links */}
      {links.length > 0 && (
        <div className="flex gap-4">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
