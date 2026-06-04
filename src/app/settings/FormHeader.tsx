import { Box } from "@chakra-ui/react";
import Button from "../_components/UI/Button";

export type SettingsTab = "daily-log" | "account" | "goals";

interface IFormHeader {
	activeTab: SettingsTab;
	setActiveTab: (tab: SettingsTab) => void;
}

const FormHeader = ({ activeTab, setActiveTab }: IFormHeader) => {
	return (
		<Box display="flex" flexWrap="wrap">
			<Button
				borderBottomRadius={0}
				onClick={() => setActiveTab("daily-log")}
				useCase={activeTab === "daily-log" ? "primary" : "secondary"}
			>
				Daily Log
			</Button>
			<Button
				borderBottomRadius={0}
				onClick={() => setActiveTab("account")}
				useCase={activeTab === "account" ? "primary" : "secondary"}
			>
				Account
			</Button>
			<Button
				borderBottomRadius={0}
				onClick={() => setActiveTab("goals")}
				useCase={activeTab === "goals" ? "primary" : "secondary"}
			>
				Goals
			</Button>
		</Box>
	);
};

export default FormHeader;
