import {
	Box,
	FieldErrorText,
	FieldLabel,
	FieldRoot,
	Flex,
	Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import Button from "../_components/UI/Button";
import Form from "../_components/UI/Form";
import Input from "../_components/UI/Input";

type SettingsFormValues = {
	name: string;
	email: string;
};

type PasswordFormValues = {
	newPassword: string;
	confirmPassword: string;
};

const AccountSettings = () => {
	const { data: user, isLoading: isLoadingUser } = api.auth.getUser.useQuery();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SettingsFormValues>({
		defaultValues: {
			name: "",
			email: "",
		},
	});

	const {
		register: registerPassword,
		handleSubmit: handlePasswordSubmit,
		formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
		control,
		watch,
		reset: resetPasswordForm,
		setError,
	} = useForm<PasswordFormValues>({
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSaveSettings = (values: SettingsFormValues) => {
		// TODO: wire up mutation
		console.log("Saved settings", values);
		// toast({ title: "Profile updated", status: "success" });
	};

	const onChangePassword = (values: PasswordFormValues) => {
		if (values.newPassword !== values.confirmPassword) {
			setError("confirmPassword", { message: "Passwords do not match" });
			return;
		}

		// TODO: wire up password change mutation
		console.log("Password change", values);
		// toast({ title: "Password updated", status: "success" });
		resetPasswordForm();
		// passwordDialog.onClose();
	};

	return (
		<Form control={control} onSubmit={handleSubmit(onSaveSettings)} w={"100%"}>
			<FieldRoot invalid={!!errors.name}>
				<FieldLabel>Name</FieldLabel>
				<Input
					placeholder="Your name"
					value={user?.name ?? ""}
					{...register("name", { required: "Name is required" })}
				/>
				<FieldErrorText>{errors.name?.message}</FieldErrorText>
			</FieldRoot>

			<FieldRoot invalid={!!errors.email}>
				<FieldLabel>Email</FieldLabel>
				<Input
					placeholder="you@example.com"
					type="email"
					value={user?.email ?? ""}
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

			<Flex align="center" justify="space-between">
				<Box>
					<Box fontWeight="medium">Password</Box>
					<Box color="gray.500" fontSize="sm">
						Manage password securely
					</Box>
				</Box>
				<Button onClick={() => {}} variant="outline">
					Change password
				</Button>
			</Flex>

			<Flex gap={3} justify="flex-end" pt={2}>
				<Button loading={isSubmitting} type="submit" useCase="primary">
					Save changes
				</Button>
			</Flex>
		</Form>
	);
};
export default AccountSettings;
