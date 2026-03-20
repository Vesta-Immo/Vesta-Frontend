import { createTheme } from "@mui/material/styles";

const PRIMARY = "#214e3c";

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY,
      contrastText: "#ffffff",
    },
    background: {
      default: "#f3efe6",
      paper: "#ffffff",
    },
    text: {
      primary: "#1b201e",
      secondary: "#58635c",
    },
    divider: "rgba(27,32,30,0.1)",
  },
  typography: {
    fontFamily: "var(--font-manrope), system-ui, sans-serif",
    h1: { fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 600 },
    h2: { fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 600 },
    h3: { fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 600 },
    h4: { fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 600 },
    h5: { fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 600 },
    h6: { fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontSize: "0.875rem",
          height: 48,
          paddingInline: "1.5rem",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        sizeSmall: { height: 36, paddingInline: "1rem" },
        sizeLarge: { height: 56, fontSize: "1rem" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#ffffff",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: PRIMARY,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: PRIMARY,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { "&.Mui-focused": { color: PRIMARY } },
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true, variant: "outlined" },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(27,32,30,0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow:
            "0 1px 3px rgba(27,32,30,0.06), 0 0 0 1px rgba(27,32,30,0.07)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderRadius: 16 },
        elevation1: { borderRadius: 16 },
      },
    },
  },
});

export default theme;
