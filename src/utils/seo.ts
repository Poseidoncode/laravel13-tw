// src/utils/seo.ts
export function cleanDescription(raw: string, maxLength = 160): string {
  if (!raw) return '';

  let s = raw
    .replace(/`/g, ' ')
    .replace(/\b\w*::\w+\b/g, ' ')
    .replace(/\b_+\w*\b/g, ' ')
    .replace(/\b\w+_[\w_]+\b/g, ' ')
    .replace(/[{}[\]()\\|`"<>#@$%^&*+=]/g, ' ')
    .replace(/\b[a-zA-Z]\b/g, ' ');

  s = s.replace(/\s+/g, ' ').trim();

  // Remove trailing incomplete Latin fragments and redundant ellipses
  s = s.replace(/[\sA-Za-z]+…$/, '…');
  s = s.replace(/([。，！？；：])\s*…$/, '…');

  if (s.length > maxLength) {
    s = s.slice(0, maxLength).trim();
    const lastSpace = s.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.5) {
      s = s.slice(0, lastSpace).trim();
    }
    if (!s.endsWith('…')) s += '…';
  }

  return s;
}
