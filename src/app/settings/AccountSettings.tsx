"use client";

import {
	Box,
	Dialog,
	FieldErrorText,
	FieldLabel,
	FieldRoot,
	Flex,
	Icon,
	Portal,
	Spinner,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { api } from "@/trpc/react";
import Button from "../_components/UI/Button";
import Form from "../_components/UI/Form";
import Input from "../_components/UI/Input";

type ProfileFormValues = { name: string; email: string };
type PasswordFormValues = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

const ChangePasswordDialog = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const changePassword = api.auth.changePassword.useMutation();
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
		control,
	} = useForm<PasswordFormValues>({
		defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
	});

	const onSubmit = async (values: PasswordFormValues) => {
		if (values.newPassword !== values.confirmPassword) {
			setError("confirmPassword", { message: "Passwords do not match" });
			return;
		}
		try {
			await changePassword.mutateAsync({
				currentPassword: values.currentPassword,
				newPassword: values.newPassword,
			});
			reset();
			onClose();
		} catch (err: any) {
			setError("currentPassword", {
				message: err?.message ?? "Something went wrong",
			});
		}
	};

	return (
		<Dialog.Root
			onOpenChange={onClose}
			open={isOpen}
			placement="center"
			size={{ mdDown: "full", md: "md" }}
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Change Password</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Box
								as="form"
								bg="var(--chakra-colors-background)"
								borderRadius="md"
								id="change-password-form"
								onSubmit={handleSubmit(onSubmit)}
								px={6}
								py={8}
							>
								<Stack gap={4}>
									<FieldRoot invalid={!!errors.currentPassword}>
										<FieldLabel>Current Password</FieldLabel>
										<Input
											placeholder="Enter current password"
											type="password"
											{...register("currentPassword", { required: "Required" })}
										/>
										<FieldErrorText>
											{errors.currentPassword?.message}
										</FieldErrorText>
									</FieldRoot>
									<FieldRoot invalid={!!errors.newPassword}>
										<FieldLabel>New Password</FieldLabel>
										<Input
											placeholder="At least 8 characters"
											type="password"
											{...register("newPassword", {
												required: "Required",
												minLength: {
													value: 8,
													message: "At least 8 characters",
												},
											})}
										/>
										<FieldErrorText>{errors.newPassword?.message}</FieldErrorText>
									</FieldRoot>
									<FieldRoot invalid={!!errors.confirmPassword}>
										<FieldLabel>Confirm New Password</FieldLabel>
										<Input
											placeholder="Repeat new password"
											type="password"
											{...register("confirmPassword", { required: "Required" })}
										/>
										<FieldErrorText>
											{errors.confirmPassword?.message}
										</FieldErrorText>
									</FieldRoot>
								</Stack>
							</Box>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button useCase="secondary">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button
								form="change-password-form"
								loading={isSubmitting}
								type="submit"
								useCase="primary"
							>
								Save
							</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<Button border="none" useCase="secondary">
								<Icon as={IoClose} />
							</Button>
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};

const AccountSettings = () => {
	const { data: user, isLoading } = api.auth.getUser.useQuery();
	const updateUser = api.auth.updateUser.useMutation();
	const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		setError,
		formState: { errors, isSubmitting },
		control,
	} = useForm<ProfileFormValues>({
		defaultValues: { name: "", email: "" },
	});

	useEffect(() => {
		if (user) {
			setValue("name", user.name ?? "");
			setValue("email", user.email ?? "");
		}
	}, [user, setValue]);

	const onSave = async (values: ProfileFormValues) => {
		try {
			await updateUser.mutateAsync({ name: values.name, email: values.email });
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3000);
		} catch (err: any) {
			setError("email", { message: err?.message ?? "Something went wrong" });
		}
	};

	if (isLoading) {
		return (
			<Flex justify="center" py={8}>
				<Spinner color="var(--chakra-colors-primary)" />
			</Flex>
		);
	}

	return (
		<>
			<Form control={control} onSubmit={(e: any) => handleSubmit(onSave)(e)} w="100%">
				<Stack gap={4}>
					<FieldRoot invalid={!!errors.name}>
						<FieldLabel>Name</FieldLabel>
						<Input
							placeholder="Your name"
							{...register("name", { required: "Name is required" })}
						/>
						<FieldErrorText>{errors.name?.message}</FieldErrorText>
					</FieldRoot>

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

					<Box
						bg="var(--chakra-colors-background)"
						border="1px solid var(--chakra-colors-tertiary)"
						borderRadius="md"
						p={4}
					>
						<Flex align="center" justify="space-between">
							<Box>
								<Text fontWeight="medium">Password</Text>
								<Text color="gray.500" fontSize="sm">
									Change your account password
								</Text>
							</Box>
							<Button
								onClick={() => setIsPasswordDialogOpen(true)}
								type="button"
								useCase="secondary"
							>
								Change password
							</Button>
						</Flex>
					</Box>

					<Flex align="center" gap={3} justify="flex-end">
						{saveSuccess && (
							<Text color="var(--chakra-colors-success)" fontSize="sm">
								Saved successfully!
							</Text>
						)}
						<Button loading={isSubmitting} type="submit" useCase="primary">
							Save changes
						</Button>
					</Flex>
				</Stack>
			</Form>

			<ChangePasswordDialog
				isOpen={isPasswordDialogOpen}
				onClose={() => setIsPasswordDialogOpen(false)}
			/>
		</>
	);
};

export default AccountSettings;
