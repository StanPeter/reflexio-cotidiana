import { Box } from "@chakra-ui/react";
import Button from "../_components/UI/Button";

interface IFormHeader {
	activeTab: "daily-log" | "account";
	setActiveTab: (tab: "daily-log" | "account") => void;
}

const FormHeader = ({ activeTab, setActiveTab }: IFormHeader) => {
	return (
		<Box display="flex">
			<Button
				borderBottomRadius={0}
				onClick={() => setActiveTab("daily-log")}
				useCase={activeTab === "daily-log" ? "primary" : "secondary"}
			>
				Daily Log Settings
			</Button>
			<Button
				borderBottomRadius={0}
				onClick={() => setActiveTab("account")}
				useCase={activeTab === "account" ? "primary" : "secondary"}
			>
				Account Settings
			</Button>
		</Box>
	);
};

export default FormHeader;
