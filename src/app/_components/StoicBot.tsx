"use client";

import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { IoClose, IoChatbubbleEllipses, IoSend } from "react-icons/io5";

type Message = { id: string; role: "bot" | "user"; text: string };

const STOIC_RESPONSES = [
	{
		trigger: /stress|anxious|worried|overwhelmed/i,
		replies: [
			"Marcus Aurelius wrote: 'You have power over your mind, not outside events. Realize this, and you will find strength.'",
			"Epictetus reminds us: 'Men are disturbed not by the things which happen, but by the opinions about the things.' What story are you telling yourself?",
			"Seneca said: 'We suffer more in imagination than in reality.' What is actually within your control right now?",
		],
	},
	{
		trigger: /fail|failed|mistake|wrong/i,
		replies: [
			"Marcus Aurelius: 'If it is not right, do not do it; if it is not true, do not say it.' And when you stumble? Return to virtue immediately.",
			"Seneca wrote: 'We are all in training for life.' Failure is the curriculum, not the verdict.",
			"Epictetus: 'Make the best use of what is in your power, and take the rest as it happens.' You've learned — now act.",
		],
	},
	{
		trigger: /motivation|lazy|procrastinat/i,
		replies: [
			"Marcus Aurelius to himself each morning: 'Get up and do the work you were made for.' What work were you made for today?",
			"Seneca: 'Luck is what happens when preparation meets opportunity.' Stop waiting for motivation — start moving.",
			"Epictetus: 'First say to yourself what you would be; and then do what you have to do.' Who do you want to be?",
		],
	},
	{
		trigger: /sad|unhappy|depress|grief/i,
		replies: [
			"Seneca: 'True happiness is to enjoy the present, without anxious dependence upon the future.' One moment at a time.",
			"Marcus Aurelius: 'Accept the things to which fate binds you, and love the people with whom fate brings you together.' What can you appreciate right now?",
			"Epictetus: 'Seek not that the things which happen should happen as you wish; but wish the things which happen to be as they are, and you will have a tranquil flow of life.'",
		],
	},
];

const FALLBACK_REPLIES = [
	"Marcus Aurelius: 'Confine yourself to the present.' What is the one thing you can do right now?",
	"Seneca: 'It is not that I am brave, but that I know what is not worth fearing.' What truly matters here?",
	"Epictetus: 'He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.'",
	"Marcus Aurelius: 'The impediment to action advances action. What stands in the way becomes the way.'",
	"Seneca: 'Difficulty comes from our lack of confidence.' Trust yourself — you have faced harder things.",
];

function getBotReply(input: string): string {
	for (const group of STOIC_RESPONSES) {
		if (group.trigger.test(input)) {
			const reply = group.replies[Math.floor(Math.random() * group.replies.length)];
			return reply ?? FALLBACK_REPLIES[0]!;
		}
	}
	return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)]!;
}

const StoicBot = () => {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "intro",
			role: "bot",
			text: "Greetings. I am your Stoic companion. Share what weighs on your mind.",
		},
	]);
	const [draft, setDraft] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	if (pathname === "/settings") return null;

	const handleSend = () => {
		const text = draft.trim();
		if (!text) return;

		const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text };
		setMessages((prev) => [...prev, userMsg]);
		setDraft("");
		setIsTyping(true);

		setTimeout(() => {
			const reply = getBotReply(text);
			setMessages((prev) => [
				...prev,
				{ id: `b-${Date.now()}`, role: "bot", text: reply },
			]);
			setIsTyping(false);
		}, 700);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<>
			{/* Chat panel */}
			{isOpen && (
				<Box
					bg="white"
					border="1.5px solid var(--chakra-colors-tertiary)"
					borderRadius="2xl"
					bottom="88px"
					boxShadow="0 8px 32px 0 rgba(137,130,255,0.18)"
					display="flex"
					flexDirection="column"
					h="440px"
					overflow="hidden"
					position="fixed"
					right={{ base: "16px", md: "32px" }}
					w={{ base: "calc(100vw - 32px)", sm: "360px" }}
					zIndex={1000}
				>
					{/* Header */}
					<Flex
						align="center"
						bg="var(--chakra-colors-primary)"
						justify="space-between"
						px={4}
						py={3}
					>
						<Flex align="center" gap={2}>
							<Text fontSize="20px">🏛️</Text>
							<Box>
								<Text color="white" fontWeight={700} fontSize="sm">
									Stoic Companion
								</Text>
								<Text color="rgba(255,255,255,0.75)" fontSize="xs">
									Powered by ancient wisdom
								</Text>
							</Box>
						</Flex>
						<Box
							as="button"
							color="white"
							onClick={() => setIsOpen(false)}
							opacity={0.8}
							_hover={{ opacity: 1 }}
						>
							<IoClose size={20} />
						</Box>
					</Flex>

					{/* Messages */}
					<Box
						display="flex"
						flex={1}
						flexDirection="column"
						gap={3}
						overflowY="auto"
						p={4}
					>
						{messages.map((msg) => (
							<Flex
								align="flex-end"
								gap={2}
								justify={msg.role === "user" ? "flex-end" : "flex-start"}
								key={msg.id}
							>
								{msg.role === "bot" && (
									<Box
										bg="var(--chakra-colors-tertiary)"
										borderRadius="full"
										flexShrink={0}
										fontSize="14px"
										h="28px"
										lineHeight="28px"
										textAlign="center"
										w="28px"
									>
										🏛️
									</Box>
								)}
								<Box
									bg={
										msg.role === "user"
											? "var(--chakra-colors-primary)"
											: "var(--chakra-colors-background)"
									}
									borderRadius={
										msg.role === "user"
											? "18px 18px 4px 18px"
											: "18px 18px 18px 4px"
									}
									color={msg.role === "user" ? "white" : "var(--chakra-colors-text)"}
									fontSize="sm"
									maxW="80%"
									px={3}
									py={2}
								>
									{msg.text}
								</Box>
							</Flex>
						))}
						{isTyping && (
							<Flex align="flex-end" gap={2}>
								<Box
									bg="var(--chakra-colors-tertiary)"
									borderRadius="full"
									flexShrink={0}
									fontSize="14px"
									h="28px"
									lineHeight="28px"
									textAlign="center"
									w="28px"
								>
									🏛️
								</Box>
								<Box
									bg="var(--chakra-colors-background)"
									borderRadius="18px 18px 18px 4px"
									px={3}
									py={2}
								>
									<Flex gap={1}>
										{[0, 1, 2].map((i) => (
											<Box
												animation={`bounce 1.2s ease-in-out ${i * 0.15}s infinite`}
												bg="var(--chakra-colors-primary)"
												borderRadius="full"
												h="6px"
												key={i}
												w="6px"
											/>
										))}
									</Flex>
								</Box>
							</Flex>
						)}
					</Box>

					{/* Input */}
					<Box
						borderTop="1px solid var(--chakra-colors-tertiary)"
						p={3}
					>
						<Flex gap={2}>
							<Input
								bg="var(--chakra-colors-background)"
								border="1px solid var(--chakra-colors-tertiary)"
								borderRadius="full"
								color="var(--chakra-colors-text)"
								flex={1}
								fontSize="sm"
								onChange={(e) => setDraft(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Share your thoughts…"
								px={4}
								py={2}
								ref={inputRef}
								value={draft}
								_focus={{
									borderColor: "var(--chakra-colors-primary)",
									boxShadow: "0 0 0 2px rgba(137,130,255,0.2)",
								}}
							/>
							<Box
								as="button"
								alignItems="center"
								bg={draft.trim() ? "var(--chakra-colors-primary)" : "var(--chakra-colors-tertiary)"}
								borderRadius="full"
								color={draft.trim() ? "white" : "var(--chakra-colors-primary)"}
								cursor={draft.trim() ? "pointer" : "default"}
								display="flex"
								h="36px"
								justifyContent="center"
								onClick={handleSend}
								transition="all 0.15s"
								w="36px"
							>
								<IoSend size={15} />
							</Box>
						</Flex>
					</Box>
				</Box>
			)}

			{/* FAB */}
			<Box
				alignItems="center"
				as="button"
				bg="var(--chakra-colors-primary)"
				borderRadius="full"
				bottom={{ base: "24px", md: "32px" }}
				boxShadow="0 4px 20px 0 rgba(137,130,255,0.45)"
				color="white"
				display="flex"
				h="56px"
				justifyContent="center"
				onClick={() => setIsOpen((v) => !v)}
				position="fixed"
				right={{ base: "16px", md: "32px" }}
				transition="all 0.2s"
				w="56px"
				zIndex={1001}
				_hover={{
					transform: "scale(1.08)",
					boxShadow: "0 6px 24px 0 rgba(137,130,255,0.6)",
				}}
			>
				{isOpen ? <IoClose size={24} /> : <IoChatbubbleEllipses size={24} />}
			</Box>

			<style>{`
				@keyframes bounce {
					0%, 80%, 100% { transform: translateY(0); }
					40% { transform: translateY(-6px); }
				}
			`}</style>
		</>
	);
};

export default StoicBot;
