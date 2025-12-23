"use client";

import {
	Box,
	Button,
	Dialog,
	FieldErrorText,
	FieldLabel,
	FieldRoot,
	Icon,
	Input,
	Portal,
	Spinner,
	Switch,
	SwitchRoot,
	Table,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuMessageCircleQuestion } from "react-icons/lu";
import { api } from "@/trpc/react";

type SettingsFormValues = {
	name: string;
	email: string;
};

type PasswordFormValues = {
	newPassword: string;
	confirmPassword: string;
};

const DeleteQuestionDialog = ({
	isOpen,
	onClose,
	question,
	refetchQuestions,
}: {
	isOpen: boolean;
	onClose: () => void;
	question?: {
		id: string;
		question: string;
		points: number;
		isPositive: boolean;
	};
	refetchQuestions: () => void;
}) => {
	const deleteQuestionMutation = api.settings.deleteQuestion.useMutation();

	const handleDeleteQuestion = () => {
		if (!question) return;

		deleteQuestionMutation.mutate(
			{ id: question.id },
			{
				onSuccess: () => {
					onClose();
					refetchQuestions();
				},
				onError: (error) => {
					console.error(error);
				},
			},
		);
	};
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
								Do you really want to delete this question: {question?.question}
								?
							</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<p>
								Do you really want to delete this question: {question?.question}
								?
							</p>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="outline">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button onClick={handleDeleteQuestion}>Delete</Button>
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
	question,
	refetchQuestions,
}: {
	isOpen: boolean;
	onClose: () => void;
	question?: {
		id: string;
		question: string;
		points: number;
		isPositive: boolean;
	};
	refetchQuestions: () => void;
}) => {
	const createQuestionMutation = api.settings.createQuestion.useMutation();
	const updateQuestionMutation = api.settings.updateQuestion.useMutation();

	const {
		register,
		handleSubmit,
		getValues,
		trigger,
		setValue,
		formState: { errors },
	} = useForm<{ question: string; points: number; isPositive: boolean }>({});

	useEffect(() => {
		if (question) {
			setValue("question", question.question);
			setValue("points", question.points);
			setValue("isPositive", question.isPositive);
		}
	}, [question, setValue]);

	const onSubmit = (data: {
		question: string;
		points: number;
		isPositive: boolean;
	}) => {
		if (question?.id) {
			updateQuestionMutation.mutate({
				id: question.id,
				question: data.question,
				points: data.points ? Number(data.points) : 10,
				isPositive: !!data.isPositive,
			});
		} else {
			createQuestionMutation.mutate({
				question: data.question,
				points: data.points ? Number(data.points) : 10,
				isPositive: data.isPositive,
			});
		}
		onClose();
	};

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
							<FieldRoot>
								<FieldLabel>Points</FieldLabel>
								<Box w="100%">
									<Input
										placeholder="Points"
										{...register("points", {
											required: "Points is required",
										})}
									/>
									<Icon
										as={LuMessageCircleQuestion}
										position={"absolute"}
										right={2}
										top={10}
									/>
								</Box>
								<FieldErrorText>Points is required</FieldErrorText>
							</FieldRoot>
							<SwitchRoot checked={getValues("isPositive")}>
								<Switch.HiddenInput
									{...register("isPositive")}
									onChange={(d) => {
										register("isPositive").onChange(d);
										trigger("isPositive");
									}}
								/>
								<Switch.Control />
								<Switch.Label>Is Positive</Switch.Label>
							</SwitchRoot>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="outline">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button onClick={handleSubmit(onSubmit)}>Save</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<Button variant="outline">Cancel</Button>
						</Dialog.CloseTrigger>
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
	const [selectedQuestion, setSelectedQuestion] = useState<
		| { id: string; question: string; points: number; isPositive: boolean }
		| undefined
	>(undefined);
	const {
		data: questions = [],
		isLoading: isLoadingQuestions,
		refetch: refetchQuestions,
	} = api.settings.getQuestions.useQuery();

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

	const handleEditQuestion = (questionId: string) => {
		setSelectedQuestion(
			questions.find((question) => question.id === questionId),
		);
		setIsEditQuestionDialogOpen(true);
	};

	const handleDeleteQuestion = (questionId: string) => {
		setSelectedQuestion(
			questions.find((question) => question.id === questionId),
		);
		setIsDeleteQuestionDialogOpen(true);
	};

	return (
		<Box
			as="section"
			bg="white"
			borderRadius="lg"
			boxShadow="md"
			minWidth="600px"
			p={6}
			w="100%"
		>
			{isLoadingQuestions ? (
				<Spinner size="sm" />
			) : (
				<Table.Root size="sm">
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>Question</Table.ColumnHeader>
							<Table.ColumnHeader>Points</Table.ColumnHeader>
							<Table.ColumnHeader></Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{questions?.map((questionItem) => (
							<Table.Row key={questionItem.id}>
								<Table.Cell>{questionItem.question}</Table.Cell>
								<Table.Cell>{questionItem.points}</Table.Cell>
								<Table.Cell>
									<Button
										_hover={{
											backgroundColor: "var(--chakra-colors-primary)",
											boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
										}}
										backgroundColor="var(--chakra-colors-secondary)"
										marginRight={2}
										onClick={() => handleEditQuestion(questionItem.id)}
										size="sm"
										variant="solid"
									>
										Edit
									</Button>
									<Button
										_hover={{
											opacity: 1,
											boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
										}}
										backgroundColor="var(--chakra-colors-danger)"
										onClick={() => handleDeleteQuestion(questionItem.id)}
										opacity={0.8}
										size="sm"
										variant="solid"
									>
										Delete
									</Button>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			)}
			<EditQuestionDialog
				isOpen={isEditQuestionDialogOpen}
				onClose={() => setIsEditQuestionDialogOpen(false)}
				question={selectedQuestion}
				refetchQuestions={refetchQuestions}
			/>
			<DeleteQuestionDialog
				isOpen={isDeleteQuestionDialogOpen}
				onClose={() => setIsDeleteQuestionDialogOpen(false)}
				question={selectedQuestion}
				refetchQuestions={refetchQuestions}
			/>
			<Button onClick={() => setIsEditQuestionDialogOpen(true)}>
				Add Question
			</Button>
		</Box>
	);
};

export default DailyLogSettings;
