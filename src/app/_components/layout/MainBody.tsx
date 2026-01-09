"use client";

import { Box } from "@chakra-ui/react";
import { redirect, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import FloatingNav from "./Floating-nav";
import Footer from "./Footer";

interface IMainBodyProps {
	children: React.ReactNode;
}

const MainBody = ({ children }: IMainBodyProps) => {
	const session = useSession();
	const pathname = usePathname();

	if (session.status === "unauthenticated" && pathname !== "/auth") {
		return redirect("/auth");
	}

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
				minH={"70vh"}
				px={{ base: 4, md: 6 }}
				py={{ base: 12, md: 12 }}
			>
				<Suspense fallback={null}>{children}</Suspense>
			</Box>
			<Footer />
		</Box>
	);
};

export default MainBody;
