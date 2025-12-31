import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {getServerSession} from "next-auth";
import React from "react";
import {Providers} from "@/app/providers";
import {SideNav} from "@/components/side-nav/SideNav";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Achievemint",
    description: "Steam achievement tracking",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession()
    return (
        <html lang="en" className={"h-full"}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
        <header>
            <link rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css"/>
        </header>
        <div className={"flex landscape:max-lg:flex-col-reverse flex-row grow h-full w-full"}>
            <a className="github-fork-ribbon before:bg-[#333] max-lg:hidden"
               href="https://github.com/achievemint/achievemint"
               target={"_blank"}
               data-ribbon="Fork me on GitHub"
               title="Fork me on GitHub">Fork me on GitHub</a>
            <div className={"flex lg:h-full w-fit landscape:max-lg:w-full"}><SideNav session={session}/></div>
            <div className={"flex lg:h-full grow overflow-y-auto p-5 scrollbar-hide"}>
                <Providers>{children}</Providers>
            </div>
        </div>
        </body>
        </html>
    )
}
