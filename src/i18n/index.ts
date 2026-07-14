import { zh } from './zh';
import { en } from './en';
import type { UiStrings } from './zh';

const strings: Record<string, UiStrings> = { zh, en };

export function useTranslations(locale: string): UiStrings {
  return strings[locale] || strings.zh;
}

export function getLocaleFromPath(pathname: string): string {
  if (pathname.startsWith('/zh')) return 'zh';
  return 'en';
}
