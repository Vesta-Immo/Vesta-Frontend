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
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AppNav from "@/components/AppNav";

export default function Home() {
  const t = useTranslations("home");

  const buyingTrackItems = t.raw("buyingTrack.items") as Array<{
    title: string;
    description: string;
  }>;

  const scenariosItems = t.raw("scenarios.items") as Array<{
    title: string;
    description: string;
  }>;

  const supportTools: Array<{
    href: string;
    key: string;
  }> = [
    { href: "/outils/capacite-emprunt", key: "borrowingCapacity" },
    { href: "/outils/prix-immobilier", key: "propertyPrice" },
  ];

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
                {t("hero.title")}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: "1.08rem", lineHeight: 1.75 }}
              >
                {t("hero.description")}
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                  gap: { xs: 2.5, md: 0 },
                  alignItems: "start",
                }}
              >
                {buyingTrackItems.map(({ title, description }, index) => (
                  <Box
                    key={title}
                    sx={{
                      pr: { md: index < buyingTrackItems.length - 1 ? 3 : 0 },
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
                  {t("hero.cta")}
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
                {t("scenarios.title")}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: "1.08rem", lineHeight: 1.75 }}
              >
                {t("scenarios.description")}
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                  gap: { xs: 2.5, md: 0 },
                  alignItems: "start",
                }}
              >
                {scenariosItems.map(({ title, description }, index) => (
                  <Box
                    key={title}
                    sx={{
                      pr: { md: index < scenariosItems.length - 1 ? 3 : 0 },
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
                  {t("scenarios.cta")}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Card>

        <Box sx={{ mb: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t("tools.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            {t("tools.description")}
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
          {supportTools.map(({ href, key }) => {
            const tool = t.raw(`supportTools.${key}`) as {
              step: string;
              title: string;
              description: string;
              fields: string[];
            };
            return (
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
                      {tool.step}
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{ mt: 1, letterSpacing: "-0.01em" }}
                    >
                      {tool.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1.5, lineHeight: 1.75, flexGrow: 1 }}
                    >
                      {tool.description}
                    </Typography>

                    {/* Field list */}
                    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 0.75 }}>
                      {tool.fields.map((f: string) => (
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
                        {t("tools.simulate")}
                      </Typography>
                      <ArrowForwardIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
