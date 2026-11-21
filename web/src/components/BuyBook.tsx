import { useEffect, useRef, useState } from 'react';
import type { BookKind } from '../api';

interface Store {
  name: string;
  note?: string;
  url: (q: string) => string;
}

// Indie-friendly stores first. Books have no ISBN, so each link is a title + author search.
const EBOOK_STORES: Store[] = [
  { name: 'Bookshop.org', note: 'Supports local bookstores', url: (q) => `https://bookshop.org/search?keywords=${q}` },
  { name: 'Kobo', url: (q) => `https://www.kobo.com/ca/en/search?query=${q}` },
  { name: 'Amazon', url: (q) => `https://www.amazon.ca/s?k=${q}` },
];

const AUDIOBOOK_STORES: Store[] = [
  { name: 'Libro.fm', note: 'Supports local bookstores', url: (q) => `https://libro.fm/search?q=${q}` },
  { name: 'Kobo', url: (q) => `https://www.kobo.com/ca/en/search?query=${q}` },
  { name: 'Audible', url: (q) => `https://www.audible.ca/search?keywords=${q}` },
];

/** "Support the author" button: a menu of store searches for this book. */
export function BuyBook({ title, author, kind }: { title: string; author: string | null; kind: BookKind }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  const query = encodeURIComponent([title, author].filter(Boolean).join(' '));
  const stores = kind === 'audio' ? AUDIOBOOK_STORES : EBOOK_STORES;

  return (
    <div className="menu-wrap" ref={ref}>
      <button
        className="btn btn-lg"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        Support the author
      </button>
      {open && (
        <div className="menu menu-left buy-menu" role="menu">
          <p className="buy-menu-hint">Liked it? Buy a copy:</p>
          {stores.map((s) => (
            <a
              key={s.name}
              role="menuitem"
              href={s.url(query)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <span>{s.name}</span>
              {s.note && <span className="buy-menu-note">{s.note}</span>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
