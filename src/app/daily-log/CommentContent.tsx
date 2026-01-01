import { Box, Slider, Text, Textarea } from "@chakra-ui/react";
import { motion } from "motion/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import Button from "../_components/UI/Button";

const MotionBox = motion(Box);

interface DailyLogThreeDaysHistory {
	threeDaysAgo: { checkedIn: boolean; changed: boolean };
	twoDaysAgo: { checkedIn: boolean; changed: boolean };
	fourDaysAgo: { checkedIn: boolean; changed: boolean };
}

interface CommentContentProps {
	setIsLoading: (isLoading: boolean) => void;
	dailyLogThreeDaysHistory: DailyLogThreeDaysHistory;
	setDailyLogThreeDaysHistory: (
		dailyLogThreeDaysHistory: DailyLogThreeDaysHistory,
	) => void;
	setFinishedDailyComment: (finishedDailyComment: boolean) => void;
}

const CommentContent = ({
	setIsLoading,
	dailyLogThreeDaysHistory,
	setDailyLogThreeDaysHistory,
	setFinishedDailyComment,
}: CommentContentProps) => {
	const [dailyComment, setDailyComment] = useState("");
	const [rating, setRating] = useState<number>(40);
	const [ratingPosition, setRatingPosition] = useState<number>(40);
	const { mutateAsync: createDailyReflectionAsync } =
		api.dailyLog.createDailyReflection.useMutation();

	const handleCommentSubmit = async (isSkip: boolean = false) => {
		if (!rating || (!dailyComment && !isSkip)) {
			console.log("rating or dailyComment is missing");
			return;
		}

		setIsLoading(true);

		// create daily reflections for the last 3 days if they are checked in and changed
		try {
			for (const [key, dailyLog] of Object.entries(dailyLogThreeDaysHistory)) {
				if (dailyLog.checkedIn && dailyLog.changed) {
					await createDailyReflectionAsync({
						comment: null,
						rating: rating,
						logDate: new Date(
							Date.now() -
								(Object.keys(dailyLogThreeDaysHistory).indexOf(key) + 1) *
									86400000,
						),
					});
				}
			}

			setDailyLogThreeDaysHistory({
				threeDaysAgo: { checkedIn: true, changed: false },
				twoDaysAgo: { checkedIn: true, changed: false },
				fourDaysAgo: { checkedIn: true, changed: false },
			});

			const response = await createDailyReflectionAsync({
				comment: isSkip ? null : dailyComment,
				rating: rating,
			});

			if (response.success) {
				setFinishedDailyComment(true);
			} else {
				console.error(response.error);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<MotionBox
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0 }}
			initial={{ opacity: 0, scale: 0.98 }}
			key="finished"
			transition={{ duration: 0.2 }}
		>
			<Box alignItems="center" display="flex" justifyContent="center" mb={2}>
				<Text
					color={"var(--chakra-colors-text)"}
					fontSize="lg"
					fontWeight="700"
					mr={2}
				>
					How do you feel about the day overall?
				</Text>
				<Button
					borderRadius="full"
					onClick={() => handleCommentSubmit(true)}
					size={"xs"}
					useCase="secondary"
				>
					Skip
				</Button>
			</Box>
			<Box
				display="inline-block"
				minWidth={"100%"}
				mx="auto"
				position="relative"
			>
				<Textarea
					backgroundColor="white"
					border="2px solid"
					borderColor="var(--chakra-colors-secondary)"
					borderRadius="lg"
					minWidth={"100%"}
					onChange={(e) => setDailyComment(e.target.value)}
					placeholder="Write your comment here"
					rows={4}
				/>
			</Box>
			<Slider.Root
				defaultValue={[40]}
				mb={6}
				mt={2}
				onValueChange={(value) => {
					if (value.value[0]) {
						setRatingPosition(value.value[0]);
					}
				}}
				onValueChangeEnd={(value) => {
					if (value.value[0]) {
						setRating(value.value[0]);
					}
				}}
				size="lg"
				value={[ratingPosition]}
			>
				<Slider.Label>Day Rating ({ratingPosition}%)</Slider.Label>
				<Slider.Control>
					<Slider.Track
						bg="var(--chakra-colors-background)"
						border={"1px solid var(--chakra-colors-secondary)"}
					>
						<Slider.Range
							bg="var(--chakra-colors-secondary)"
							border={"1px solid var(--chakra-colors-secondary)"}
						/>
					</Slider.Track>
					<Slider.Thumbs bg={"var(--chakra-colors-primary)"} border={"none"} />
				</Slider.Control>
			</Slider.Root>
			<Button
				disabled={!rating}
				onClick={() => handleCommentSubmit(false)}
				useCase="primary"
			>
				Finish!
			</Button>
		</MotionBox>
	);
};

export default CommentContent;
