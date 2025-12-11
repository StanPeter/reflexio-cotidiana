"use client";

import { Box, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import Link from "next/link";
import { PALLETE } from "@/constants";

type NavItem = {
	label: string;
	href: string;
	x: number;
	y: number;
	delay?: number;
};

const float = keyframes`
  0% { transform: translate(0px, 0px); }
  50% { transform: translate(10px, -14px); }
  100% { transform: translate(0px, 0px); }
`;

export function FloatingNav({ items }: { items: NavItem[] }) {
	return (
		<Box
			h="200px"
			left={0}
			pointerEvents="none"
			pos="absolute"
			right={0}
			top={0}
			zIndex={2}
		>
			{items.map((item, idx) => (
				<Box
					_hover={{
						transform: "translateY(-8px) scale(1.03)",
						boxShadow: "0 24px 60px rgba(108, 99, 255, 0.28)",
						borderColor: "rgba(108, 99, 255, 0.32)",
					}}
					animation={`${float} ${5.2 + idx * 0.6}s linear infinite`}
					animationDelay={`${item.delay ?? 0}s`}
					as={Link}
					backdropFilter="blur(10px)"
					bg="white"
					border="1px solid rgba(108, 99, 255, 0.12)"
					borderRadius="full"
					boxShadow="0 18px 55px rgba(47, 46, 65, 0.18)"
					display="grid"
					fontWeight="700"
					h="112px"
					href={item.href}
					key={item.label}
					left={`${item.x}%`}
					letterSpacing="-0.01em"
					placeItems="center"
					pointerEvents="auto"
					pos="absolute"
					textDecoration="none"
					top={`${item.y}%`}
					transition="transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease"
					w="112px"
				>
					<Text color={PALLETE.text} textAlign="center">
						{item.label}
					</Text>
				</Box>
			))}
		</Box>
	);
}
