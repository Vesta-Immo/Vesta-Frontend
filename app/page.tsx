"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const CARDS = [
  {
    href: "/simulation/capacite-emprunt",
    step: "01",
    title: "Capacité d'emprunt",
    description:
      "Calculez le montant maximum que vous pouvez emprunter selon vos revenus, vos crédits en cours et la durée souhaitée.",
    fields: ["Revenus du foyer", "Crédits en cours", "Durée et taux"],
  },
  {
    href: "/simulation/budget-cible",
    step: "02",
    title: "Budget cible",
    description:
      "Estimez votre budget total disponible pour l'achat en combinant capacité d'emprunt, apport et budget travaux.",
    fields: ["Capacité d'emprunt", "Apport personnel", "Travaux"],
  },
  {
    href: "/simulation/frais-notaire",
    step: "03",
    title: "Frais de notaire",
    description:
      "Évaluez les frais annexes liés à votre acquisition selon le prix, le type de bien et le département.",
    fields: ["Prix du bien", "Neuf ou ancien", "Département"],
  },
];

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <AppNav />

      <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 6, md: 10 } }}>
        {/* Hero */}
        <Box sx={{ mb: { xs: 6, md: 10 }, maxWidth: 640 }}>
          <Typography
            variant="overline"
            color="primary"
            sx={{ fontWeight: 700, letterSpacing: "0.14em" }}
          >
            Vesta Immo
          </Typography>
          <Typography
            variant="h1"
            sx={{
              mt: 1.5,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Simulez votre projet immobilier.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 3, fontSize: "1.125rem", lineHeight: 1.75 }}
          >
            Trois outils gratuits pour évaluer votre capacité d&apos;emprunt,
            votre budget total et les frais de notaire — en quelques secondes.
          </Typography>
          <Button
            component={Link}
            href="/simulation/capacite-emprunt"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ mt: 4 }}
          >
            Commencer la simulation
          </Button>
        </Box>

        {/* Simulation cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {CARDS.map(({ href, step, title, description, fields }) => (
            <Card key={href} elevation={0}>
              <CardActionArea
                component={Link}
                href={href}
                sx={{
                  p: { xs: 3, md: 4 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  height: "100%",
                }}
              >
                <CardContent
                  sx={{
                    p: 0,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="overline"
                    color="primary"
                    sx={{ opacity: 0.45, fontWeight: 700 }}
                  >
                    {step}
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{ mt: 1, letterSpacing: "-0.01em" }}
                  >
                    {title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1.5, lineHeight: 1.75, flexGrow: 1 }}
                  >
                    {description}
                  </Typography>

                  {/* Field list */}
                  <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 0.75 }}>
                    {fields.map((f) => (
                      <Box
                        key={f}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            opacity: 0.5,
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {f}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "primary.main",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Simuler
                    </Typography>
                    <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

