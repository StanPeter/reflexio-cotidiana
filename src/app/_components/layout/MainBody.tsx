"use client";

import { Box } from "@chakra-ui/react";
import { PALLETE } from "@/constants";
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
			bgImage={`radial-gradient(circle at 18% 20%, rgba(163, 147, 255, 0.2), transparent 30%), radial-gradient(circle at 82% 16%, rgba(108, 99, 255, 0.12), transparent 28%), linear-gradient(180deg, ${PALLETE.bg} 0%, #f8f7ff 60%, #ffffff 100%)`}
			color={PALLETE.text}
			minH="100vh"
			overflow="hidden"
			pb={20}
			pos="relative"
			px={4}
		>
			<FloatingNav />
			<Box
				alignItems="center"
				as="main"
				display="flex"
				flex={1}
				justifyContent="center"
			>
				{children}
			</Box>
			<Footer />
		</Box>
	);
};

export default MainBody;
