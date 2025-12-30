import { Container, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import Button from "./_components/UI/Button";

export default async function Home() {
	return (
		<Container centerContent maxW="5xl" pb={32} pt={28}>
			<Stack align="center" gap={4} textAlign="center">
				<Text
					color="var(--chakra-colors-text)"
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
						<Button size="md" useCase="primary">
							Start daily log
						</Button>
					</Link>
					<Link href="/statistics">
						<Button size="md" useCase="secondary">
							View stats
						</Button>
					</Link>
				</Flex>
			</Stack>
		</Container>
	);
}
