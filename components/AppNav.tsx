"use client";

import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useAuth } from "@/components/auth/AuthProvider";
import vestaHouseLogo from "@/img/vesta-house-no-bg.png";

const NAV_LINKS = [
  { href: "/simulation/projects", label: "Scénarios financement" },
  { href: "/simulation/property-list", label: "Mes pistes d'achat" },
  { href: "/simulation/capacite-emprunt", label: "Capacité d'emprunt" },
];

export default function AppNav() {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const hideOnScroll = useScrollTrigger({
    disableHysteresis: true,
    threshold: 72,
  });
  const { authLoading, signInWithGoogle, signOut, user } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const authButtonLabel = authLoading
    ? "Session"
    : authBusy
      ? user
        ? "Sortie"
        : "Connexion"
      : user
        ? "Deconnexion"
        : "Connexion";

  async function handleSignIn() {
    setAuthBusy(true);
    setAuthError(null);

    const returnTo = typeof window === "undefined"
      ? pathname
      : `${window.location.pathname}${window.location.search}`;

    const { error } = await signInWithGoogle(returnTo);
    if (error) {
      setAuthError(error);
      setAuthBusy(false);
    }
  }

  async function handleSignOut() {
    setAuthBusy(true);
    setAuthError(null);

    try {
      await signOut();
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Deconnexion impossible pour le moment."
      );
    } finally {
      setAuthBusy(false);
    }
  }

  const navLinks = (
    <>
      {NAV_LINKS.map(({ href, label, flagship }) => {
        const active = pathname === href || pathname.startsWith(href);
        return (
          <Button
            key={href}
            component={Link}
            href={href}
            size="small"
            variant={active || flagship ? "contained" : "text"}
            color="primary"
            sx={
              active || flagship
                ? flagship
                  ? {
                      fontWeight: 700,
                      boxShadow: "none",
                      bgcolor: active ? "primary.main" : "primary.light",
                      color: "primary.contrastText",
                      "&:hover": {
                        boxShadow: "none",
                        bgcolor: active ? "primary.dark" : "primary.main",
                        color: "primary.contrastText",
                      },
                    }
                  : {}
                : { color: "text.secondary" }
            }
          >
            {label}
          </Button>
        );
      })}
    </>
  );

  const navBar = (
    <AppBar
      position={isMobile ? "fixed" : "sticky"}
      color="default"
      enableColorOnDark={false}
      sx={{ boxShadow: isMobile ? "0 2px 10px rgba(27, 32, 30, 0.08)" : undefined }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            gap: { xs: 1, sm: 2 },
            flexWrap: "nowrap",
            py: { xs: 0.25, sm: 1 },
            minHeight: { xs: 56, sm: 68 },
          }}
        >
          <Button
            component={Link}
            href="/"
            disableRipple
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              fontFamily: "var(--font-fraunces)",
              fontSize: { xs: "1.3rem", sm: "2rem" },
              fontWeight: 700,
              color: "primary.main",
              letterSpacing: "-0.01em",
              px: 0,
              textTransform: "none",
              "&:hover": { bgcolor: "transparent" },
            }}
          >
            <Image
              src={vestaHouseLogo}
              alt="Logo Vesta"
              width={30}
              height={30}
              style={{ width: "auto", height: isMobile ? "1.35rem" : "1.7rem" }}
            />
            Vesta
          </Button>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, flexWrap: "wrap", flex: 1 }}>
            {navLinks}
          </Box>

          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={{ ml: "auto", display: { xs: "none", md: "flex" } }}
          >
            {mounted && user?.email ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: 220,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "0.79rem",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  color: "rgba(33, 43, 54, 0.58)",
                }}
              >
                {user.email}
              </Typography>
            ) : null}

            {mounted ? (
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={user ? handleSignOut : handleSignIn}
                disabled={authLoading || authBusy}
                sx={{
                  minWidth: "auto",
                  minHeight: 36,
                  px: 1.4,
                  borderRadius: 999,
                  borderColor: user ? "rgba(25, 118, 210, 0.16)" : "rgba(25, 118, 210, 0.22)",
                  backgroundColor: user ? "transparent" : "rgba(255, 255, 255, 0.72)",
                  color: user ? "text.secondary" : "primary.main",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  textTransform: "none",
                  boxShadow: "none",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    borderColor: user ? "rgba(25, 118, 210, 0.28)" : "rgba(25, 118, 210, 0.34)",
                    backgroundColor: user
                      ? "rgba(25, 118, 210, 0.05)"
                      : "rgba(255, 255, 255, 0.9)",
                    boxShadow: "none",
                  },
                  "&.Mui-disabled": {
                    borderColor: "rgba(25, 118, 210, 0.12)",
                    color: "text.disabled",
                  },
                }}
              >
                {authButtonLabel}
              </Button>
            ) : null}
          </Stack>

          <IconButton
            aria-label="Ouvrir le menu"
            onClick={() => setMobileMenuOpen(true)}
            color="primary"
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Toolbar>

        {authError ? (
          <Alert severity="error" sx={{ mb: 1.5 }}>
            {authError}
          </Alert>
        ) : null}
      </Container>
    </AppBar>
  );

  return (
    <>
      {isMobile ? (
        <Slide appear={false} direction="down" in={!hideOnScroll}>
          {navBar}
        </Slide>
      ) : (
        navBar
      )}

      {isMobile ? <Toolbar sx={{ minHeight: 56 }} /> : null}

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { width: "min(88vw, 360px)", p: 1.25 } }}
      >
        <Typography
          variant="subtitle2"
          sx={{ px: 1, pb: 1, fontWeight: 700, color: "text.secondary", textTransform: "uppercase" }}
        >
          Navigation
        </Typography>

        <List disablePadding>
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href);
            return (
              <ListItemButton
                key={href}
                component={Link}
                href={href}
                selected={active}
                onClick={() => setMobileMenuOpen(false)}
                sx={{ borderRadius: 1.5, mb: 0.5 }}
              >
                <ListItemText
                  primary={label}
                  slotProps={{
                    primary: {
                      fontSize: "0.95rem",
                      fontWeight: active ? 700 : 500,
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Divider sx={{ my: 1 }} />

        {mounted && user?.email ? (
          <Typography
            variant="body2"
            sx={{ px: 1, pb: 1, color: "text.secondary", overflowWrap: "anywhere" }}
          >
            {user.email}
          </Typography>
        ) : null}

        {mounted ? (
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={user ? handleSignOut : handleSignIn}
            disabled={authLoading || authBusy}
            sx={{ mt: 0.5, textTransform: "none", borderRadius: 999 }}
          >
            {authButtonLabel}
          </Button>
        ) : null}
      </Drawer>
    </>
  );
}
