import {
	Button,
	Container,
	Flex,
	Heading,
	Stack,
	Text,
} from "@chakra-ui/react";
import Link from "next/link";

import { PALLETE } from "@/constants";

export default async function Home() {
	return (
		<Container centerContent maxW="5xl" pb={32} pt={28}>
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
					Answer a few mindful prompts each day, track your mood, and see gentle
					trends over time.
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
	);
}
