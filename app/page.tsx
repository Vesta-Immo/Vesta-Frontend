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
    href: "/outils/capacite-emprunt",
    step: "01",
    title: "Capacité d'emprunt",
    description:
      "Calculez le montant maximum que vous pouvez emprunter selon vos revenus, vos crédits en cours et la durée souhaitée.",
    fields: ["Revenus du foyer", "Crédits en cours", "Durée et taux"],
  },
  {
    href: "/outils/prix-immobilier",
    step: "02",
    title: "Prix immobilier",
    description:
      "Consultez les prix moyens du mètre carré par département pour mieux évaluer le marché immobilier.",
    fields: ["Département", "Type de bien", "Prix m² moyen"],
  },
];

const BUYING_TRACK_DESCRIPTION = [
  {
    title: "Centraliser les biens qui comptent vraiment",
    description:
      "Rassemblez au meme endroit les biens qui meritent d'etre suivis dans un projet d'achat, pour comparer les opportunites sans vous perdre dans des notes eparses.",
  },
  {
    title: "Cadrer la faisabilite financiere",
    description:
      "Visualisez rapidement si un dossier reste soutenable avec le taux d'endettement, la capacite d'emprunt et les autres indicateurs qui conditionnent la decision.",
  },
  {
    title: "Traduire un bien en vrai cout mensuel",
    description:
      "Appuyez-vous sur une lecture plus juste du 'vrai' loyer TTC et des charges pour mesurer l'effort reel a financer, pas seulement le prix d'annonce.",
  },
];

const SCENARIOS_FINANCEMENT_DESCRIPTION = [
  {
    title: "Structurer votre projet en scénarios",
    description:
      "Créez plusieurs configurations de financement pour un même projet : variez l'apport, la durée ou le taux pour comparer leurs impacts sur votre mensualité et votre budget total.",
  },
  {
    title: "Comparer et arbitrer sereinement",
    description:
      "Visualisez côte à côte les résultats de vos scénarios : mensualité, capacité d'emprunt et budget maximal. Identifiez en un coup d'œil la configuration la plus adaptée.",
  },
  {
    title: "Garder une trace évolutive",
    description:
      "Vos scénarios restent sauvegardés et peuvent être recalculés à tout moment. Suivez l'évolution de votre projet au fil du temps et des changements de taux.",
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
          id="mes-pistes-dachat"
          elevation={0}
          sx={{
            mb: { xs: 6, md: 8 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(120deg, rgba(245,124,0,0.14) 0%, rgba(25,118,210,0.08) 100%)",
            scrollMarginTop: "80px",
          }}
        >
          <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Stack spacing={2.5} sx={{ maxWidth: 960 }}>
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
                Mes pistes d'achat aide un particulier a garder la main sur plusieurs biens en
                parallele, a verifier rapidement la faisabilite financiere, et a arbitrer sur
                des bases concretes plutot que sur l'intuition seule.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                  gap: { xs: 2.5, md: 0 },
                  alignItems: "start",
                }}
              >
                {BUYING_TRACK_DESCRIPTION.map(({ title, description }, index) => (
                  <Box
                    key={title}
                    sx={{
                      pr: { md: index < BUYING_TRACK_DESCRIPTION.length - 1 ? 3 : 0 },
                      pl: { md: index > 0 ? 3 : 0 },
                      borderLeft:
                        index > 0
                          ? { md: "1px solid rgba(33, 43, 54, 0.10)" }
                          : "none",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {description}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 0.5 }}>
                <Button
                  component={Link}
                  href="/simulation/property-list"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                >
                  Mes pistes d'achat
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Card>

        {/* Financing scenarios */}
        <Card
          id="scenarios-financement"
          elevation={0}
          sx={{
            mb: { xs: 6, md: 8 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(120deg, rgba(25,118,210,0.10) 0%, rgba(245,124,0,0.06) 100%)",
            scrollMarginTop: "80px",
          }}
        >
          <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Stack spacing={2.5} sx={{ maxWidth: 960 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3rem" },
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Affinez votre stratégie avec Scénarios financement.
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: "1.08rem", lineHeight: 1.75 }}
              >
                Scénarios financement vous permet de modéliser plusieurs hypothèses de crédit
                pour un même projet immobilier. Comparez les impacts de l'apport, de la durée
                et du taux pour choisir la configuration qui correspond le mieux à votre situation.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                  gap: { xs: 2.5, md: 0 },
                  alignItems: "start",
                }}
              >
                {SCENARIOS_FINANCEMENT_DESCRIPTION.map(({ title, description }, index) => (
                  <Box
                    key={title}
                    sx={{
                      pr: { md: index < SCENARIOS_FINANCEMENT_DESCRIPTION.length - 1 ? 3 : 0 },
                      pl: { md: index > 0 ? 3 : 0 },
                      borderLeft:
                        index > 0
                          ? { md: "1px solid rgba(33, 43, 54, 0.10)" }
                          : "none",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {description}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 0.5 }}>
                <Button
                  component={Link}
                  href="/simulation/projects"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                >
                  Scénarios financement
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
            Des simulateurs rapides pour enrichir votre analyse.
          </Typography>
        </Box>

        {/* Simulation cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(2, 1fr)" },
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

