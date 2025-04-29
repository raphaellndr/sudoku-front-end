"use client"

import { useEffect, useState } from "react"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ToastContainer } from "react-toastify"

import { ColorModeProvider } from "./color-mode"

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    // Client-side rendering safety
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <ChakraProvider value={defaultSystem}>
                    <ColorModeProvider>
                        <ToastContainer />
                        {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
                    </ColorModeProvider>
                </ChakraProvider>
            </SessionProvider>
        </QueryClientProvider>
    )
}