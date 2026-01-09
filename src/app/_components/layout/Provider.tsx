"use client";

import {
	ChakraProvider,
	createSystem,
	defaultConfig,
	defineConfig,
} from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { globalCss, theme } from "@/app/constants/chakraUITheme";
import { TRPCReactProvider } from "@/trpc/react";
import MainBody from "./MainBody";

type Props = {
	children: React.ReactNode;
};

const config = defineConfig({
	globalCss: globalCss,
	theme: theme,
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
