"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const SUPPORT_TOOLS = [
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
        <Card
          elevation={0}
          sx={{
            mb: { xs: 6, md: 8 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(120deg, rgba(245,124,0,0.14) 0%, rgba(25,118,210,0.08) 100%)",
          }}
        >
          <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Stack spacing={2} sx={{ maxWidth: 760 }}>
              <Typography
                variant="h1"
                sx={{
                  mt: 0.5,
                  fontSize: { xs: "2.2rem", sm: "3.1rem", md: "4rem" },
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                Pilotez tout votre projet avec Mes pistes d'achat.
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: "1.08rem", lineHeight: 1.75 }}
              >
                L'outil coeur de Vesta pour comparer vos biens, visualiser les risques,
                et prioriser les meilleures opportunites selon votre profil financement.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 0.5 }}>
                <Button
                  component={Link}
                  href="/simulation/property-list"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                >
                  Ouvrir Mes pistes d'achat
                </Button>
                <Button
                  component={Link}
                  href="/simulation/capacite-emprunt"
                  variant="outlined"
                  size="large"
                >
                  Outils complémentaires
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Card>

        <Box sx={{ mb: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Outils complémentaires
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            Des simulateurs rapides pour enrichir votre analyse principale.
          </Typography>
        </Box>

        {/* Simulation cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {SUPPORT_TOOLS.map(({ href, step, title, description, fields }) => (
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

