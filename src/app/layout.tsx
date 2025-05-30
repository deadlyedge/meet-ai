import type { Metadata } from "next"
import { Noto_Serif } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next"

import { TRPCReactProvider } from "@/trpc/client"

import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const notoSerif = Noto_Serif({
	subsets: ["latin"],
	variable: "--font-noto-serif",
	weight: ["300", "500", "700"],
})

export const metadata: Metadata = {
	title: "Meet AI",
	description: "Generated by Meet AI",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<NuqsAdapter>
			<TRPCReactProvider>
				<html lang="en">
					<body className={`${notoSerif.className} antialiased`}>
						<Toaster />
						{children}
					</body>
				</html>
			</TRPCReactProvider>
		</NuqsAdapter>
	)
}
