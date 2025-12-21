"use client";

import {
	ChakraProvider,
	createSystem,
	defaultConfig,
	defineConfig,
} from "@chakra-ui/react";
import { ThemeProvider } from "@emotion/react";
import { SessionProvider } from "next-auth/react";
import { PALLETE, theme } from "@/constants";
import { TRPCReactProvider } from "@/trpc/react";
import MainBody from "./MainBody";

type Props = {
	children: React.ReactNode;
};

const config = defineConfig({
	globalCss: {},
	theme: {
		tokens: {
			colors: {
				primary: { value: PALLETE.primary },
				secondary: { value: PALLETE.secondary },
				background: { value: PALLETE.background },
				text: { value: PALLETE.text },
			},
		},
	},
});

const system = createSystem(defaultConfig, config);

const Provider = ({ children }: Props) => {
	return (
		<TRPCReactProvider>
			<SessionProvider>
				<ChakraProvider value={system}>
					<ThemeProvider theme={theme}>
						<MainBody>{children}</MainBody>
					</ThemeProvider>
				</ChakraProvider>
			</SessionProvider>
		</TRPCReactProvider>
	);
};

export default Provider;
