"use client";

import {
	Box,
	Button,
	Container,
	FieldErrorText,
	FieldLabel,
	FieldRoot,
	Flex,
	Heading,
	Input,
	Stack,
	Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type SignInFormValues = {
	email: string;
	password: string;
};

const SignInPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/daily-log";
	const { status } = useSession();
	const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<SignInFormValues>({
		defaultValues: { email: "", password: "" },
	});

	// If already signed in, redirect to target.
	useEffect(() => {
		if (status === "authenticated") {
			void router.replace(callbackUrl);
		}
	}, [status, router, callbackUrl]);

	const handleEmailPassword = async (values: SignInFormValues) => {
		// No credentials provider configured yet; show a friendly notice.
		console.log("Email/password submission", values);
	};

	const handleProvider = async (provider: "google" | "github") => {
		await signIn(provider, { callbackUrl });
	};

	if (status === "authenticated") {
		return (
			<Container centerContent maxW="md" py={16}>
				<Text>Redirecting…</Text>
			</Container>
		);
	}

	return (
		<Container maxW="lg" py={16}>
			<Stack gap={8}>
				<Box textAlign="center">
					<Heading size="lg">Welcome back</Heading>
					<Text color="gray.600" mt={2}>
						Sign in to continue your daily reflections.
					</Text>
				</Box>

				<Stack
					as="form"
					bg="white"
					borderRadius="lg"
					boxShadow="md"
					gap={4}
					onSubmit={handleSubmit(handleEmailPassword)}
					p={6}
				>
					<FieldRoot invalid={!!errors.email}>
						<FieldLabel>Email</FieldLabel>
						<Input
							placeholder="you@example.com"
							type="email"
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: "Enter a valid email",
								},
							})}
						/>
						<FieldErrorText>{errors.email?.message}</FieldErrorText>
					</FieldRoot>

					<FieldRoot invalid={!!errors.password}>
						<FieldLabel>Password</FieldLabel>
						<Input
							placeholder="••••••••"
							type="password"
							{...register("password", {
								required: "Password is required",
								minLength: { value: 8, message: "At least 8 characters" },
							})}
						/>
						<FieldErrorText>{errors.password?.message}</FieldErrorText>
					</FieldRoot>

					<Button colorScheme="purple" loading={isSubmitting} type="submit">
						{mode === "signIn" ? "Continue with email" : "Sign up with email"}
					</Button>

					<Text color="gray.500" fontSize="sm">
						Email/password login will be enabled soon. In the meantime, use a
						provider below.
					</Text>

					<Box borderColor="gray.100" borderTop="1px solid" />

					<Stack gap={3}>
						<Button
							justifyContent="center"
							onClick={() => handleProvider("google")}
							variant="outline"
						>
							{mode === "signIn"
								? "Continue with Google"
								: "Sign up with Google"}
						</Button>
						<Button
							justifyContent="center"
							onClick={() => handleProvider("github")}
							variant="outline"
						>
							{mode === "signIn"
								? "Continue with GitHub"
								: "Sign up with GitHub"}
						</Button>
					</Stack>
				</Stack>

				<Flex justify="center">
					<Text color="gray.600" fontSize="sm">
						Need an account?{" "}
						<Button
							onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
						>
							{mode === "signIn" ? "Sign up" : "Sign in"}
						</Button>
					</Text>
				</Flex>
			</Stack>
		</Container>
	);
};

export default SignInPage;
