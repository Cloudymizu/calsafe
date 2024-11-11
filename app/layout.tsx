// app/layout.tsx

import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { PropsWithChildren } from "react";

export const metadata = {
	title: "CalSafe",
	description: "A map showing traffic data",
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className="flex flex-col">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Header />
					<main className="h-full grow">{children}</main>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
