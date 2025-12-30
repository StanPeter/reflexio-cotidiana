const PALETTE = {
  primary: "#8982ff;", // main accent / buttons
  secondary: "#A393FF", // secondary actions

  tertiary: "#e4dcff", // tertiary actions, for now footer

  hoverSecondary: "#aba7ff", // hover color for secondary actions

  hover: "#6c63ff", // hover color
  background: "#F5F4FF", // app background

  text: "#2F2E41", // primary text

  danger: "#dc2626",
  success: "#10b981",
};

export const globalCss = {
  body: {
    backgroundColor: "{colors.background}",
    color: "{colors.text}",
    fontFamily: "Inter, sans-serif",
  },
};

export const theme = {
  tokens: {
    colors: {
      primary: { value: PALETTE.primary },
      secondary: { value: PALETTE.secondary },
      background: { value: PALETTE.background },
      text: { value: PALETTE.text },
      tertiary: { value: PALETTE.tertiary },
      danger: { value: PALETTE.danger },
      success: { value: PALETTE.success },
      hover: { value: PALETTE.hover },
      "hover-secondary": { value: PALETTE.hoverSecondary },
    },
  },
};
