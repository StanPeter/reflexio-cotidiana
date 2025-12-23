import { Input as ChakraInput, type InputProps } from "@chakra-ui/react";

const Input = ({ ...props }: InputProps) => {
	const styles: InputProps = {
		borderRadius: 0,
		textAlign: "center",
		borderColor: "var(--chakra-colors-secondary)",
		borderXWidth: 0,

		_hover: {
			boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.2)",
			borderColor: "var(--chakra-colors-primary)",
		},
		_active: {
			boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.2)",
			borderColor: "var(--chakra-colors-primary)",
			borderYWidth: 2,
		},
		_focus: {
			boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.2)",
			borderColor: "var(--chakra-colors-primary)",
			borderYWidth: 2,
		},
	};

	return (
		<ChakraInput
			{...styles}
			{...props}
			_active={{ ...styles._active, ...props._active }}
			_hover={{ ...styles._hover, ...props._hover }}
		/>
	);
};

export default Input;
