const POLISH_MAP: Record<string, string> = {
  ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n',
  ó: 'o', ś: 's', ź: 'z', ż: 'z',
};

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (c) => POLISH_MAP[c] ?? c)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
