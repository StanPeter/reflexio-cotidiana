import { Box, Text } from "@chakra-ui/react";
import { motion } from "motion/react";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import Button from "../_components/UI/Button";
import type { IDailyReflectionsState, TCurrentContent } from "./page";

const MotionBox = motion(Box);

const MissedDailyContent = ({
	setCurrentContentSection,
	setLogDate,
	setDailyReflectionsState,
	dailyReflections,
}: {
	setCurrentContentSection: (section: TCurrentContent) => void;
	setLogDate: Dispatch<SetStateAction<Date | undefined>>;
	dailyReflections: IDailyReflectionsState;
	setDailyReflectionsState: (state: IDailyReflectionsState) => void;
}) => {
	const [latestLogDate, setLatestLogDate] = useState<Date | null>(null);
	const [currentLogCategory, setCurrentLogCategory] = useState<
		"threeDaysAgo" | "twoDaysAgo" | "fourDaysAgo" | null
	>(null);

	useEffect(() => {
		if (!dailyReflections.fourDaysAgo.checkedIn) {
			setLatestLogDate(dailyReflections.fourDaysAgo.logDate);
			setCurrentLogCategory("fourDaysAgo");
		} else if (!dailyReflections.threeDaysAgo.checkedIn) {
			setLatestLogDate(dailyReflections.threeDaysAgo.logDate);
			setCurrentLogCategory("threeDaysAgo");
		} else if (!dailyReflections.twoDaysAgo.checkedIn) {
			setLatestLogDate(dailyReflections.twoDaysAgo.logDate);
			setCurrentLogCategory("twoDaysAgo");
		}
	}, [dailyReflections]);

	const daysDifference = useMemo(() => {
		if (!latestLogDate) return 0;
		const diffDays = Math.floor(
			(Date.now() - latestLogDate.getTime()) / (1000 * 60 * 60 * 24),
		);
		return Math.min(4, Math.max(0, diffDays));
	}, [latestLogDate]);

	const onSkipHandler = async () => {
		setDailyReflectionsState({
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
		});
	};

	const onFillInHandler = async () => {
		if (!latestLogDate) {
			console.error("latestLogDate is null");
			return;
		}

		setLogDate(latestLogDate);
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
