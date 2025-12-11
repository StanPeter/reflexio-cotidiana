"use client";

import { Box } from "@chakra-ui/react";

import { DailyLogClient } from "./DailyLogClient";

export default function DailyLogPage() {
	return (
		<Box
			alignItems="flex-start"
			as="main"
			bgGradient="linear(180deg, #f2f0ff 0%, #f8f7ff 50%, #ffffff 100%)"
			color="#2f2e41"
			display="flex"
			justifyContent="center"
			minH="100vh"
			px={4}
			py={16}
		>
			<DailyLogClient />
		</Box>
	);
}
