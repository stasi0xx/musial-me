import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const libreConfigured = Libre_Baskerville({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-libre',
});

export const metadata: Metadata = {
    title: "Paweł Musiał — marketing, rower, miasto",
    description: "Strona Pawła Musiała — marketingowca z 20-letnim doświadczeniem, rowerzysty i aktywisty miejskiego z Gdyni.",
    openGraph: {
        title: "Paweł Musiał — marketing, rower, miasto",
        description: "Strona Pawła Musiała — marketingowca z 20-letnim doświadczeniem, rowerzysty i aktywisty miejskiego z Gdyni.",
        url: "https://musial.me",
        siteName: "musial.me",
        locale: "pl_PL",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Paweł Musiał — marketing, rower, miasto",
        description: "Strona Pawła Musiała — marketingowca z 20-letnim doświadczeniem, rowerzysty i aktywisty miejskiego z Gdyni.",
    },
    metadataBase: new URL("https://musial.me"),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="pl">
                <head>
                    <Script
                        src="https://www.googletagmanager.com/gtag/js?id=G-EVK747LYMM"
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-EVK747LYMM');
                        `}
                    </Script>
                </head>
                <body
                    className={`${libreConfigured.variable} antialiased`}
                >
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
