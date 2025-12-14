import { Box, Button } from "@chakra-ui/react";

interface IFormHeader {
	activeTab: "daily-log" | "account";
	setActiveTab: (tab: "daily-log" | "account") => void;
}

const FormHeader = ({ activeTab, setActiveTab }: IFormHeader) => {
	return (
		<Box display="flex" gap={4}>
			<Button
				onClick={() => setActiveTab("daily-log")}
				variant={activeTab === "daily-log" ? "solid" : "outline"}
			>
				Daily Log Settings
			</Button>
			<Button
				onClick={() => setActiveTab("account")}
				variant={activeTab === "account" ? "solid" : "outline"}
			>
				Account Settings
			</Button>
		</Box>
	);
};

export default FormHeader;
