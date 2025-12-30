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
			<head>
				<style>
					@import
					url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
				</style>
			</head>
			<body>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
