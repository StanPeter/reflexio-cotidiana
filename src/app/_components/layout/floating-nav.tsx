import { Box, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import Link from "next/link";
import { useMemo } from "react";
import { PALLETE } from "@/constants";

type NavItem = {
	label: string;
	href: string;
	x: number;
	y: number;
	delay?: number;
};

const randomBetween = (min: number, max: number) =>
	Math.random() * (max - min) + min;

const FloatingNav = ({ items }: { items: NavItem[] }) => {
	const motion = useMemo(
		() =>
			items.map((item) => {
				// Keep drift within safe bounds so bubbles don't collide.
				const maxDx = 20;
				const maxDy = 14;
				const dx = randomBetween(10, maxDx) * (Math.random() > 0.5 ? 1 : -1);
				const dy = randomBetween(6, maxDy) * (Math.random() > 0.5 ? 1 : -1);
				const duration = randomBetween(5.5, 8.5);
				const delay = (item.delay ?? 0) + randomBetween(0, 1.2);

				return {
					anim: keyframes`
            0% { transform: translate(0px, 0px); }
            50% { transform: translate(${dx}px, ${dy}px); }
            100% { transform: translate(0px, 0px); }
          `,
					duration,
					delay,
				};
			}),
		[items],
	);

	return (
		<Box
			columnGap="48px"
			display="flex"
			flexWrap={{ base: "wrap", lg: "nowrap" }}
			justifyContent="center"
			marginTop="48px"
			pointerEvents="none"
			py={4}
			rowGap="36px"
			w="full"
			zIndex={2}
		>
			{items.map((item, idx) => (
				<Link
					href={item.href}
					key={item.label}
					style={{ textDecoration: "none" }}
				>
					<Box
						_hover={{
							transform: "translateY(-8px) scale(1.03)",
							boxShadow: "0 24px 60px rgba(108, 99, 255, 0.28)",
							borderColor: "rgba(108, 99, 255, 0.32)",
						}}
						animation={`${motion[idx]?.anim} ${motion[idx]?.duration ?? 6}s ease-in-out ${
							motion[idx]?.delay ?? 0
						}s infinite alternate`}
						backdropFilter="blur(10px)"
						bg="white"
						border="1px solid rgba(108, 99, 255, 0.12)"
						borderRadius="full"
						boxShadow="0 18px 55px rgba(47, 46, 65, 0.18)"
						display="grid"
						flexBasis={{
							base: "calc(50% - 24px)",
							md: "calc(50% - 24px)",
							lg: "auto",
						}}
						fontWeight="700"
						h="112px"
						letterSpacing="-0.01em"
						placeItems="center"
						pointerEvents="auto"
						textDecoration="none"
						transition="transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease"
						w="112px"
					>
						<Text color={PALLETE.text} textAlign="center">
							{item.label}
						</Text>
					</Box>
				</Link>
			))}
		</Box>
	);
};

export default FloatingNav;
