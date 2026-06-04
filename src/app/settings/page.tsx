"use client";

import { Box, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import AccountSettings from "./AccountSettings";
import DailyLogSettings from "./DailyLogSettings";
import FormHeader, { type SettingsTab } from "./FormHeader";
import GoalsSettings from "./GoalsSettings";

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<SettingsTab>("daily-log");
	const {
		data: questions = [],
		isLoading: isLoadingQuestions,
		refetch: refetchQuestions,
	} = api.settings.getQuestions.useQuery();

	return (
		<Box
			maxW="860px"
			mx="auto"
			px={{ base: 4, md: 6 }}
			py={{ base: 12, md: 16 }}
			w={{ base: "100%", md: "80%", xl: "60%" }}
		>
			<FormHeader activeTab={activeTab} setActiveTab={setActiveTab} />
			<Box
				as="section"
				bg="white"
				border="1px solid var(--chakra-colors-secondary)"
				borderRadius="lg"
				borderTopLeftRadius={0}
				boxShadow="md"
				p={6}
				w="100%"
			>
				{activeTab === "daily-log" && (
					isLoadingQuestions ? (
						<Spinner
							alignSelf="center"
							color="var(--chakra-colors-primary)"
							display="flex"
							justifySelf="center"
							size="md"
						/>
					) : (
						<DailyLogSettings
							questions={questions}
							refetchQuestions={refetchQuestions}
						/>
					)
				)}
				{activeTab === "account" && <AccountSettings />}
				{activeTab === "goals" && <GoalsSettings />}
			</Box>
		</Box>
	);
}
