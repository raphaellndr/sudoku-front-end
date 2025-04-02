"use client";

import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"

import Provider from "@/components/ui/provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
})

const queryClient = new QueryClient()

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
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