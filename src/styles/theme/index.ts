import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1D4ED8", // Blue as seen in the search button
    },
    secondary: {
      main: "#03DAC6", // Custom secondary color (optional for future use)
    },
    background: {
      default: "#FFFFFF", // White background
      paper: "#F9FAFB", // Light gray for surfaces
    },
    text: {
      primary: "#000000", // Black text
      secondary: "#6B7280", // Gray for descriptions
    },
  },
  typography: {
    fontFamily: "Outfit, Arial, sans-serif", // Custom font for the design
    h1: {
      fontWeight: 700,
      fontSize: "3rem", // Large heading
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    button: {
      textTransform: "none", // Disable uppercase buttons
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners for elements
  },
});

export default theme;
