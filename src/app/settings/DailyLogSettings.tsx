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
} from "@chakra-ui/react";
import { useState } from "react";
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
	question: { id: string; question: string; points: number };
	refetchQuestions: () => void;
}) => {
	const deleteQuestionMutation = api.settings.deleteQuestion.useMutation();

	const handleDeleteQuestion = () => {
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
	question: { id: string; question: string; points: number };
	refetchQuestions: () => void;
}) => {
	const [answers, setAnswers] = useState<string[]>([]);
	const createQuestionMutation = api.settings.createQuestion.useMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ question: string; points: number }>({
		defaultValues: {
			question: question?.question ?? "",
			points: 10,
		},
	});

	const onSubmit = (data: { question: string; points: number }) => {
		alert("Submit");
		createQuestionMutation.mutate(
			{
				question: data.question,
				points: data.points ?? 10,
			},
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
	const [selectedQuestionId, setSelectedQuestionId] = useState<
		string | undefined
	>(undefined);
	const {
		data: questions,
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
		console.log("Edit question", questionId);
		setIsEditQuestionDialogOpen(true);
		setSelectedQuestionId(questionId);
	};

	const handleDeleteQuestion = (questionId: string) => {
		console.log("Delete question", questionId);
		setIsDeleteQuestionDialogOpen(true);
		setSelectedQuestionId(questionId);
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
				questions?.map((item) => (
					<Box key={item.id}>
						{item.question}
						<Button
							margin={2}
							onClick={(questionId) => handleEditQuestion(questionId)}
							size="sm"
							variant="outline"
						>
							Edit
						</Button>
						<Button
							margin={2}
							onClick={(questionId) => handleDeleteQuestion(questionId)}
							size="sm"
							variant="outline"
						>
							Delete
						</Button>
					</Box>
				))
			)}
			<EditQuestionDialog
				isOpen={isEditQuestionDialogOpen}
				onClose={() => setIsEditQuestionDialogOpen(false)}
				question={questions?.find(
					(question) => question.id === selectedQuestionId,
				)}
				refetchQuestions={refetchQuestions}
			/>
			<DeleteQuestionDialog
				isOpen={isDeleteQuestionDialogOpen}
				onClose={() => setIsDeleteQuestionDialogOpen(false)}
				question={questions?.find(
					(question) => question.id === selectedQuestionId,
				)}
				refetchQuestions={refetchQuestions}
			/>
			<Button onClick={() => setIsEditQuestionDialogOpen(true)}>
				Add Question
			</Button>
		</Box>
	);
};

export default DailyLogSettings;
