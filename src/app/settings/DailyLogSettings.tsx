"use client";

import {
	Box,
	Button,
	Dialog,
	FieldErrorText,
	FieldLabel,
	FieldRoot,
	Flex,
	Input,
	Portal,
	Stack,
	Table,
} from "@chakra-ui/react";
import { ItemLabel } from "node_modules/@chakra-ui/react/dist/types/components/data-list/namespace";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";

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

const DeleteQuestionDialog = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	return (
		<Dialog.Root
			onOpenChange={onClose}
			open={isOpen}
			size={{ mdDown: "full", md: "lg" }}
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>
								Do you really want to delete this question?
							</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<p>Do you really want to delete this question?</p>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="outline">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button>Delete</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};

const EditQuestionDialog = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const [answers, setAnswers] = useState<string[]>([]);
	const trpc = api.useUtils();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ question: string; answers: string[] }>({
		defaultValues: {
			question: "",
			answers: [],
		},
	});

	// const onSubmit = (data: { question: string; answers: string[] }) => {
	// 	trpc.question.create.mutate({
	// 		question: data.question,
	// 	});
	// 	onClose();
	// };

	return (
		<Dialog.Root
			onOpenChange={onClose}
			open={isOpen}
			size={{ mdDown: "full", md: "lg" }}
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Edit Question</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<FieldRoot invalid={false}>
								<FieldLabel>Question</FieldLabel>
								<Input
									placeholder="Question"
									{...register("question", {
										required: "Question is required",
									})}
								/>
								<FieldErrorText>Question is required</FieldErrorText>
							</FieldRoot>
							{answers.map((answer, index) => (
								<FieldRoot invalid={!!errors.answers?.[index]} key={answer}>
									<FieldLabel>Answer {index + 1}</FieldLabel>
									<Input
										key={index + answer}
										{...register(`answers.${index}`, {
											required: "Answer is required",
										})}
										placeholder="Answer"
									/>
									<FieldErrorText>Answer is required</FieldErrorText>
								</FieldRoot>
							))}
							<Button onClick={() => setAnswers([...answers, ""])}>
								Add Answer
							</Button>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="outline">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button>Save</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<Button variant="outline">Cancel</Button>
						</Dialog.CloseTrigger>
						<Button>Save</Button>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};

const DailyLogSettings = () => {
	const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] =
		useState(false);
	const [isDeleteQuestionDialogOpen, setIsDeleteQuestionDialogOpen] =
		useState(false);

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

	const handleEditQuestion = (question: string) => {
		console.log("Edit question", question);
		setIsEditQuestionDialogOpen(true);
	};

	const handleDeleteQuestion = (question: string) => {
		console.log("Delete question", question);
		setIsDeleteQuestionDialogOpen(true);
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
						<Table.ColumnHeader></Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{items.map((item) => (
						<Table.Row key={item.id}>
							<Table.Cell>{item.question}</Table.Cell>
							<Table.Cell>{item.answers.join(", ")}</Table.Cell>
							<Table.Cell>
								<Button onClick={() => handleEditQuestion(item.question)}>
									Edit
								</Button>
							</Table.Cell>
							<Table.Cell>
								<Button onClick={() => handleDeleteQuestion(item.question)}>
									Delete
								</Button>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
			<EditQuestionDialog
				isOpen={isEditQuestionDialogOpen}
				onClose={() => setIsEditQuestionDialogOpen(false)}
			/>
			<DeleteQuestionDialog
				isOpen={isDeleteQuestionDialogOpen}
				onClose={() => setIsDeleteQuestionDialogOpen(false)}
			/>
			<Button onClick={() => setIsEditQuestionDialogOpen(true)}>
				Add Question
			</Button>
		</Box>
	);
};

export default DailyLogSettings;
