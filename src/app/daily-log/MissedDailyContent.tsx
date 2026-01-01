import { Box, Text } from "@chakra-ui/react";
import { motion } from "motion/react";
import { useMemo } from "react";
import Button from "../_components/UI/Button";

const MotionBox = motion(Box);

const MissedDailyContent = ({
	setLogDate,
	setDailyLogThreeDaysHistory,
	dailyLogThreeDaysHistory,
}: {
	setLogDate: (date: Date | null) => void;
	dailyLogThreeDaysHistory: {
		threeDaysAgo: { checkedIn: boolean; changed: boolean };
		twoDaysAgo: { checkedIn: boolean; changed: boolean };
		fourDaysAgo: { checkedIn: boolean; changed: boolean };
	};
	setDailyLogThreeDaysHistory: (history: {
		threeDaysAgo: { checkedIn: boolean; changed: boolean };
		twoDaysAgo: { checkedIn: boolean; changed: boolean };
		fourDaysAgo: { checkedIn: boolean; changed: boolean };
	}) => void;
}) => {
	let latestLogDate: Date | null = null;
	let currentLogCategory: "threeDaysAgo" | "twoDaysAgo" | "fourDaysAgo" | null =
		null;

	if (!dailyLogThreeDaysHistory.fourDaysAgo.checkedIn) {
		latestLogDate = new Date(Date.now() - 4 * 86400000);
		currentLogCategory = "fourDaysAgo";
	} else if (!dailyLogThreeDaysHistory.threeDaysAgo.checkedIn) {
		latestLogDate = new Date(Date.now() - 3 * 86400000);
		currentLogCategory = "threeDaysAgo";
	} else if (!dailyLogThreeDaysHistory.twoDaysAgo.checkedIn) {
		latestLogDate = new Date(Date.now() - 2 * 86400000);
		currentLogCategory = "twoDaysAgo";
	}

	const daysDifference = useMemo(() => {
		if (!latestLogDate) return 0;
		return Math.ceil(
			(new Date().getTime() - latestLogDate.getTime()) / (1000 * 60 * 60 * 24),
		);
	}, [latestLogDate]);

	const onNoHandler = async () => {
		setDailyLogThreeDaysHistory({
			fourDaysAgo:
				currentLogCategory === "fourDaysAgo"
					? { checkedIn: true, changed: true }
					: dailyLogThreeDaysHistory.fourDaysAgo,
			twoDaysAgo:
				currentLogCategory === "twoDaysAgo"
					? { checkedIn: true, changed: true }
					: dailyLogThreeDaysHistory.twoDaysAgo,
			threeDaysAgo:
				currentLogCategory === "threeDaysAgo"
					? { checkedIn: true, changed: true }
					: dailyLogThreeDaysHistory.threeDaysAgo,
		});
	};

	const onYesHandler = async () => {
		if (!latestLogDate) {
			console.error("latestLogDate is null");
			return;
		}

		setLogDate(latestLogDate);
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
				<Button m={2} onClick={onNoHandler} useCase="secondary">
					No, thanks
				</Button>
				<Button m={2} onClick={onYesHandler} useCase="primary">
					Yes, fill it in now
				</Button>
			</Box>
		</MotionBox>
	);
};

export default MissedDailyContent;
