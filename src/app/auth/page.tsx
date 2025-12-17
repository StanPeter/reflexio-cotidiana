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
	Icon,
	Input,
	Stack,
	Text,
} from "@chakra-ui/react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type SignInFormValues = {
	email: string;
	password: string;
	repeatPassword: string;
};

const MotionButton = motion(Button);
const MotionIcon = motion(Icon);

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
		defaultValues: { email: "", password: "", repeatPassword: "" },
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
				<Stack
					as="form"
					bg="white"
					borderRadius="lg"
					boxShadow="md"
					gap={4}
					onSubmit={handleSubmit(handleEmailPassword)}
				>
					<Box display="flex">
						<Button
							borderBottomLeftRadius={0}
							borderBottomRightRadius={0}
							borderTopRightRadius={0}
							onClick={() => setMode("signIn")}
							variant="outline"
							w={"50%"}
						>
							Sign In
						</Button>
						<Button
							borderBottomLeftRadius={0}
							borderBottomRightRadius={0}
							borderTopLeftRadius={0}
							onClick={() => setMode("signUp")}
							variant="outline"
							w={"50%"}
						>
							Sign Up
						</Button>
					</Box>
					<Box>
						<FieldRoot alignItems="center" invalid={!!errors.email}>
							<FieldLabel>Email</FieldLabel>
							<Input
								borderRadius={0}
								placeholder="you@example.com"
								textAlign="center"
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

						<FieldRoot alignItems="center" invalid={!!errors.password} mt={2}>
							<FieldLabel>Password</FieldLabel>
							<Input
								placeholder="••••••••"
								textAlign="center"
								type="password"
								{...register("password", {
									required: "Password is required",
									minLength: { value: 8, message: "At least 8 characters" },
								})}
							/>
							<FieldErrorText>{errors.password?.message}</FieldErrorText>
						</FieldRoot>

						{mode === "signUp" && (
							<FieldRoot alignItems="center" invalid={!!errors.password} mt={2}>
								<FieldLabel>Repeat Password</FieldLabel>
								<Input
									placeholder="••••••••"
									textAlign="center"
									type="password"
									{...register("repeatPassword", {
										required: "Repeat Password is required",
										minLength: { value: 8, message: "At least 8 characters" },
									})}
								/>
								<FieldErrorText>
									{errors.repeatPassword?.message}
								</FieldErrorText>
							</FieldRoot>
						)}
					</Box>

					<Button
						borderRadius={0}
						colorScheme="purple"
						loading={isSubmitting}
						type="submit"
					>
						{mode === "signIn" ? "Sign in" : "Sign up"}
					</Button>

					<Box alignItems="center" display="flex" justifyContent="center">
						<MotionButton
							backgroundColor="white"
							p={6}
							transition={{ duration: 0.5, ease: "easeInOut" }}
							variant="ghost"
							whileHover="hover"
						>
							<MotionIcon
								as={FcGoogle}
								height={6}
								transformOrigin="center"
								transition={{ duration: 0.5, ease: "easeInOut" }}
								variants={{ hover: { rotate: 360 } }}
								width={6}
							/>
						</MotionButton>
						<MotionButton
							backgroundColor="white"
							p={6}
							transition={{ duration: 0.5, ease: "easeInOut" }}
							variant="ghost"
							whileHover="hover"
						>
							<MotionIcon
								as={FaGithub}
								height={6}
								transformOrigin="center"
								transition={{ duration: 0.5, ease: "easeInOut" }}
								variants={{ hover: { rotate: 360 } }}
								width={6}
							/>
						</MotionButton>
					</Box>
				</Stack>
			</Stack>
		</Container>
	);
};

export default SignInPage;
