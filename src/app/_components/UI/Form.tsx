import { Box, type BoxProps } from "@chakra-ui/react";
import {
	type Control,
	type FieldValues,
	type FormSubmitHandler,
	Form as ReactHookForm,
} from "react-hook-form";

interface FormProps<T extends FieldValues> extends Omit<BoxProps, "onSubmit"> {
	control: Control<T>;
	onSubmit: FormSubmitHandler<T>;
}

const Form = <T extends FieldValues>({
	children,
	control,
	onSubmit,
	...props
}: FormProps<T>) => {
	return (
		<ReactHookForm
			control={control}
			onSubmit={onSubmit}
			style={{ width: "100%" }}
		>
			<Box
				backgroundColor="white"
				border="2px solid var(--chakra-colors-secondary)"
				borderRadius="lg"
				maxW="800px"
				mx="auto"
				w="60%"
				{...props}
			>
				{children}
			</Box>
		</ReactHookForm>
	);
};

export default Form;
