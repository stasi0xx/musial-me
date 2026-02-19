
export const siteData = {
    site: {
        brand: "MUSIAL.ME",
        authorName: "Paweł Musiał",
        tagline: "marketingowiec i rowerzysta",
        primaryTopics: ["Marketing", "Rower", "Gdynia", "Leszczynki", "Podróże", "Wydarzenia"],
        contact: {
            email: "pawel@musial.me",
            phone: "+48 601 683 050"
        },
        navigation: [
            { label: "O mnie", href: "/#about" },
            { label: "Blog", href: "/#blog" },
            { label: "Projekty", href: "/#projects" }
        ]
    },
    masthead: {
        left: {
            label: "MUSIAL.ME",
            meta: "Paweł Musiał"
        },
        center: {
            strapline: "MARKETING • ROWER • GDYNIA • LESZCZYNKI • PODRÓŻE"
        },
        right: {
            meta: "KONTAKT: pawel@musial.me • 601 683 050"
        }
    },
    hero: {
        headline: "Paweł Musiał",
        deck: "Marketingowiec i rowerzysta",
        lead: "Od ponad 20 lat pracuję w marketingu — projektuję, tworzę i oceniam komunikację marek. Równolegle od lat działam społecznie w tematach miasta i dzielnicy oraz opisuję rowerową codzienność i wydarzenia.",
        ctaPrimary: {
            label: "Zobacz najnowsze wpisy",
            href: "#featured"
        },
        ctaSecondary: {
            label: "Napisz / zadzwoń",
            href: "#kontakt"
        },
        heroImage: {
            src: "/images/hero-portrait.jpg",
            alt: "Czarno-białe zdjęcie portretowe Pawła Musiała",
            note: "Podmień na realne zdjęcie (B/W)."
        },
        metaBar: [
            { label: "DZIAŁ", value: "Blog osobisty" },
            { label: "TEMATY", value: "marketing • rower • gdynia" }
        ]
    },
    featured: {
        id: "featured",
        sectionLabel: "Wyróżnione",
        cards: [
            {
                kicker: "Gdynia / Miasto",
                title: "Budżet Gdyni na 2026 rok",
                excerpt: "Rada Miasta przyjęła budżet Gdyni na 2026 rok — plan zakłada dochody ok. 2,6 mld zł i wydatki blisko 3 mld zł…",
                href: "/budzet-gdyni-na-2026-rok/",
                date: "2026-02-08"
            },
            {
                kicker: "Projekt / WWW",
                title: "Nowa odsłona rajdarkun.pl",
                excerpt: "Strona rajdarkun.pl została przebudowana po ośmiu latach funkcjonowania w dotychczasowej formie…",
                href: "/nowa-odslona-rajdarkun-pl/",
                date: null
            },
            {
                kicker: "Gdynia / Pomysły",
                title: "100 lat Gdyni, pomysłów kilka",
                excerpt: "Wyobraźmy sobie comiesięczne spektakle wyświetlane na wodnej mgiełce, kadłubach statków i ekranach na wodzie…",
                href: "/100-lat-gdyni-pomyslow-kilka/",
                date: "2025-12-11"
            },
            {
                kicker: "Wydarzenia / ARKUN",
                title: "Marsz Głuchej Nocy edycja 2025",
                excerpt: "1 listopada 2025 — 35 kilometrów przez nocne krajobrazy…",
                href: "/marsz-gluchej-nocy-edycja-2025/",
                date: "2025-10-14"
            }
        ],
        sourcesNote: "Tytuły i fragmenty pochodzą z indeksu wyszukiwarki — do pełnych excerptów warto podmienić tekst po wklejeniu HTML/treści."
    },
    editorialColumns: [
        {
            sectionLabel: "Marketing",
            headline: "Marketing: praktyka i obserwacje",
            lead: "Od ponad 20 lat w marketingu — od strategii po detale identyfikacji, jak logotypy i komunikacja.",
            items: [
                {
                    title: "Marketing (tag)",
                    href: "/tag/marketing/",
                    excerpt: "Wpisy o marketingu, identyfikacji i komunikacji marek."
                }
            ]
        },
        {
            sectionLabel: "Rower",
            headline: "Rower: wyprawy, wolność, wydarzenia",
            lead: "Rower jako codzienność i jako przygoda — relacje, trasy i imprezy.",
            items: [
                {
                    title: "Turystyczny Rajd Rowerowy",
                    href: "/turystyczny-rajd-rowerowy-2/",
                    "excerpt": "Malownicze krajobrazy, biwakowa przygoda i kilkaset kilometrów…",
                    date: "2025-07-10"
                },
                {
                    title: "Rowerowa wolność totalna",
                    href: "/rowerowa-wolnosc-totalna/",
                    excerpt: "O różnicy między samochodem a rowerem jako stylem życia…",
                    date: null
                }
            ]
        },
        {
            sectionLabel: "Gdynia",
            headline: "Gdynia: sprawy publiczne i komentarze",
            "lead": "Miasto, decyzje, budżety, komunikacja i jakość dialogu.",
            "items": [
                {
                    title: "Darmowa komunikacja dla radnych dzielnic",
                    "href": "/darmowa-komunikacja-dla-radnych-dzielnic/",
                    "excerpt": "Od 1 maja radni dzielnicowi w Gdyni mogą bezpłatnie poruszać się komunikacją miejską…",
                    date: null
                }
            ]
        },
        {
            sectionLabel: "Leszczynki",
            headline: "Leszczynki: dzielnica i działania społeczne",
            lead: "Ponad 12 lat społecznej pracy na rzecz dzielnicy i miasta — wnioski i doświadczenia.",
            items: [
                {
                    title: "Rada dzielnicy (tag)",
                    href: "/tag/rada-dzielnicy/",
                    "excerpt": "Wpisy dot. działań i spraw dzielnicowych."
                },
                {
                    title: "Dialog (tag)",
                    "href": "/tag/dialog/",
                    "excerpt": "O współpracy, priorytetach i konsekwencjach decyzji."
                }
            ]
        }
    ],
    contactSection: {
        id: "kontakt",
        sectionLabel: "Kontakt",
        headline: "Napisz lub zadzwoń",
        text: "Jeśli chcesz porozmawiać o projekcie, współpracy lub masz sprawę do skonsultowania — kontakt bezpośredni jest najszybszy.",
        contact: {
            email: "pawel@musial.me",
            phone: "+48 601 683 050"
        },
        microcopy: "Preferujesz mail? Odpowiem możliwie szybko."
    },
    footer: {
        left: "www.musial.me",
        right: "01"
    },
    projects: {
        id: "projects",
        sectionLabel: "Projekty",
        items: [
            {
                id: "01",
                title: "Strategia Komunikacji Gdynia 2026",
                description: "Opracowanie kierunków promocji miasta na najbliższe lata.",
                meta: { type: "Strategia", year: "2024", category: "Marketing" },
                details: {
                    goal: "Zbudowanie spójnego przekazu dla mieszkańców i turystów.",
                    actions: "Analiza obecnej percepcji, warsztaty z urzędnikami, opracowanie key message.",
                    effect: "Przyjęcie strategii przez Radę Miasta i wdrożenie nowych kanałów komunikacji."
                }
            },
            {
                id: "02",
                title: "Kampania Rowerowa 'Kręci mnie Gdynia'",
                description: "Promocja komunikacji rowerowej wsród mieszkańców dzielnic.",
                meta: { type: "Kampania", year: "2023", category: "Rower" },
                details: {
                    goal: "Zwiększenie udziału ruchu rowerowego w codziennych dojazdach.",
                    actions: "Organizacja 5 eventów dzielnicowych, produkcja spotów video, outdoor.",
                    effect: "Rekordowa frekwencja na Rajdzie Rowerowym i 15% wzrost ruchu na licznikach."
                }
            },
            {
                id: "03",
                title: "Rebranding Marki Lokalnej 'Portova'",
                description: "Odświeżenie wizerunku trójmiejskiego dewelopera.",
                meta: { type: "Branding", year: "2022", category: "Design" },
                details: {
                    goal: "Nowoczesny wizerunek przy zachowaniu lokalnego charakteru.",
                    actions: "Redesign logo, nowa strona www, materiały BTL.",
                    effect: "Wyróżnienie w konkursie designu i pozytywny odbiór rynku."
                }
            },
            {
                id: "04",
                title: "Audyt Komunikacji Kryzysowej",
                description: "Analiza i procedura reagowania dla instytucji publicznej.",
                meta: { type: "Audyt", year: "2024", category: "PR" },
                details: {
                    goal: "Zabezpieczenie wizerunku instytucji w sytuacjach kryzysowych.",
                    actions: "Symulacje kryzysowe, opracowanie manuala, szkolenia rzecznika.",
                    effect: "Sprawniejsze reagowanie na incydenty i spadek negatywnych wzmianek."
                }
            }
        ]
    },
    blog: {
        id: "blog",
        sectionLabel: "Artykuły",
        items: [
            {
                kicker: "Marketing / Strategia",
                title: "Zarządzanie czasem w erze cyfrowej",
                excerpt: "Jak godzić życie zawodowe z pasją? Kluczem jest efektywne planowanie i umiejętność mówienia 'nie' zbędnym zadaniom…",
                href: "#",
                date: "2026-02-15",
                image: "/images/blog-time.jpg"
            },
            {
                kicker: "Gdynia / Rower",
                title: "Bezpieczne trasy rowerowe w Trójmieście",
                excerpt: "Przegląd najciekawszych ścieżek rowerowych w Gdyni i okolicach. Gdzie warto wybrać się na weekendową przejażdżkę?",
                href: "#",
                date: "2026-02-10",
                image: "/images/blog-bike.jpg"
            },
            {
                kicker: "Marketing / AI",
                title: "Przyśpieszenie w tworzeniu treści",
                excerpt: "Sztuczna inteligencja zmienia oblicze copywritingu. Jak wykorzystać nowe narzędzia, by nie stracić autentyczności?",
                href: "#",
                date: "2026-02-05",
                image: "/images/blog-ai.jpg"
            },
            {
                kicker: "Leszczynki / Społeczeństwo",
                title: "Siła lokalnych inicjatyw",
                excerpt: "Mieszkańcy Leszczynek pokazują, jak wspólnymi siłami można zmieniać otoczenie na lepsze. Relacja z ostatniego spotkania rady.",
                href: "#",
                date: "2026-01-28",
                image: "/images/blog-community.jpg"
            },
            {
                kicker: "Podróże / Rower",
                title: "Wyprawa wzdłuż wybrzeża",
                excerpt: "Relacja z letniej wyprawy rowerowej wzdłuż polskiego wybrzeża. Praktyczne porady, mapa trasy i galeria zdjęć.",
                href: "#",
                date: "2025-08-15",
                image: "/images/blog-sea.jpg"
            },
            {
                kicker: "Design / Branding",
                title: "Minimalizm w projektowaniu logo",
                excerpt: "Dlaczego proste formy przetrwają próbę czasu? Analiza trendów w brandingu na rok 2026.",
                href: "#",
                date: "2025-11-20",
                image: "/images/blog-design.jpg"
            }
        ]
    }
};
