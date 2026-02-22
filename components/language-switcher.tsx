"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { setLocale } from "@/app/actions/locale";
import type { Locale } from "@/i18n/request";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const languages: { locale: Locale; nativeLabel: string; label: string }[] = [
  { locale: "en", nativeLabel: "English", label: "English" },
  { locale: "ar", nativeLabel: "العربية", label: "Arabic" },
  { locale: "ur", nativeLabel: "اردو", label: "Urdu" },
  { locale: "tr", nativeLabel: "Türkçe", label: "Turkish" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: Locale) => {
    startTransition(async () => {
      await setLocale(newLocale);
      router.refresh();
    });
  };

  const currentLang = languages.find((l) => l.locale === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Change language"
          className="gap-1.5 px-2 text-muted-foreground hover:text-foreground"
          disabled={isPending}
          size="sm"
          variant="ghost"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">{currentLang?.nativeLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(({ locale: l, nativeLabel, label }) => (
          <DropdownMenuItem
            className={cn("cursor-pointer gap-2", locale === l && "font-semibold")}
            key={l}
            onClick={() => handleLocaleChange(l)}
          >
            <span>{nativeLabel}</span>
            <span className="text-muted-foreground text-xs">{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
