import { Geist } from "next/font/google";

import { auth } from "@/server/auth";
import { Provider } from "./provider";

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
		? { label: "Sign out", href: "/api/auth/signout", x: 80, y: 55, delay: 0.9 }
		: { label: "Sign in", href: "/api/auth/signin", x: 80, y: 55, delay: 0.9 };

	const navItems = [...baseNavItems, authItem];

	return (
		<html lang="en" suppressHydrationWarning className={geist.className}>
      <head />
			<body>
				<Provider navItems={navItems} fontClass={geist.className}>
					{children}
				</Provider>
			</body>
		</html>
	);
}
