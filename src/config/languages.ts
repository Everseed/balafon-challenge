export const snippetLanguages = [
  { label: 'French', value: 'French' },
  { label: 'Yemba', value: 'Yemba' },
  { label: 'FeFe', value: 'FeFe' }
] as const;

export type Language = (typeof snippetLanguages)[number]['value'];

export function isValidLanguage(lang: string): boolean {
  return snippetLanguages.some((l) => l.value === lang);
}
