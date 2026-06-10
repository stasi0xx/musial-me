# CLAUDE.md — musial.me

Przewodnik dla Claude Code. Przeczytaj ten plik przed każdą zmianą.

---

## Projekt

Osobista strona portfolio **Pawła Musiała** — marketingowca, rowerzysty i aktywisty miejskiego z Gdyni. Strona ma charakter **editorialny, gazetowy**, prezentuje projekty, artykuły i działalność publiczną. Wszystkie treści i interfejs są **po polsku**.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP 3 · Drizzle ORM + Neon (Postgres) · Clerk (auth panelu admina) · Cloudinary (upload zdjęć)

Strona ma **panel admina** (`/admin`) chroniony logowaniem Clerk, w którym właściciel zarządza treściami (blog, inicjatywy, hero, sekcja "o mnie") — dane trafiają do bazy Neon przez Drizzle i są renderowane na stronie głównej.

---

## Zasady ogólne

- **Treści dynamiczne (blog, inicjatywy, hero slides, "o mnie") z bazy danych** przez `lib/schema.ts` (Drizzle) — edytowalne w `/admin`. **Treści statyczne / konfiguracyjne** (nazwa marki, nawigacja, kontakt, dane masthead) z `app/data.ts`. Żadnych hardcodowanych tekstów w komponentach prezentacyjnych.
- **Kod po angielsku, treści po polsku** — nazwy zmiennych, komponenty, komentarze w kodzie: angielski. Teksty widoczne użytkownikowi: polski.
- **Backend istnieje** — API routes (`app/api/*`), baza Postgres (Neon) przez Drizzle, auth przez Clerk. Strona główna (`app/page.tsx`) ma `export const dynamic = 'force-dynamic'` i pobiera dane z bazy.
- **Sprawdzaj TypeScript** — przed zaproponowaniem zmian upewnij się, że kod jest poprawny typowo. Nie używaj `any`.

---

## Architektura plików

```
app/
  data.ts          ← Statyczna konfiguracja: brand, navigation, masthead, kontakt
  layout.tsx       ← Root layout: ClerkProvider, fonty, PaperLoader, SmoothScroll, Masthead
  page.tsx         ← Kompozycja sekcji strony głównej, fetch danych z bazy (Drizzle)
  globals.css      ← Tailwind v4 + custom theme + paper texture
  admin/           ← Panel admina (chroniony przez Clerk middleware): blog, hero, initiatives, about
  api/             ← Route handlery REST: blog, hero-slides, initiatives, about, upload (Cloudinary)

lib/
  schema.ts        ← Schemat Drizzle (blogPosts, initiatives, heroSlides, aboutSection) + typy
  db.ts            ← Połączenie z bazą Neon

components/        ← Wszystkie komponenty trafiają tutaj, bez podfolderów (poza admin)
public/images/     ← Zdjęcia i grafiki
middleware.ts      ← clerkMiddleware, chroni /admin przez ADMIN_USER_ID
```

**Nie twórz** podfolderów w `components/`, chyba że jest to absolutnie niezbędne i nie da się tego zrobić inaczej.

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

- **Statyczna konfiguracja** (brand, navigation, masthead, kontakt) → `@/app/data` (`siteData`).
- **Treści edytowalne przez admina** (blog, inicjatywy, hero slides, "o mnie") → tabele Drizzle w `lib/schema.ts`, pobierane w Server Components (np. `app/page.tsx`) i przekazywane do komponentów jako props.
- Komponenty prezentacyjne (sekcje na stronie głównej) powinny przyjmować dane jako **props** typowane na podstawie typów z `lib/schema.ts` (`BlogPost`, `Initiative`, `HeroSlide`, `AboutSection`), a nie odwoływać się do bazy bezpośrednio.

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

## Rozszerzanie treści

### Statyczna konfiguracja (`app/data.ts`)
Dla treści, które nie są edytowalne przez admina (nawigacja, branding, kontakt):
1. Zdefiniuj interfejs TypeScript dla danych sekcji
2. Dodaj dane do obiektu `siteData` (lub jako oddzielny eksport jeśli duże)
3. Zaimportuj w komponencie przez `import { siteData } from "@/app/data"`

### Treści z bazy danych (Drizzle / Neon)
Dla nowych sekcji edytowalnych w panelu admina:
1. Dodaj tabelę i typy w `lib/schema.ts`
2. Wygeneruj i wypchnij migrację: `npm run db:generate` → `npm run db:push`
3. Dodaj route handler w `app/api/<sekcja>/route.ts` (CRUD)
4. Dodaj widoki w `app/admin/<sekcja>/` (lista, nowy, edycja)
5. Pobierz dane w `app/page.tsx` (Server Component, Drizzle `db.select()`) i przekaż jako props do komponentu sekcji

---

## Workflow

- **Testowanie:** głównie `npm run dev` — nie wymaga buildu przy każdej zmianie
- **Przed większymi zmianami:** warto uruchomić `tsc --noEmit` żeby wychwycić błędy typów
- **Zmiany w schemacie bazy:** `npm run db:generate` (migracja) → `npm run db:push` (zastosowanie); `npm run db:studio` do podglądu danych
- **Build:** `npm run build` przed deployem na serwer
- **Linting:** `npm run lint`
- **Zmienne środowiskowe** (`.env`, niewersjonowane): `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL`, `CLOUDINARY_*`, `ADMIN_USER_ID`. Przed deployem produkcyjnym zamień klucze Clerk z `pk_test_*` / `sk_test_*` na produkcyjne (`pk_live_*` / `sk_live_*`).

---

## Czego NIE robić

- Nie dodawaj nowych bibliotek bez pytania — sprawdź czy można to osiągnąć Tailwindem, GSAP lub natywnym CSS
- Nie twórz plików `*.test.ts` / `*.spec.ts` — projekt nie ma środowiska testowego
- Nie używaj `console.log` w kodzie produkcyjnym
- Nie dodawaj `// TODO` / `// FIXME` bez ich rozwiązania
- Nie hardcoduj treści polskich w komponentach prezentacyjnych — statyka przez `data.ts`, treści dynamiczne przez props z bazy
- Nie używaj `<img>` — zawsze `<Image>` z `next/image`
- Nie zakładaj Vercel (brak ISR, Edge Runtime, itp.) — `app/page.tsx` jest `force-dynamic`, deploy na `next build` + `next start`
- Nie commituj `.env` ani kluczy Clerk/Cloudinary/DATABASE_URL
- Nie refaktoryzuj kodu którego nie dotyczysz — zmieniaj tylko to co potrzeba

---

## Kontekst właściciela

**Paweł Musiał** — marketingowiec z 20-letnim doświadczeniem, rowerzysta, aktywista miejski w Gdyni. Miasto: Gdynia (Leszczynki). Kontakt: pawel@musial.me. Strona reprezentuje osobę publiczną, styl komunikacji: bezpośredni, merytoryczny, z charakterem.
