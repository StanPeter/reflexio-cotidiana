"use client";

import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import AccountSettings from "./AccountSettings";
import DailyLogSettings from "./DailyLogSettings";
import FormHeader from "./FormHeader";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

export default function SettingsPage() {
	const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] =
		useState(false);
	const [isDeleteQuestionDialogOpen, setIsDeleteQuestionDialogOpen] =
		useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState<
		| { id: string; question: string; points: number; isPositive: boolean }
		| undefined
	>(undefined);
	const [activeTab, setActiveTab] = useState<"daily-log" | "account">(
		"daily-log",
	);
	const {
		data: questions = [],
		isLoading: isLoadingQuestions,
		refetch: refetchQuestions,
	} = api.settings.getQuestions.useQuery();

	return (
		<Box
			maxW="960px"
			mx="auto"
			px={{ base: 4, md: 6 }}
			py={{ base: 12, md: 16 }}
			w="60%"
		>
			<FormHeader activeTab={activeTab} setActiveTab={setActiveTab} />
			<Box
				as="section"
				bg="white"
				border="1px solid var(--chakra-colors-secondary)"
				borderRadius="lg"
				borderTopLeftRadius={0}
				boxShadow="md"
				minWidth="600px"
				p={6}
				w="100%"
			>
				{isLoadingQuestions ? (
					<Spinner
						alignSelf="center"
						color="var(--chakra-colors-primary)"
						display="flex"
						justifySelf="center"
						size="md"
					/>
				) : (
					<>
						{activeTab === "daily-log" && (
							<DailyLogSettings
								questions={questions}
								refetchQuestions={refetchQuestions}
							/>
						)}
						{activeTab === "account" && <AccountSettings />}
					</>
				)}
			</Box>
		</Box>
	);
}
