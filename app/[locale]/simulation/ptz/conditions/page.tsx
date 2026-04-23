"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import MuiLink from "@mui/material/Link";
import { Link } from "@/i18n/navigation";
import { getPtzConditions } from "@/lib/simulate";
import { useFormat } from "@/lib/format";
import type { GetPtzConditionsResult, PtzZone } from "@/types/simulation";
import { useTranslations } from "next-intl";

const ZONES: PtzZone[] = ["A", "B1", "B2", "C"];

export default function PtzConditionsPage() {
  const t = useTranslations("ptzConditions");
  const { formatEuros } = useFormat();
  const [conditions, setConditions] = useState<GetPtzConditionsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConditions() {
      try {
        const data = await getPtzConditions();
        setConditions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errors.generic"));
      } finally {
        setLoading(false);
      }
    }
    fetchConditions();
  }, [t]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!conditions) {
    return null;
  }

  const exceptionItems = ["divorce", "catastrophe", "invalidite"] as const;
  const durationItems = ["rfr75", "rfr75to100", "rfr100plus"] as const;
  const loanItems = ["pas", "conventionne", "classique", "pel"] as const;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          color="primary"
          sx={{ fontWeight: 700, letterSpacing: "0.12em" }}
        >
          {t("overline")}
        </Typography>
        <Typography
          variant="h3"
          sx={{ mt: 1, fontSize: { xs: "2rem", sm: "2.5rem" } }}
        >
          {t("title")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
          {t("description")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t("helperText")}{" "}
          <MuiLink
            component={Link}
            href="/simulation/ptz"
            color="primary"
            underline="always"
            sx={{ fontWeight: 600 }}
          >
            {t("helperLink")}
          </MuiLink>
        </Typography>
      </Box>

      <Stack spacing={4}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            {t("characteristics.title")}
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
              <Typography variant="body1" color="text.secondary">
                {t("characteristics.interestRate")}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {conditions.ptzRate === 0
                  ? t("characteristics.interestRateZero")
                  : t("characteristics.interestRateValue", { value: (conditions.ptzRate / 100).toFixed(2) })}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="body1" color="text.secondary">
                {t("characteristics.maxDuration")}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {t("characteristics.maxDurationValue", { months: conditions.maxDurationMonths, years: conditions.maxDurationMonths / 12 })}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="body1" color="text.secondary">
                {t("characteristics.minWork")}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {t("characteristics.minWorkValue", { percentage: conditions.minWorkPercentage })}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            {t("exceptions.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("exceptions.description")}
          </Typography>
          <Stack spacing={2}>
            {exceptionItems.map((key) => (
              <Box key={key} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <Typography variant="body1" fontWeight={600}>
                  • {t(`exceptions.${key}.title`)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t(`exceptions.${key}.description`)}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            {t("duration.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("duration.description")}
          </Typography>
          <Stack spacing={2}>
            {durationItems.map((key) => (
              <Box key={key} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <Typography variant="body1" fontWeight={600}>
                  • {t(`duration.${key}.title`)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t(`duration.${key}.description`)}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            {t("loans.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("loans.description")}
          </Typography>
          <Stack spacing={2}>
            {loanItems.map((key) => (
              <Box key={key} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <Typography variant="body1" fontWeight={600}>
                  • {t(`loans.${key}.title`)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t(`loans.${key}.description`)}
                </Typography>
              </Box>
            ))}
          </Stack>
          <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
            <Typography variant="body2">
              {t("loans.alert")}
            </Typography>
          </Alert>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            {t("tables.priceCeilings.title")}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>{t("tables.headers.zone")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person1")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person2")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person3")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person4")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person5plus")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ZONES.map((zone) => {
                  const zonePlafonds = conditions.plafonds.filter(
                    (p) => p.zone === zone
                  );
                  const getPrice = (size: number) => {
                    const plafond = zonePlafonds.find(
                      (p) => p.householdSize === size
                    );
                    return plafond ? formatEuros(plafond.maxPropertyPrice) : "-";
                  };
                  return (
                    <TableRow key={zone} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {t(`zoneLabels.${zone}`)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{getPrice(1)}</TableCell>
                      <TableCell align="right">{getPrice(2)}</TableCell>
                      <TableCell align="right">{getPrice(3)}</TableCell>
                      <TableCell align="right">{getPrice(4)}</TableCell>
                      <TableCell align="right">{getPrice(5)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            {t("tables.financingCeilings.title")}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>{t("tables.headers.zone")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person12")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person3")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person4plus")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ZONES.map((zone) => {
                  const zonePlafonds = conditions.plafonds.filter(
                    (p) => p.zone === zone
                  );
                  const getPercentage = (size: number) => {
                    const plafond = zonePlafonds.find(
                      (p) => p.householdSize === size
                    );
                    return plafond ? `${plafond.maxLoanPercentage} %` : "-";
                  };
                  return (
                    <TableRow key={zone} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {t(`zoneLabels.${zone}`)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{getPercentage(2)}</TableCell>
                      <TableCell align="right">{getPercentage(3)}</TableCell>
                      <TableCell align="right">{getPercentage(4)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            {t("tables.incomeCeilings.title")}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>{t("tables.headers.zone")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person1")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person2")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person3")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person4")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">{t("tables.headers.person5plus")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ZONES.map((zone) => {
                  const zonePlafonds = conditions.plafonds.filter(
                    (p) => p.zone === zone
                  );
                  const getRfr = (size: number) => {
                    const plafond = zonePlafonds.find(
                      (p) => p.householdSize === size
                    );
                    return plafond ? formatEuros(plafond.maxRfr) : "-";
                  };
                  return (
                    <TableRow key={zone} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {t(`zoneLabels.${zone}`)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{getRfr(1)}</TableCell>
                      <TableCell align="right">{getRfr(2)}</TableCell>
                      <TableCell align="right">{getRfr(3)}</TableCell>
                      <TableCell align="right">{getRfr(4)}</TableCell>
                      <TableCell align="right">{getRfr(5)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>
    </Container>
  );
}
