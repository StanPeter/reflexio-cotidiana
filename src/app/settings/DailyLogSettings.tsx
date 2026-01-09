"use client";

import {
	Box,
	Dialog,
	FieldErrorText,
	FieldLabel,
	FieldRoot,
	Heading,
	Icon,
	NativeSelect,
	Portal,
	Spinner,
	Switch,
	SwitchRoot,
	Table,
	Text,
} from "@chakra-ui/react";
import type { Question, Severity } from "generated/prisma";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { LuMessageCircleQuestion } from "react-icons/lu";
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

const DeleteQuestionDialog = ({
	isOpen,
	onClose,
	question,
	refetchQuestions,
}: {
	isOpen: boolean;
	onClose: () => void;
	question?: Question;
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
			placement="center"
			size={{ mdDown: "full", md: "lg" }}
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>
								Do you really want to delete this question? This action will
								delete all answers to this question.
							</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Box
								backgroundColor="var(--chakra-colors-background)"
								borderRadius="md"
								px={6}
								py={10}
							>
								<Heading size="md">{question?.question}</Heading>
							</Box>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button useCase="secondary">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button onClick={handleDeleteQuestion} useCase="danger">
								Delete
							</Button>
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
	action,
	question,
	refetchQuestions,
}: {
	isOpen: boolean;
	onClose: () => void;
	action: "edit" | "create";
	question?: Question;
	refetchQuestions: () => void;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const switchRef = useRef<HTMLLabelElement>(null);
	const createQuestionMutation = api.settings.createQuestion.useMutation();
	const updateQuestionMutation = api.settings.updateQuestion.useMutation();

	const {
		register,
		handleSubmit,
		getValues,
		trigger,
		setValue,
		reset,
		formState: { errors },
		control,
	} = useForm<{ question: string; severity: Severity; isPositive: boolean }>(
		{},
	);

	useEffect(() => {
		if (question) {
			setValue("question", question.question);
			setValue("severity", question.severity);
			setValue("isPositive", question.isPositive);
		}
	}, [question, setValue]);

	const onSubmit = async (data: {
		question: string;
		severity: Severity;
		isPositive: boolean;
	}) => {
		setIsLoading(true);

		try {
			if (question?.id && action === "edit") {
				await updateQuestionMutation.mutateAsync({
					id: question.id,
					question: data.question,
					severity: data.severity,
					isPositive: !!data.isPositive,
				});
			} else if (action === "create") {
				await createQuestionMutation.mutateAsync({
					question: data.question,
					severity: data.severity,
					isPositive: !!data.isPositive,
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
			reset();
			onClose();
		}
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<Dialog.Root
			onOpenChange={onClose}
			open={isOpen}
			placement="center"
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
							<Box
								backgroundColor="var(--chakra-colors-background)"
								borderRadius="md"
								px={10}
								py={20}
							>
								<Form
									control={control}
									id="edit-question-form"
									onSubmit={(data) => onSubmit(data.data)}
									w={"100%"}
								>
									<FieldRoot alignItems="center" invalid={false} mt={2}>
										<FieldLabel>Question</FieldLabel>
										<Input
											placeholder="Question to ask yourself"
											{...register("question", {
												required: "Question is required",
											})}
										/>
										<FieldErrorText>Question is required</FieldErrorText>
									</FieldRoot>
									<FieldRoot alignItems="center" invalid={false} mt={2}>
										<FieldLabel>Severity</FieldLabel>
										<Box w="100%">
											<NativeSelect.Root
												alignItems="center"
												invalid={false}
												justifyContent="center"
												mt={2}
												textAlign="center"
											>
												<NativeSelect.Field
													_active={{
														borderColor: "var(--chakra-colors-primary)",
														borderWidth: "2px",
													}}
													_focus={{
														borderColor: "var(--chakra-colors-primary)",
														borderWidth: "2px",
													}}
													backgroundColor="var(--chakra-colors-background)"
													border="1px solid var(--chakra-colors-secondary)"
													borderRadius={"none"}
													borderX={"none"}
													pl={"32px"}
													textAlign="center"
													{...register("severity", {
														required: "Severity is required",
													})}
												>
													{["LOW", "MEDIUM", "HIGH"].map((severity) => (
														<option key={severity} value={severity}>
															{severity}
														</option>
													))}
												</NativeSelect.Field>
												<NativeSelect.Indicator />
											</NativeSelect.Root>
											{/* <Icon
												as={LuMessageCircleQuestion}
												position={"absolute"}
												right={2}
												top={8}
											/> */}
										</Box>
										<FieldErrorText>{errors.severity?.message}</FieldErrorText>
									</FieldRoot>

									<Box
										alignItems="center"
										as="label"
										color="var(--chakra-colors-text)"
										display="flex"
										fontWeight={"medium"}
										justifyContent="center"
										my={2}
									>
										Is Positive
									</Box>
									<SwitchRoot
										alignItems="center"
										backgroundColor="var(--chakra-colors-background)"
										border={"1px solid var(--chakra-colors-secondary)"}
										borderBottomLeftRadius={"6px"}
										borderBottomRightRadius={"6px"}
										checked={getValues("isPositive")}
										colorPalette={"primary"}
										css={{
											"& input:checked + [data-part='control'], &[data-state=checked] [data-part='control'], &[aria-checked='true'] [data-part='control'], &[data-checked] [data-part='control']":
												{
													backgroundColor: "var(--chakra-colors-primary)",
													borderColor: "var(--chakra-colors-primary)",
												},
											"& [data-part='control']": {
												backgroundColor: "var(--chakra-colors-background)",
											},
											"& [data-part='thumb']": {
												backgroundColor: "var(--chakra-colors-background)",
											},
											// for not checked
											"& input:not(:checked) + [data-part='control'], &[data-state=unchecked] [data-part='control'], &[aria-checked='false'] [data-part='control'], &[data-checked=false] [data-part='control']":
												{
													backgroundColor: "text",
												},
										}}
										display="flex"
										height="40px"
										id="isPositive"
										justifyContent="center"
										mt={2}
										ref={switchRef}
									>
										<Switch.HiddenInput
											{...register("isPositive")}
											onChange={(d) => {
												register("isPositive").onChange(d);
												trigger("isPositive");
											}}
										/>
										<Switch.Control />
									</SwitchRoot>
								</Form>
							</Box>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button useCase="secondary">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button form="edit-question-form" type="submit" useCase="primary">
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

const DailyLogSettings = ({
	questions,
	refetchQuestions,
}: {
	questions: Question[];
	refetchQuestions: () => void;
}) => {
	const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] =
		useState(false);
	const [isDeleteQuestionDialogOpen, setIsDeleteQuestionDialogOpen] =
		useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState<
		Question | undefined
	>(undefined);
	const [action, setAction] = useState<"edit" | "create">("create");

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

	const handleEditQuestion = (
		questionId: string,
		action: "edit" | "create",
	) => {
		setAction(action);

		if (action === "edit") {
			setSelectedQuestion(
				questions.find((question) => question.id === questionId),
			);
		} else {
			setSelectedQuestion(undefined);
		}
		setIsEditQuestionDialogOpen(true);
	};

	const handleDeleteQuestion = (questionId: string) => {
		setSelectedQuestion(
			questions.find((question) => question.id === questionId),
		);
		setIsDeleteQuestionDialogOpen(true);
	};

	const tableBorder = "1px solid var(--chakra-colors-tertiary)";

	return (
		<>
			{questions.length > 0 ? (
				<>
					<Heading size="md">Negative Questions</Heading>
					<Table.Root mb={6} size="sm">
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeader borderBottom={tableBorder}>
									Question
								</Table.ColumnHeader>
								<Table.ColumnHeader borderBottom={tableBorder}>
									Severity
								</Table.ColumnHeader>
								<Table.ColumnHeader
									borderBottom={tableBorder}
								></Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{questions
								?.filter((questionItem) => !questionItem.isPositive)
								.sort(
									(
										a,
										b, // sort by created at date descending
									) =>
										new Date(b.createdAt).getTime() -
										new Date(a.createdAt).getTime(),
								)
								.map((questionItem) => (
									<Table.Row key={questionItem.id}>
										<Table.Cell borderBottom={tableBorder}>
											{questionItem.question}
										</Table.Cell>
										<Table.Cell borderBottom={tableBorder}>
											{questionItem.severity}
										</Table.Cell>
										<Table.Cell borderBottom={tableBorder}>
											<Button
												marginRight={2}
												onClick={() =>
													handleEditQuestion(questionItem.id, "edit")
												}
												size="sm"
												useCase="primary"
											>
												Edit
											</Button>
											<Button
												onClick={() => handleDeleteQuestion(questionItem.id)}
												size="sm"
												useCase="danger"
											>
												Delete
											</Button>
										</Table.Cell>
									</Table.Row>
								))}
						</Table.Body>
					</Table.Root>
					<Heading size="md">Positive Questions</Heading>
					<Table.Root size="sm">
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeader borderBottom={tableBorder}>
									Question
								</Table.ColumnHeader>
								<Table.ColumnHeader borderBottom={tableBorder}>
									Severity
								</Table.ColumnHeader>
								<Table.ColumnHeader
									borderBottom={tableBorder}
								></Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{questions
								?.filter((questionItem) => questionItem.isPositive)
								.sort(
									(
										a,
										b, // sort by created at date descending
									) =>
										new Date(b.createdAt).getTime() -
										new Date(a.createdAt).getTime(),
								)
								.map((questionItem) => (
									<Table.Row key={questionItem.id}>
										<Table.Cell borderBottom={tableBorder}>
											{questionItem.question}
										</Table.Cell>
										<Table.Cell borderBottom={tableBorder}>
											{questionItem.severity}
										</Table.Cell>
										<Table.Cell borderBottom={tableBorder}>
											<Button
												marginRight={2}
												onClick={() =>
													handleEditQuestion(questionItem.id, "edit")
												}
												size="sm"
												useCase="primary"
											>
												Edit
											</Button>
											<Button
												onClick={() => handleDeleteQuestion(questionItem.id)}
												size="sm"
												useCase="danger"
											>
												Delete
											</Button>
										</Table.Cell>
									</Table.Row>
								))}
						</Table.Body>
					</Table.Root>{" "}
				</>
			) : (
				<Heading size="md">No questions found</Heading>
			)}
			<Button
				marginTop={4}
				onClick={() => handleEditQuestion("", "create")}
				useCase="primary"
			>
				Add Question
			</Button>
			<EditQuestionDialog
				action={action}
				isOpen={isEditQuestionDialogOpen}
				onClose={() => {
					setIsEditQuestionDialogOpen(false);
					refetchQuestions();
				}}
				question={selectedQuestion}
				refetchQuestions={refetchQuestions}
			/>
			<DeleteQuestionDialog
				isOpen={isDeleteQuestionDialogOpen}
				onClose={() => {
					setIsDeleteQuestionDialogOpen(false);
					refetchQuestions();
				}}
				question={selectedQuestion}
				refetchQuestions={refetchQuestions}
			/>
		</>
	);
};

export default DailyLogSettings;
