"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/simulation/capacite-emprunt", label: "Capacité d'emprunt" },
  { href: "/simulation/budget-cible", label: "Budget cible" },
  { href: "/simulation/frais-notaire", label: "Frais de notaire" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <AppBar position="sticky" color="default" enableColorOnDark={false}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Button
            component={Link}
            href="/"
            disableRipple
            sx={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "primary.main",
              letterSpacing: "-0.01em",
              px: 0,
              "&:hover": { bgcolor: "transparent" },
            }}
          >
            Vesta Immo
          </Button>

          {/* Navigation links */}
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href);
              return (
                <Button
                  key={href}
                  component={Link}
                  href={href}
                  size="small"
                  variant={active ? "contained" : "text"}
                  color="primary"
                  sx={active ? {} : { color: "text.secondary" }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
