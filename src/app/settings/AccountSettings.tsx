import {
	Box,
	Button,
	FieldErrorText,
	FieldLabel,
	FieldRoot,
	Flex,
	Input,
	Stack,
	Table,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

type SettingsFormValues = {
	name: string;
	email: string;
};

type PasswordFormValues = {
	newPassword: string;
	confirmPassword: string;
};

const items = [
	{
		id: 1,
		question: "Have you watched any Netflix?",
		answers: ["1h", "More than 1h", "No"],
	},
	{
		id: 2,
		question: "Have you played any video games?",
		answers: ["Yes", "No"],
	},
	{
		id: 3,
		question: "Have you read any books?",
		answers: [
			"1 book",
			"2 books",
			"3 books",
			"4 books",
			"5 books",
			"6 books",
			"7 books",
			"8 books",
			"9 books",
			"10 books",
			"No",
		],
	},
	{
		id: 4,
		question: "Have you watched any movies?",
		answers: [
			"1 movie",
			"2 movies",
			"3 movies",
			"4 movies",
			"5 movies",
			"6 movies",
			"7 movies",
			"8 movies",
			"9 movies",
			"10 movies",
			"No",
		],
	},
	{
		id: 5,
		question: "Have you watched any TV shows?",
		answers: [
			"1 TV show",
			"2 TV shows",
			"3 TV shows",
			"4 TV shows",
			"5 TV shows",
			"6 TV shows",
			"7 TV shows",
			"8 TV shows",
			"9 TV shows",
			"10 TV shows",
			"No",
		],
	},
];

const AccountSettings = () => {
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
		<Box
			as="section"
			bg="white"
			borderRadius="lg"
			boxShadow="md"
			p={6}
			w="100%"
		>
			<Table.Root size="sm">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>Question</Table.ColumnHeader>
						<Table.ColumnHeader>Answers</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{items.map((item) => (
						<Table.Row key={item.id}>
							<Table.Cell>{item.question}</Table.Cell>
							<Table.Cell>{item.answers.join(", ")}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</Box>
	);
};

export default AccountSettings;
