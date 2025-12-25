import { type ButtonProps, Button as ChakraButton } from "@chakra-ui/react";

interface IButtonProps extends ButtonProps {
	useCase: "primary" | "secondary" | "danger";
}

const Button = ({ children, useCase, ...props }: IButtonProps) => {
	const styles: ButtonProps = {
		fontWeight: "600",
		_hover: {
			boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
		},
	};

	if (useCase === "primary") {
		styles.backgroundColor = "var(--chakra-colors-primary)";
		styles._hover = {
			...styles._hover,
			backgroundColor: "var(--chakra-colors-hover)",
		};
	} else if (useCase === "secondary") {
		styles.border = "1px solid var(--chakra-colors-primary)";
		styles.backgroundColor = "white";
		styles.color = "var(--chakra-colors-text)";
		styles._hover = {
			...styles._hover,
			backgroundColor: "var(--chakra-colors-hover-secondary)",
			color: "white",
		};
	} else if (useCase === "danger") {
		styles.backgroundColor = "var(--chakra-colors-danger)";
		styles.opacity = 0.8;
		styles._hover = {
			...styles._hover,
			backgroundColor: "var(--chakra-colors-danger)",
			opacity: 1,
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
