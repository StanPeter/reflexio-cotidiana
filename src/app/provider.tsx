"use client";

import { Box, ChakraProvider, defaultSystem, Theme } from "@chakra-ui/react";
import { ThemeProvider } from "@emotion/react";
import FloatingNav from "@/app/_components/floating-nav";
import Footer from "@/app/_components/footer";
import { PALLETE, theme } from "@/constants";
import { TRPCReactProvider } from "@/trpc/react";

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

const Provider = ({ fontClass, navItems, children }: Props) => {
	return (
		<ChakraProvider value={defaultSystem}>
			<ThemeProvider theme={theme}>
				<TRPCReactProvider>
					<Box
						as="div"
						bg="white"
						bgImage={`radial-gradient(circle at 18% 20%, rgba(163, 147, 255, 0.2), transparent 30%), radial-gradient(circle at 82% 16%, rgba(108, 99, 255, 0.12), transparent 28%), linear-gradient(180deg, ${PALLETE.bg} 0%, #f8f7ff 60%, #ffffff 100%)`}
						className={fontClass}
						color={PALLETE.text}
						minH="100vh"
						overflow="hidden"
						pb={20}
						pos="relative"
						px={4}
					>
						<FloatingNav items={navItems} />
						{children}
						<Footer />
					</Box>
				</TRPCReactProvider>
			</ThemeProvider>
		</ChakraProvider>
	);
};

export default Provider;
