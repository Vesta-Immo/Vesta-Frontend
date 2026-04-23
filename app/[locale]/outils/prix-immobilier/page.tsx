"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import AppNav from "@/components/AppNav";
import RegionList from "./RegionList";
import { useTranslations } from "next-intl";

export default function PrixImmobilierPage() {
  const t = useTranslations("prixImmobilier");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

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

      <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3rem" },
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontWeight: 700,
              }}
            >
              {t("title")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1.5, fontSize: "1.08rem", lineHeight: 1.75 }}
            >
              {t("description")}
            </Typography>
          </Box>

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
              <RegionList
                selectedRegion={selectedRegion}
                onRegionSelect={setSelectedRegion}
              />
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
