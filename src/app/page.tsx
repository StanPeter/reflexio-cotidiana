import { HomeClient } from "./HomeClient";
import { auth } from "~/server/auth";

const baseNavItems = [
	{ label: "Daily log", href: "/daily-log", x: 18, y: 30, delay: 0 },
	{ label: "Motivation", href: "/motivation", x: 72, y: 26, delay: 0.3 },
	{ label: "Statistics", href: "/statistics", x: 56, y: 64, delay: 0.5 },
	{ label: "Settings", href: "/settings", x: 30, y: 66, delay: 0.7 },
];

export default async function Home() {
	const session = await auth();
	const authItem = session
		? { label: "Sign out", href: "/api/auth/signout", x: 82, y: 56, delay: 0.9 }
		: { label: "Sign in", href: "/api/auth/signin", x: 82, y: 56, delay: 0.9 };

	const navItems = [...baseNavItems, authItem];

	return <HomeClient navItems={navItems} />;
}
