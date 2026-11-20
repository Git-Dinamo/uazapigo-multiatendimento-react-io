import type { ReactNode } from 'react';

const pad = (n: number) => String(n).padStart(2, '0');

export function timeOf(ms: number) {
  if (!ms) return '';
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Chat list stamp: hour today, "Ontem", weekday this week, else dd/mm/yyyy. */
export function listStamp(ms: number) {
  if (!ms) return '';
  const d = new Date(ms);
  const now = new Date();
  if (sameDay(d, now)) return timeOf(ms);
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (sameDay(d, y)) return 'Ontem';
  const diff = (now.getTime() - ms) / 86400000;
  if (diff < 7) return d.toLocaleDateString('pt-BR', { weekday: 'long' });
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function dayLabel(ms: number) {
  const d = new Date(ms);
  const now = new Date();
  if (sameDay(d, now)) return 'Hoje';
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (sameDay(d, y)) return 'Ontem';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function duration(sec: number) {
  if (!sec) return '';
  return `${Math.floor(sec / 60)}:${pad(Math.floor(sec % 60))}`;
}

export function formatPhone(n: string) {
  const d = n.replace(/\D/g, '');
  if (d.length === 13 && d.startsWith('55')) return `+55 ${d.slice(2, 4)} ${d.slice(4, 9)}-${d.slice(9)}`;
  if (d.length === 12 && d.startsWith('55')) return `+55 ${d.slice(2, 4)} ${d.slice(4, 8)}-${d.slice(8)}`;
  return d ? `+${d}` : n;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

/** WhatsApp text formatting: *bold* _italic_ ~strike~ ```mono``` and links. */
export function richText(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(```[\s\S]+?```|\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~|https?:\/\/[^\s]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith('```')) out.push(<code key={k++}>{t.slice(3, -3)}</code>);
    else if (t.startsWith('*')) out.push(<strong key={k++}>{t.slice(1, -1)}</strong>);
    else if (t.startsWith('_')) out.push(<em key={k++}>{t.slice(1, -1)}</em>);
    else if (t.startsWith('~')) out.push(<s key={k++}>{t.slice(1, -1)}</s>);
    else
      out.push(
        <a key={k++} href={t} target="_blank" rel="noreferrer">
          {t}
        </a>,
      );
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export function mediaTypeFor(mime: string) {
  if (mime.startsWith('image/')) return mime === 'image/webp' ? 'sticker' : 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  return 'document';
}
