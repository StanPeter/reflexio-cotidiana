"use client";

import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Input,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";

type Message = {
	id: string;
	role: "assistant" | "user";
	content: string;
};

const MotivationPage = () => {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "intro",
			role: "assistant",
			content:
				"Hey there! I’m your motivation buddy. Tell me what you’re working on today.",
		},
	]);
	const [draft, setDraft] = useState("");
	const [isSending, setIsSending] = useState(false);

	const handleSend = async (e: React.FormEvent) => {
		e.preventDefault();
		const text = draft.trim();
		if (!text) return;

		const userMessage: Message = {
			id: `user-${Date.now()}`,
			role: "user",
			content: text,
		};

		setMessages((prev) => [...prev, userMessage]);
		setDraft("");
		setIsSending(true);

		// Placeholder assistant reply until API wiring is added.
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					id: `assistant-${Date.now()}`,
					role: "assistant",
					content:
						"I’m here with you. What’s the next small step you can take?",
				},
			]);
			setIsSending(false);
		}, 400);
	};

	return (
		<Container maxW="5xl" py={10}>
			<Stack gap={6}>
				<Box>
					<Heading size="lg">Motivation</Heading>
					<Text color="gray.600" mt={2}>
						Chat with your AI coach for encouragement, focus, and gentle nudges.
					</Text>
				</Box>

				<Box
					bg="white"
					borderRadius="lg"
					boxShadow="md"
					minH="60vh"
					overflow="hidden"
				>
					<Stack gap={4} h="full" p={6}>
						<Stack
							bg="gray.50"
							borderRadius="md"
							gap={3}
							minH="40vh"
							overflowY="auto"
							p={4}
						>
							{messages.map((msg) => (
								<Flex
									justify={msg.role === "user" ? "flex-end" : "flex-start"}
									key={msg.id}
								>
									<Box
										bg={msg.role === "user" ? "indigo.500" : "white"}
										border="1px solid"
										borderColor={
											msg.role === "user" ? "indigo.500" : "gray.200"
										}
										borderRadius="lg"
										color={msg.role === "user" ? "white" : "gray.800"}
										maxW="80%"
										p={3}
										shadow="sm"
									>
										<Text fontWeight="semibold" mb={1}>
											{msg.role === "user" ? "You" : "Coach"}
										</Text>
										<Text whiteSpace="pre-wrap">{msg.content}</Text>
									</Box>
								</Flex>
							))}
							{isSending && (
								<Text color="gray.500" fontSize="sm">
									Coach is thinking…
								</Text>
							)}
						</Stack>

						<Box
							as="form"
							borderColor="gray.100"
							borderTop="1px solid"
							onSubmit={handleSend}
							pt={4}
						>
							<Flex gap={3}>
								<Input
									onChange={(e) => setDraft(e.target.value)}
									placeholder="Share a goal or ask for a pep talk"
									value={draft}
								/>
								<Button
									colorScheme="purple"
									disabled={!draft.trim()}
									loading={isSending}
									type="submit"
								>
									Send
								</Button>
							</Flex>
						</Box>
					</Stack>
				</Box>
			</Stack>
		</Container>
	);
};

export default MotivationPage;
