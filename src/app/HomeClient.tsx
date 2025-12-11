"use client";

import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Stack,
	Text,
} from "@chakra-ui/react";
import Link from "next/link";

import { PALLETE } from "@/constants";

export function HomeClient() {
	return (
		<Box
			bgImage={`radial-gradient(circle at 18% 20%, rgba(163, 147, 255, 0.2), transparent 30%), radial-gradient(circle at 82% 16%, rgba(108, 99, 255, 0.12), transparent 28%), linear-gradient(180deg, ${PALLETE.bg} 0%, #f8f7ff 60%, #ffffff 100%)`}
			color={PALLETE.text}
			minH="100vh"
			overflow="hidden"
			pb={32}
			pos="relative"
			pt={28}
			px={4}
		>
			<Container centerContent maxW="5xl">
				<Stack align="center" gap={4} textAlign="center">
					<Text
						color={PALLETE.indigo}
						fontSize="xs"
						fontWeight={600}
						letterSpacing="0.08em"
						textTransform="uppercase"
					>
						Reflexio Cotidiana
					</Text>
					<Heading as="h1" size="xl">
						Daily reflections made simple
					</Heading>
					<Text color="gray.600" fontSize="md" maxW="680px">
						Answer a few mindful prompts each day, track your mood, and see
						gentle trends over time.
					</Text>
					<Flex gap={3} justify="center" wrap="wrap">
						<Link href="/daily-log">
							<Button colorScheme="indigo" size="md">
								Start daily log
							</Button>
						</Link>
						<Link href="/statistics">
							<Button colorScheme="indigo" size="md" variant="outline">
								View stats
							</Button>
						</Link>
					</Flex>
				</Stack>
			</Container>
		</Box>
	);
}
