import { ScrollTextIcon } from 'lucide-react';

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
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
          <ScrollTextIcon className="h-6 w-6" />
          <h1 className="text-3xl font-bold">
            {collection} #{hadithNumber}
          </h1>
        </div>
      </div>

      {collectionArabic && (
        <p className="text-xl text-muted-foreground mb-2 font-arabic" dir="rtl">
          {collectionArabic}
        </p>
      )}

      <p className="text-sm text-muted-foreground mb-4">
        {reference}
        {compiler && ` • Compiled by ${compiler}`}
      </p>

      {links.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 hover:underline"
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
