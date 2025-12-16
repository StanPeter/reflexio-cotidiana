import { Geist } from "next/font/google";
import Provider from "@/app/_components/layout/Provider";
import { auth } from "@/server/auth";

const geist = Geist({
	subsets: ["latin"],
	display: "swap",
});

const baseNavItems = [
	{ label: "Daily log", href: "/daily-log", x: 20, y: 30, delay: 0 },
	{ label: "Motivation", href: "/motivation", x: 68, y: 24, delay: 0.3 },
	{ label: "Statistics", href: "/statistics", x: 55, y: 65, delay: 0.5 },
	{ label: "Settings", href: "/settings", x: 30, y: 68, delay: 0.7 },
];

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await auth();
	const authItem = session
		? {
				label: "Sign out",
				href: "/api/auth/signout?callbackUrl=/",
				x: 80,
				y: 55,
				delay: 0.9,
			}
		: {
				label: "Sign in",
				href: "/auth",
				x: 80,
				y: 55,
				delay: 0.9,
			};

	const navItems = [...baseNavItems, authItem];

	return (
		<html className={geist.className} lang="en" suppressHydrationWarning>
			<head />
			<body>
				<Provider fontClass={geist.className} navItems={navItems}>
					{children}
				</Provider>
			</body>
		</html>
	);
}
