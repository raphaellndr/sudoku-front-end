"use client";

import { useState } from "react";

import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"

import Provider from "@/components/ui/provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <html className={inter.className} suppressHydrationWarning>
            <head />
            <body>
                <QueryClientProvider client={queryClient}>
                    <SessionProvider>
                        <Provider>{children}</Provider>
                    </SessionProvider>
                </QueryClientProvider>
            </body>
        </html>
    )
}