"use client";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import AccountSettings from "./AccountSettings";
import DailyLogSettings from "./DailyLogSettings";
import FormHeader from "./FormHeader";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<"daily-log" | "account">(
		"daily-log",
	);

	return (
		<Box
			maxW="960px"
			mx="auto"
			px={{ base: 4, md: 6 }}
			py={{ base: 12, md: 16 }}
		>
			<FormHeader activeTab={activeTab} setActiveTab={setActiveTab} />
			{activeTab === "daily-log" && <DailyLogSettings />}
			{activeTab === "account" && <AccountSettings />}
		</Box>
	);
}
