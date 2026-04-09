"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
    },
    background: {
      default: "#0B0E14",
      paper: "#141821",
    },
    text: {
      primary: "#F1F5F9",
      secondary: "#94A3B8",
    },
    error: { main: "#EF4444" },
    success: { main: "#10B981" },
    warning: { main: "#F59E0B" },
    info: { main: "#3B82F6" },
    divider: "rgba(148, 163, 184, 0.12)",
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, letterSpacing: "0.02em" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          padding: "12px 24px",
          fontSize: "0.95rem",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", fullWidth: true },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": { borderRadius: 12 },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#141821",
          borderRadius: 12,
          "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus":
            {
              WebkitBoxShadow: "0 0 0 100px #141821 inset",
              WebkitTextFillColor: "#F1F5F9",
              caretColor: "#F1F5F9",
              borderRadius: "inherit",
              transition: "background-color 5000s ease-in-out 0s",
            },
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: "none", borderRadius: 16 },
      },
    },
  },
});
