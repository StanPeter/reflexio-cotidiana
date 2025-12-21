"use client";

import { Box, List } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import FloatingNavItem from "./FloatingNavItem";

type MotionConfig = {
	dx: number;
	dy: number;
	duration: number;
	delay: number;
	seed: number;
};

const baseNavItems = [
	{ label: "Daily log", href: "/daily-log", x: 20, y: 30 },
	{ label: "Motivation", href: "/motivation", x: 68, y: 24 },
	{ label: "Statistics", href: "/statistics", x: 55, y: 65 },
	{ label: "Settings", href: "/settings", x: 30, y: 68 },
	{ label: "Sign in", href: "/auth", x: 80, y: 55 },
	{
		label: "Sign out",
		href: "/api/auth/signout?callbackUrl=/",
		x: 80,
		y: 55,
	},
];

const randomBetween = (min: number, max: number) =>
	Math.random() * (max - min) + min;

const FloatingNav = () => {
	const { data: session } = useSession();
	const [navItems, setNavItems] = useState<typeof baseNavItems>(baseNavItems);
	const buildMotionConfig = useCallback(() => {
		const config: Record<string, MotionConfig | null> = {};

		baseNavItems.forEach((item, index) => {
			if (session?.user && item.label === "Sign in") {
				config[item.label] = null;
				return;
			}

			if (!session?.user && item.label === "Sign out") {
				config[item.label] = null;
				return;
			}

			// Keep drift small so items never overlap.
			const maxDx = 8;
			const maxDy = 10;
			const dx = randomBetween(4, maxDx) * (index % 2 === 0 ? 1 : -1);
			const dy = randomBetween(3, maxDy) * (index % 2 === 0 ? -1 : 1);
			const duration = randomBetween(5.5, 8.5);
			const delay = (item.x + item.y) * 0.001; // stagger slightly per item

			config[item.label] = { dx, dy, duration, delay, seed: Math.random() };
		});

		return config;
	}, [session]);

	const [motion, setMotion] = useState<Record<string, MotionConfig | null>>(
		() => buildMotionConfig(),
	);

	useEffect(() => {
		if (session?.user) {
			setNavItems(baseNavItems.filter((item) => item.label !== "Sign in"));
		} else {
			setNavItems(baseNavItems.filter((item) => item.label !== "Sign out"));
		}
	}, [session]);

	// Refresh motion config when the session state changes (e.g., sign in/out),
	// but keep it stable otherwise to avoid visible teleports.
	useEffect(() => {
		setMotion(buildMotionConfig());
	}, [buildMotionConfig]);

	return (
		<Box as="nav" display="flex" justifyContent="center" marginTop="48px">
			<List.Root
				columnGap={{ base: "20px", md: "28px", lg: "36px" }}
				display="flex"
				flexDirection="row"
				flexWrap={{ base: "wrap", lg: "nowrap" }}
				listStyle="none"
				rowGap={{ base: "20px", md: "24px" }}
			>
				{navItems.map((item) => (
					<List.Item key={item.label}>
						<FloatingNavItem item={item} motion={motion} />
					</List.Item>
				))}
			</List.Root>
		</Box>
	);
};

export default FloatingNav;
