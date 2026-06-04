"use client";

import { Tabs } from "@chakra-ui/react";

export type LogArea = "daily" | "work" | "eyes";

const AREA_ITEMS: { value: LogArea; label: string }[] = [
	{ value: "daily", label: "Daily" },
	{ value: "work", label: "Work" },
	{ value: "eyes", label: "Eyes Health" },
];

export const AREA_LABELS = Object.fromEntries(
	AREA_ITEMS.map(({ value, label }) => [value, label]),
) as Record<LogArea, string>;

type LogAreaTabsProps = {
	activeArea: LogArea;
	onAreaChange: (area: LogArea) => void;
};

const LogAreaTabs = ({ activeArea, onAreaChange }: LogAreaTabsProps) => (
	<Tabs.Root
		colorPalette="purple"
		onValueChange={(e) => onAreaChange(e.value as LogArea)}
		size="md"
		value={activeArea}
		variant="enclosed"
		width="fit-content"
		mx="auto"
		mb={8}
	>
		<Tabs.List
			bg="white"
			border="1px solid var(--chakra-colors-tertiary)"
			borderRadius="full"
			boxShadow="sm"
			gap={1}
			p={1}
		>
			{AREA_ITEMS.map(({ value, label }) => (
				<Tabs.Trigger
					_selected={{
						bg: "var(--chakra-colors-primary)",
						color: "white",
						boxShadow: "sm",
					}}
					borderRadius="full"
					color="var(--chakra-colors-text)"
					fontWeight="600"
					key={value}
					px={5}
					py={2}
					value={value}
				>
					{label}
				</Tabs.Trigger>
			))}
			<Tabs.Indicator bg="transparent" display="none" />
		</Tabs.List>
	</Tabs.Root>
);

export default LogAreaTabs;
