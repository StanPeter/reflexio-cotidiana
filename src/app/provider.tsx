"use client";

import { ChakraProvider, Box, defaultSystem } from "@chakra-ui/react";
import Footer from "@/app/_components/footer";
import { FloatingNav } from "@/app/_components/floating-nav";
import { PALLETE } from "@/constants";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "styled-components";

type NavItem = {
	label: string;
	href: string;
	x: number;
	y: number;
	delay?: number;
};

type Props = {
	navItems: NavItem[];
	fontClass: string;
	children: React.ReactNode;
};

const theme = {
	colors: {
		indigo: [
			"#f3f2ff",
			"#e7e5ff",
			"#d7d2ff",
			"#c2b8ff",
			"#aa99ff",
			"#8e78ff",
			"#7c61ff",
			"#6c53f2",
			"#5f49d6",
			"#4c39ad",
		],
	},
	primaryColor: "indigo",
	fonts: {
		body: "Geist, system-ui, -apple-system, sans-serif",
		heading: "Geist, system-ui, -apple-system, sans-serif",
	},
	radii: {
		md: "12px",
		lg: "18px",
	},
});

export function Provider({ navItems, fontClass, children }: Props) {
	return (
		<ChakraProvider value={defaultSystem}>
			<ThemeProvider theme={theme} attribute="class" disableTransitionOnChange>
				<TRPCReactProvider>
					<Box
						as="div"
						minH="100vh"
						pos="relative"
						overflow="hidden"
						px={4}
						pb={20}
						className={fontClass}
						bg="white"
						bgImage={`radial-gradient(circle at 18% 20%, rgba(163, 147, 255, 0.2), transparent 30%), radial-gradient(circle at 82% 16%, rgba(108, 99, 255, 0.12), transparent 28%), linear-gradient(180deg, ${PALLETE.bg} 0%, #f8f7ff 60%, #ffffff 100%)`}
						color={PALLETE.text}
					>
						<FloatingNav items={navItems} />
						{children}
						<Footer />
					</Box>
				</TRPCReactProvider>
			</ThemeProvider>
		</ChakraProvider>
	);
}
