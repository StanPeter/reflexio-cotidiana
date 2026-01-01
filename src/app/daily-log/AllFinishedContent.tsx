import { Box, Text } from "@chakra-ui/react";
import { motion } from "motion/react";
import Link from "next/link";
import Button from "../_components/UI/Button";

const MotionBox = motion(Box);

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

const AllFinishedContent = () => (
	<MotionBox
		animate={{ opacity: 1, scale: 1 }}
		exit={{ opacity: 0 }}
		initial={{ opacity: 0, scale: 0.98 }}
		key="finished"
		transition={{ duration: 0.2 }}
	>
		<Text color={palette.text} fontSize="lg" fontWeight="700" mb={4}>
			All questions answered
		</Text>
		<Text color="gray.600" mb={4}>
			Thanks for logging today.
		</Text>
		<Box>
			<Button m={2} useCase="secondary">
				<Link href="/settings">Add questions</Link>
			</Button>
			<Button m={2} useCase="primary">
				<Link href="/statistics">Check your stats</Link>
			</Button>
		</Box>
	</MotionBox>
);

export default AllFinishedContent;
