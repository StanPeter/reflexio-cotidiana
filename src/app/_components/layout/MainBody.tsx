"use client";

import { Box } from "@chakra-ui/react";
import FloatingNav from "./Floating-nav";
import Footer from "./Footer";

interface IMainBodyProps {
	children: React.ReactNode;
}

const MainBody = ({ children }: IMainBodyProps) => {
	return (
		<Box
			as="div"
			bg="white"
			color="var(--chakra-colors-text)"
			display="flex"
			flexDirection="column"
			minH="100vh"
			overflow="hidden"
		>
			<FloatingNav />
			<Box
				alignItems="center"
				as="main"
				backgroundColor="var(--chakra-colors-background)"
				display="flex"
				flex={1}
				justifyContent="center"
				px={4}
			>
				{children}
			</Box>
			<Footer />
		</Box>
	);
};

export default MainBody;
