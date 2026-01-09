import { Box, Span, Text } from "@chakra-ui/react";

const Footer = () => {
	// const environment = process.env.DATABASE_URL?.includes("silence")
	// 	? "production"
	// 	: "development";

	return (
		<Box
			as="footer"
			backgroundColor="var(--chakra-colors-tertiary)"
			borderTop="1px solid var(--chakra-colors-secondary)"
			borderWidth={"0.5px"}
			boxShadow={"0 1px 3px 0px var(--chakra-colors-background)"}
			p="36px"
			width="100%"
		>
			<Text color="var(--chakra-colors-text)" textAlign="center">
				Copyright © 2025 Reflexio Cotidiana. All rights reserved.{" "}
				<Span color="var(--chakra-colors-text)" fontWeight={600}>
					NOT DONE YET
				</Span>
			</Text>
		</Box>
	);
};

export default Footer;
