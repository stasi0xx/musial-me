import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import PaperLoader from "@/components/PaperLoader";
import SmoothScroll from "@/components/SmoothScroll";

const libreConfigured = Libre_Baskerville({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-libre',
});

export const metadata: Metadata = {
    title: "Musial.me - Fashion & Editorial",
    description: "Timeless fashion stories and editorial photography.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${libreConfigured.variable} antialiased`}
            >
                <SmoothScroll />
                <PaperLoader />
                {children}
            </body>
        </html>
    );
}
