"use client";

import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Link from "@mui/material/Link";
import { useTranslations } from "next-intl";
import type { PropertyWithResults } from "@/types/simulation";
import { useFormat } from "@/lib/format";

interface PropertyResultsProps {
  results: PropertyWithResults[];
}

export default function PropertyResults({ results }: PropertyResultsProps) {
  const t = useTranslations("propertyList");
  const { formatEuros } = useFormat();

  function debtLevelColor(level: PropertyWithResults["debtRatioLevel"]) {
    if (level === "LOW") {
      return "success";
    }
    if (level === "OK") {
      return "warning";
    }
    return "error";
  }

  if (results.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">
          {t("noResults")}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {t("resultsTitle")}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>{t("table.property")}</TableCell>
              <TableCell align="right">{t("table.purchasePrice")}</TableCell>
              <TableCell align="right">{t("table.notaryFees")}</TableCell>
              <TableCell align="right">{t("table.renovations")}</TableCell>
              <TableCell align="right">{t("table.requiredLoan")}</TableCell>
              <TableCell align="right">{t("table.monthlyCredit")}</TableCell>
              <TableCell align="right">{t("table.monthlyWithCharges")}</TableCell>
              <TableCell align="right">{t("table.debtRatio")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {property.addressOrSector}
                    </Typography>
                    {property.listingUrl && (
                      <Link
                        href={property.listingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="caption"
                        sx={{ display: "inline-block", mt: 0.5 }}
                      >
                        {t("viewListing")}
                      </Link>
                    )}
                    <Chip
                      label={property.status === "wanted" ? t("status.wanted") : t("status.visited")}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {formatEuros(property.price)}
                </TableCell>
                <TableCell align="right">
                  {formatEuros(property.notaryFees)}
                </TableCell>
                <TableCell align="right">
                  {formatEuros(property.totalRenovationBudget)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatEuros(property.requiredLoanAmount)}
                </TableCell>
                <TableCell align="right">
                  {formatEuros(property.monthlyCreditPayment)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {formatEuros(property.monthlyPaymentWithCharges)}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {property.debtRatioPercent.toFixed(1)}%
                    </Typography>
                    <Chip
                      label={property.debtRatioLevel}
                      size="small"
                      color={debtLevelColor(property.debtRatioLevel)}
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
