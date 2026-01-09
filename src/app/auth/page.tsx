"use client";

import {
	Box,
	Container,
	FieldErrorText,
	FieldLabel,
	FieldRoot,
	Icon,
	Text,
} from "@chakra-ui/react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
	type FormSubmitHandler,
	type SubmitHandler,
	useForm,
} from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { api } from "@/trpc/react";
import Button from "../_components/UI/Button";
import Form from "../_components/UI/Form";
import Input from "../_components/UI/Input";

type SignInUpFormValues = {
	email: string;
	password: string;
	repeatPassword?: string;
};

const MotionButton = motion(Button);
const MotionIcon = motion(Icon);

const SignInPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/daily-log";
	const { status } = useSession();
	const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
	const { mutateAsync: registerUser } = api.auth.register.useMutation();
	const { mutateAsync: signInUser } = api.auth.signIn.useMutation();

	const {
		register,
		control,
		formState: { errors, isSubmitting },
	} = useForm<SignInUpFormValues>({
		defaultValues: { email: "", password: "", repeatPassword: "" },
	});

	// If already signed in, redirect to target.
	useEffect(() => {
		if (status === "authenticated") {
			void router.replace(callbackUrl);
		}
	}, [status, router, callbackUrl]);

	const handleSignInUp: SubmitHandler<SignInUpFormValues> = async ({
		email,
		password,
		repeatPassword,
	}) => {
		// No credentials provider configured yet; show a friendly notice.
		console.log("Email/password submission", email, password, repeatPassword);

		if (mode === "signIn") {
			const { success } = await signInUser({ email, password });

			if (success) {
				const res = await signIn("credentials", {
					email,
					password,
				});
				console.log(res);
				if (!res?.error) router.refresh();
			}
		} else {
			const { success } = await registerUser({
				email,
				password,
				repeatPassword: repeatPassword ?? "",
			});

			if (success) {
				const res = await signIn("credentials", {
					email,
					password,
				});
				console.log(res);
				if (!res?.error) router.refresh();
			}
		}
	};

	const onSubmit: FormSubmitHandler<SignInUpFormValues> = async ({ data }) => {
		await handleSignInUp(data);
	};

	if (status === "authenticated") {
		return (
			<Container centerContent maxW="md" py={16}>
				<Text>Redirecting…</Text>
			</Container>
		);
	}

	return (
		<Form control={control} onSubmit={onSubmit}>
			{/* <!-- Mode Toggle Buttons --> */}
			<Box display="flex">
				<Button
					borderBottomLeftRadius={0}
					borderBottomRightRadius={0}
					borderLeftWidth={0}
					borderTopRightRadius={0}
					borderTopWidth={0}
					onClick={() => setMode("signIn")}
					useCase={mode === "signIn" ? "primary" : "secondary"}
					w={"50%"}
				>
					Sign In
				</Button>
				<Button
					borderBottomLeftRadius={0}
					borderBottomRightRadius={0}
					borderRightWidth={0}
					borderTopLeftRadius={0}
					borderTopWidth={0}
					onClick={() => setMode("signUp")}
					useCase={mode === "signUp" ? "primary" : "secondary"}
					w={"50%"}
				>
					Sign Up
				</Button>
			</Box>

			<Box marginY={1} paddingY={2}>
				{/* <!-- Email/Password Form --> */}
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
						borderRadius={0}
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
							borderRadius={0}
							placeholder="••••••••"
							textAlign="center"
							type="password"
							{...register("repeatPassword", {
								required: "Repeat Password is required",
								minLength: { value: 8, message: "At least 8 characters" },
							})}
						/>
						<FieldErrorText>{errors.repeatPassword?.message}</FieldErrorText>
					</FieldRoot>
				)}
			</Box>

			{/* <!-- Submit Button --> */}
			<Button
				borderRadius={0}
				loading={isSubmitting}
				type="submit"
				useCase="primary"
				width="100%"
			>
				{mode === "signIn" ? "Sign in" : "Sign up"}
			</Button>

			{/* <!-- Social Sign In Buttons --> */}
			<Box
				alignItems="center"
				display="flex"
				justifyContent="center"
				marginY={2}
			>
				<MotionButton
					_hover={{
						boxShadow: "none",
						scale: 1.05,
					}}
					backgroundColor="white"
					onClick={() => signIn("google")}
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
					_hover={{
						boxShadow: "none",
						scale: 1.05,
					}}
					backgroundColor="white"
					onClick={() => signIn("github")}
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
		</Form>
	);
};

export default SignInPage;
