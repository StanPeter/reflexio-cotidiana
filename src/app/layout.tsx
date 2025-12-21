import { Geist } from "next/font/google";
import Provider from "@/app/_components/layout/Provider";
import { auth } from "@/server/auth";

const geist = Geist({
	subsets: ["latin"],
	display: "swap",
});

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html className={geist.className} lang="en" suppressHydrationWarning>
			<head />
			<body>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
