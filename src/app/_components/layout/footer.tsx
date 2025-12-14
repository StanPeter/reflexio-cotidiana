import { Box, Text } from "@chakra-ui/react";
import { PALLETE } from "@/constants";

const Footer = () => {
	return (
		<Box
			as="footer"
			bg="white"
			borderTop="1px solid #e0e0e0"
			bottom={0}
			left={0}
			p="36px"
			pos="absolute"
			right={0}
		>
			<Text
				color={PALLETE.text}
				fontSize="14px"
				fontWeight={400}
				letterSpacing="0.08em"
				textAlign="center"
			>
				Footer
			</Text>
		</Box>
	);
};

export default Footer;
