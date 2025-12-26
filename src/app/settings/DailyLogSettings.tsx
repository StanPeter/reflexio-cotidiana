"use client";

import {
	Box,
	Checkbox,
	Dialog,
	FieldErrorText,
	FieldLabel,
	FieldRoot,
	Heading,
	Icon,
	Portal,
	Spinner,
	Switch,
	SwitchLabel,
	SwitchRoot,
	Table,
} from "@chakra-ui/react";
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
			placement="center"
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
	const switchRef = useRef<HTMLLabelElement>(null);
	const createQuestionMutation = api.settings.createQuestion.useMutation();
	const updateQuestionMutation = api.settings.updateQuestion.useMutation();

	const {
		register,
		handleSubmit,
		getValues,
		trigger,
		setValue,
		formState: { errors },
		control,
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
		isPositive: false | "on";
	}) => {
		console.log("data", data);
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
				isPositive: !!data.isPositive,
			});
		}
		onClose();
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
									onSubmit={handleSubmit(onSubmit)}
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
										<FieldLabel>Points</FieldLabel>
										<Box w="100%">
											<Input
												placeholder="How important is this question?"
												{...register("points", {
													required: "Points is required",
												})}
											/>
											<Icon
												as={LuMessageCircleQuestion}
												position={"absolute"}
												right={2}
												top={8}
											/>
										</Box>
										<FieldErrorText>Points is required</FieldErrorText>
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
							<Button type="submit" useCase="primary">
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
	questions: {
		id: string;
		question: string;
		points: number;
		isPositive: boolean;
	}[];
	refetchQuestions: () => void;
}) => {
	const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] =
		useState(false);
	const [isDeleteQuestionDialogOpen, setIsDeleteQuestionDialogOpen] =
		useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState<
		| { id: string; question: string; points: number; isPositive: boolean }
		| undefined
	>(undefined);

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

	const tableBorder = "1px solid var(--chakra-colors-tertiary)";

	return (
		<>
			<Table.Root size="sm">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader borderBottom={tableBorder}>
							Question
						</Table.ColumnHeader>
						<Table.ColumnHeader borderBottom={tableBorder}>
							Points
						</Table.ColumnHeader>
						<Table.ColumnHeader borderBottom={tableBorder}></Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{questions?.map((questionItem) => (
						<Table.Row key={questionItem.id}>
							<Table.Cell borderBottom={tableBorder}>
								{questionItem.question}
							</Table.Cell>
							<Table.Cell borderBottom={tableBorder}>
								{questionItem.points}
							</Table.Cell>
							<Table.Cell borderBottom={tableBorder}>
								<Button
									marginRight={2}
									onClick={() => handleEditQuestion(questionItem.id)}
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
			<Button
				marginTop={4}
				onClick={() => setIsEditQuestionDialogOpen(true)}
				useCase="primary"
			>
				Add Question
			</Button>
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
		</>
	);
};

export default DailyLogSettings;
