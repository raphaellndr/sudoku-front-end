import { Providers } from "@/components/ui/providers"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html suppressHydrationWarning>
            <head />
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}