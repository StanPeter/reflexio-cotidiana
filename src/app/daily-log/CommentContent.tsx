import { Box, Slider, Text, Textarea } from "@chakra-ui/react";
import { motion } from "motion/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import Button from "../_components/UI/Button";
import type { IDailyReflectionsState } from "./page";

const MotionBox = motion(Box);

interface ICommentContentProps {
	logDate: Date | undefined;
	setLogDate: (logDate: Date | undefined) => void;
	setIsLoading: (isLoading: boolean) => void;
	dailyReflections: IDailyReflectionsState;
	refetchDailyReflections: () => void;
}

const CommentContent = ({
	logDate,
	setLogDate,
	setIsLoading,
	dailyReflections,
	refetchDailyReflections,
}: ICommentContentProps) => {
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
			// fill out skipped daily reflections if any
			for (const dailyReflection of [
				dailyReflections.threeDaysAgo,
				dailyReflections.twoDaysAgo,
				dailyReflections.fourDaysAgo,
			]) {
				if (dailyReflection.skipped) {
					await createDailyReflectionAsync({
						comment: null,
						logDate: dailyReflection.logDate,
						rating: 1, // just a placeholder
					});
				}
			}

			// fill out currently provided daily reflection
			await createDailyReflectionAsync({
				comment: isSkip ? null : dailyComment,
				rating: isSkip ? 1 : rating,
				logDate: // default to yesterday if no log date is provided
					logDate || new Date(new Date().setDate(new Date().getDate() - 1)),
			});

			// reset the log date
			refetchDailyReflections();
			setLogDate(undefined);
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
