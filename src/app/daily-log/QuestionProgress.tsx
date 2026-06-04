"use client";

import { Box, Flex, Progress, Steps, Text } from "@chakra-ui/react";

type QuestionProgressProps = {
	done: number;
	total: number;
};

const QuestionProgress = ({ done, total }: QuestionProgressProps) => {
	if (total === 0) return null;

	const percent = Math.round((done / total) * 100);
	const showSteps = total <= 8;

	return (
		<Box mb={{ base: 8, md: 12 }} maxW="520px" mx="auto" w="full">
			<Flex align="center" justify="space-between" mb={2}>
				<Text color="gray.600" fontSize="sm" fontWeight="medium">
					{done} of {total} answered
				</Text>
				<Box
					bg="var(--chakra-colors-primary)"
					borderRadius="md"
					color="white"
					fontSize="xs"
					fontWeight={700}
					px={2}
					py={0.5}
					position="relative"
				>
					{percent}%
				</Box>
			</Flex>

			<Progress.Root
				colorPalette="purple"
				shape="full"
				size="md"
				value={percent}
			>
				<Progress.Track
					bg="#e8e4ff"
					borderRadius="full"
					h="10px"
					overflow="hidden"
				>
					<Progress.Range
						bg="var(--chakra-colors-primary)"
						transition="width 0.4s ease"
					/>
				</Progress.Track>
			</Progress.Root>

			{showSteps && (
				<Steps.Root
					colorPalette="purple"
					count={total}
					mt={6}
					size="sm"
					step={done}
					variant="solid"
				>
					<Steps.List w="full">
						{Array.from({ length: total }).map((_, index) => (
							<Steps.Item index={index} key={index}>
								<Steps.Indicator />
								<Steps.Separator />
							</Steps.Item>
						))}
					</Steps.List>
				</Steps.Root>
			)}
		</Box>
	);
};

export default QuestionProgress;
