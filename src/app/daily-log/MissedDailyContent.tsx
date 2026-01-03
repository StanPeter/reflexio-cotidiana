import { Box, Text } from "@chakra-ui/react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import Button from "../_components/UI/Button";
import type { IDailyReflectionsState, TCurrentContent } from "./page";

const MotionBox = motion(Box);

const MissedDailyContent = ({
	setCurrentContentSection,
	setLogDate,
	setDailyReflectionsState,
	dailyReflections,
	setCurrentIndex,
}: {
	setCurrentContentSection: (section: TCurrentContent) => void;
	setLogDate: (date?: Date) => void;
	dailyReflections: IDailyReflectionsState;
	setDailyReflectionsState: (state: IDailyReflectionsState) => void;
	setCurrentIndex: (index: number) => void;
}) => {
	const [selectedLogDate, setSelectedLogDate] = useState<Date | null>(null);
	const [currentLogCategory, setCurrentLogCategory] = useState<
		"threeDaysAgo" | "twoDaysAgo" | "fourDaysAgo" | null
	>(null);

	useEffect(() => {
		if (!dailyReflections.fourDaysAgo.checkedIn) {
			setSelectedLogDate(dailyReflections.fourDaysAgo.logDate);
			setCurrentLogCategory("fourDaysAgo");
		} else if (!dailyReflections.threeDaysAgo.checkedIn) {
			setSelectedLogDate(dailyReflections.threeDaysAgo.logDate);
			setCurrentLogCategory("threeDaysAgo");
		} else if (!dailyReflections.twoDaysAgo.checkedIn) {
			setSelectedLogDate(dailyReflections.twoDaysAgo.logDate);
			setCurrentLogCategory("twoDaysAgo");
		}
	}, [dailyReflections]);

	const daysDifference = useMemo(() => {
		if (!selectedLogDate) return 0;
		const diffDays = Math.floor(
			(Date.now() - selectedLogDate.getTime()) / (1000 * 60 * 60 * 24),
		);
		return Math.min(4, Math.max(0, diffDays));
	}, [selectedLogDate]);

	const onSkipHandler = async () => {
		const nextState: IDailyReflectionsState = {
			fourDaysAgo:
				currentLogCategory === "fourDaysAgo"
					? { ...dailyReflections.fourDaysAgo, checkedIn: true, skipped: true }
					: dailyReflections.fourDaysAgo,
			twoDaysAgo:
				currentLogCategory === "twoDaysAgo"
					? { ...dailyReflections.twoDaysAgo, checkedIn: true, skipped: true }
					: dailyReflections.twoDaysAgo,
			threeDaysAgo:
				currentLogCategory === "threeDaysAgo"
					? { ...dailyReflections.threeDaysAgo, checkedIn: true, skipped: true }
					: dailyReflections.threeDaysAgo,
		};

		setDailyReflectionsState(nextState);

		const allChecked =
			nextState.fourDaysAgo.checkedIn &&
			nextState.threeDaysAgo.checkedIn &&
			nextState.twoDaysAgo.checkedIn;

		if (allChecked) {
			setCurrentIndex(0);
			setLogDate(new Date(Date.now() - 1 * 86400000));
			setCurrentContentSection("question");
		}
	};

	const onFillInHandler = async () => {
		if (!selectedLogDate) {
			console.error("selectedLogDate is null");
			return;
		}

		setLogDate(selectedLogDate);
		setCurrentIndex(0);
		setCurrentContentSection("question");
	};

	const currentDialogKey = currentLogCategory ?? "none";

	return (
		<MotionBox
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0 }}
			initial={{ opacity: 0, scale: 0.98 }}
			key={currentDialogKey}
			transition={{ duration: 0.8 }}
		>
			<Text
				color={"var(--chakra-colors-text)"}
				fontSize="lg"
				fontWeight="700"
				mb={4}
			>
				It seems like you missed a daily log {daysDifference} days ago.
			</Text>
			<Text color="gray.600" mb={4}>
				Would you like to fill it in now?
			</Text>
			<Box>
				<Button m={2} onClick={onSkipHandler} useCase="secondary">
					Skip
				</Button>
				<Button m={2} onClick={onFillInHandler} useCase="primary">
					Fill in now
				</Button>
			</Box>
		</MotionBox>
	);
};

export default MissedDailyContent;
