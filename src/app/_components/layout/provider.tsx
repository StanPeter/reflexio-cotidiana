"use client";

import {
	ChakraProvider,
	createSystem,
	defaultConfig,
	defineConfig,
} from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { PALLETE } from "@/constants";
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
					<MainBody>{children}</MainBody>
				</ChakraProvider>
			</SessionProvider>
		</TRPCReactProvider>
	);
};

export default Provider;
