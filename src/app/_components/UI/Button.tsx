import { type ButtonProps, Button as ChakraButton } from "@chakra-ui/react";

interface IButtonProps extends ButtonProps {}

const Button = ({ children, ...props }: IButtonProps) => {
	const styles: ButtonProps = {
		fontWeight: "600",
		_hover: {
			boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
		},
	};

	if (props.variant === "solid") {
		styles.backgroundColor = "var(--chakra-colors-primary)";
		styles._hover = {
			...styles._hover,
			backgroundColor: "var(--chakra-colors-hover)",
		};
	} else if (props.variant === "outline") {
		styles.border = "1px solid var(--chakra-colors-primary)";
		styles.color = "var(--chakra-colors-text)";
		styles._hover = {
			...styles._hover,
			backgroundColor: "var(--chakra-colors-hover-secondary)",
			color: "white",
		};
	}

	return (
		<ChakraButton
			{...styles}
			{...props}
			_hover={{ ...styles._hover, ...props._hover }}
		>
			{children}
		</ChakraButton>
	);
};

export default Button;
