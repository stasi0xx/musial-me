# CLAUDE.md — musial.me

Przewodnik dla Claude Code. Przeczytaj ten plik przed każdą zmianą.

---

## Projekt

Osobista strona portfolio **Pawła Musiała** — marketingowca, rowerzysty i aktywisty miejskiego z Gdyni. Strona ma charakter **editorialny, gazetowy**, prezentuje projekty, artykuły i działalność publiczną. Wszystkie treści i interfejs są **po polsku**.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP 3

---

## Zasady ogólne

- **Treści tylko z `app/data.ts`** — żadnych hardcodowanych tekstów w komponentach. Każda nowa sekcja musi mieć odpowiadający wpis w `data.ts`.
- **Kod po angielsku, treści po polsku** — nazwy zmiennych, komponenty, komentarze w kodzie: angielski. Teksty widoczne użytkownikowi: polski.
- **Brak backendów** — strona jest w pełni statyczna. Nie dodawaj API routes, baz danych ani server actions.
- **Deploy na tradycyjnym serwerze** — nie zakładaj Vercel-specific features (Edge Runtime, ISR, itp.). Używaj `next build` + `next start` lub static export jeśli to możliwe.
- **Sprawdzaj TypeScript** — przed zaproponowaniem zmian upewnij się, że kod jest poprawny typowo. Nie używaj `any`.

---

## Architektura plików

```
app/
  data.ts          ← JEDYNE źródło treści i konfiguracji
  layout.tsx       ← Root layout: fonty, PaperLoader, SmoothScroll, Masthead
  page.tsx         ← Kompozycja sekcji strony głównej
  globals.css      ← Tailwind v4 + custom theme + paper texture

components/        ← Wszystkie komponenty trafiają tutaj, bez podfolderów
public/images/     ← Zdjęcia i grafiki
```

**Nie twórz** podfolderów w `components/`, plików `utils/`, `hooks/`, `lib/` — chyba że jest to absolutnie niezbędne i nie da się tego zrobić inaczej.

---

## Styl wizualny — zasady bezwzględne

### Kolory
- **Tło strony:** `#f7f5ef` (ciepły off-white, papierowy) z fakturą szumu SVG
- **Tekst główny:** `#1a1a1a` (prawie czarny)
- **Akcent:** tylko czerwień na podkreśleniu w Hero SVG — **nie dodawaj nowych kolorów akcentowych**
- **Paleta:** czarno-biało-szara. Hover może ujawniać kolor (np. odbarwianie grayscale), ale domyślnie wszystko jest monochromatyczne
- **Obrazki:** domyślnie `grayscale` + kontrast, kolor widoczny tylko po hover

### Typografia
- **Body:** `Libre Baskerville` (font-sans w konfiguracji), ładowany przez Google Fonts
- **Nagłówki (h1–h6):** `Times New Roman, Times, serif` — bold 700
- **Nie dodawaj nowych fontów**
- Skala rozmiarów: używaj presetów Tailwind (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`…`text-7xl`). Duże nagłówki sekcji: `text-4xl` do `text-6xl` zależnie od hierarchii.

### Layout i siatka
- **Kontener strony:** `max-w-7xl mx-auto p-4 sm:p-6 lg:p-8`
- **Siatka:** 12-kolumnowa oparta na `grid grid-cols-12`. Proporcje dobieraj kreatywnie (np. 4/8, 5/7, 7/5, 3/9). Nie ma jednego "bazowego" układu — każda sekcja może być inna.
- **Gap między sekcjami w page.tsx:** `gap-8` (flex col)
- **Estetyka:** editorialna, gazetowa. Sięgaj po typograficzne zabiegi: duże cyfry/indeksy, tabulatory, linie-separatory (`border-t`), stemple metadanych.

### Szczegóły UI
- Obrazki: `<Image>` z Next.js, zawsze z `alt`
- Linki: brak podkreślenia domyślnie, `hover:underline` lub autorskie efekty
- Przyciski/CTA: styl typograficzny (nie pill-buttons z zaokrągleniem). Preferuj `border` z ostrymi rogami lub czyste linki z ikonką strzałki.
- Separatory sekcji: `border-t border-black/10` lub `border-black`

---

## React / Next.js — konwencje

### `"use client"` — tylko kiedy naprawdę potrzeba

Dodaj `"use client"` **wyłącznie** gdy komponent używa:
- `useState`, `useEffect`, `useRef`, `useCallback`
- event handlerów (onClick, onKeyDown itp.)
- GSAP / animacji po stronie klienta
- `useGSAP` z `@gsap/react`

Komponenty czysto prezentacyjne (tylko JSX + props) — **Server Components** bez dyrektywy.

### Struktura nowego komponentu

```tsx
// Komentarz: co robi komponent (po angielsku)
// Jeśli "use client" — uzasadnienie w komentarzu

"use client"; // potrzebne ze względu na [GSAP / stan / eventy]

import { ... } from "...";
import { siteData } from "@/app/data";

interface Props {
  // ...
}

export default function NazwaKomponentu({ ... }: Props) {
  // ...
}
```

### Dane

Zawsze importuj dane z `@/app/data`. Rozszerzaj typy i tablice w `data.ts` gdy potrzebujesz nowych treści. Nie przyjmuj danych jako props jeśli sekcja jest singleton (jedna na stronie).

---

## Animacje

### Kiedy używać GSAP
- Animacje wejścia przy scrollu (ScrollTrigger) — **obowiązkowe dla każdej nowej sekcji**
- Złożone sekwencje czasowe (timeline)
- Transformacje 3D (`rotateY`, perspective)
- Efekty których CSS nie obsługuje płynnie

### Kiedy NIE używać GSAP
- Proste hover efekty → czysty CSS / Tailwind (`transition`, `duration-300`)
- Fade in/out przełączników stanu → CSS transition
- Zmiana koloru, opacity na hover → Tailwind

### Wzorzec GSAP w komponencie

```tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function NazwaSekcji() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
    });
  }, { scope: containerRef });

  return <div ref={containerRef}>...</div>;
}
```

**Domyślne parametry animacji wejścia:**
- `opacity: 0 → 1`, `y: 40 → 0`
- `duration: 0.8`, `ease: "power2.out"`
- `start: "top 80%"`

Dla złożonych sekcji z wieloma elementami — stagger: `stagger: 0.1`

---

## Sekcje strony — aktualny stan

Kolejność w `page.tsx`:
1. `<Hero />` — nagłówek z animacją SVG + HeroSlider (3D karuzela)
2. `<FeaturedSection />` — poziomy scroll wyróżnionych treści
3. `<ProjectsStack />` — stackowane karty projektów
4. `<BlogSection />` — 3-kolumnowy grid artykułów
5. `<AboutSection />` — O mnie z kartą profilu
6. `<ContactSection />` — dane kontaktowe
7. `<Footer />` — stopka

**Żadna sekcja nie jest "zamknięta"** — wszystkie można modyfikować.

### Anchor navigation
Każda nowa sekcja powinna mieć `id` zgodny z linkami w nawigacji Masthead, np.:
```tsx
<section id="projekty" className="scroll-mt-24">
```
`scroll-mt-24` kompensuje wysokość sticky headera.

---

## Rozszerzanie `data.ts`

Przy dodawaniu nowej sekcji:

1. Zdefiniuj interfejs TypeScript dla danych sekcji
2. Dodaj dane do obiektu `siteData` (lub jako oddzielny eksport jeśli duże)
3. Zaimportuj w komponencie przez `import { siteData } from "@/app/data"`

Przykładowy wzorzec:
```ts
// W data.ts
export interface NowaSekcjaItem {
  id: string;
  tytul: string;
  opis: string;
}

export const nowaSekcjaData: NowaSekcjaItem[] = [
  { id: "1", tytul: "...", opis: "..." },
];
```

---

## Workflow

- **Testowanie:** głównie `npm run dev` — nie wymaga buildu przy każdej zmianie
- **Przed większymi zmianami:** warto uruchomić `tsc --noEmit` żeby wychwycić błędy typów
- **Build:** `npm run build` przed deployem na serwer
- **Linting:** `npm run lint`

---

## Czego NIE robić

- Nie dodawaj nowych bibliotek bez pytania — sprawdź czy można to osiągnąć Tailwindem, GSAP lub natywnym CSS
- Nie twórz plików `*.test.ts` / `*.spec.ts` — projekt nie ma środowiska testowego
- Nie używaj `console.log` w kodzie produkcyjnym
- Nie dodawaj `// TODO` / `// FIXME` bez ich rozwiązania
- Nie hardcoduj treści polskich w komponentach — zawsze przez `data.ts`
- Nie używaj `<img>` — zawsze `<Image>` z `next/image`
- Nie zakładaj Vercel (brak ISR, Edge Runtime, itp.)
- Nie refaktoryzuj kodu którego nie dotyczysz — zmieniaj tylko to co potrzeba

---

## Kontekst właściciela

**Paweł Musiał** — marketingowiec z 20-letnim doświadczeniem, rowerzysta, aktywista miejski w Gdyni. Miasto: Gdynia (Leszczynki). Kontakt: pawel@musial.me. Strona reprezentuje osobę publiczną, styl komunikacji: bezpośredni, merytoryczny, z charakterem.
