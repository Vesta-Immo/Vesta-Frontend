"use client";

import { useState, type FormEvent } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ResultBadge from "@/components/ui/ResultBadge";
import MuiLink from "@mui/material/Link";
import { Link } from "@/i18n/navigation";
import {
  checkPtzEligibility,
  computePtzAmount,
} from "@/lib/simulate";
import { useFormat } from "@/lib/format";
import type {
  CheckPtzEligibilityRequest,
  CheckPtzEligibilityResult,
  ComputePtzResult,
  PtzZone,
  PtzPropertyType,
  PtzOperationType,
} from "@/types/simulation";
import {
  ComplementaryLoanType,
  PrimoAccedantException,
} from "@/types/simulation";
import { useTranslations } from "next-intl";

const ZONE_OPTIONS: PtzZone[] = ["A_BIS", "A", "B1", "B2", "C"];
const HOUSEHOLD_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];
const COMPLEMENTARY_LOAN_OPTIONS: ComplementaryLoanType[] = [
  ComplementaryLoanType.PAS,
  ComplementaryLoanType.CONVENTIONNE,
  ComplementaryLoanType.CLASSIQUE,
  ComplementaryLoanType.PEL,
  ComplementaryLoanType.COMPLEMENTAIRE,
];
const PRIMO_EXCEPTION_OPTIONS: PrimoAccedantException[] = [
  PrimoAccedantException.DIVORCE_SEPARATION,
  PrimoAccedantException.CATASTROPHE_NATURELLE,
  PrimoAccedantException.CARTE_INVALIDITE,
];
const PROPERTY_TYPE_OPTIONS: PtzPropertyType[] = ["COLLECTIF", "MAISON_INDIVIDUELLE"];
const OPERATION_TYPE_OPTIONS: PtzOperationType[] = ["NEUF", "ANCIEN_AVEC_TRAVAUX"];

export default function PtzSimulateurPage() {
  const t = useTranslations("ptz");
  const { formatEuros } = useFormat();
  const [form, setForm] = useState<CheckPtzEligibilityRequest>({
    propertyPrice: 0,
    propertyZone: "B1",
    householdSize: 2,
    isPrimoAccedant: true,
    annualIncome: 0,
    workPercentage: undefined,
    hasComplementaryLoan: false,
    hasDependencies: false,
    isOldProperty: false,
    propertyType: "COLLECTIF",
    operationType: "NEUF",
  });
  const [eligibilityResult, setEligibilityResult] = useState<CheckPtzEligibilityResult | null>(null);
  const [computeResult, setComputeResult] = useState<ComputePtzResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };
  }

  async function handleCalculate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEligibilityResult(null);
    setComputeResult(null);
    try {
      const eligibilityResult = await checkPtzEligibility({
        propertyPrice: form.propertyPrice * 100,
        propertyZone: form.propertyZone,
        householdSize: form.householdSize,
        isPrimoAccedant: form.isPrimoAccedant,
        annualIncome: form.annualIncome * 100,
        workPercentage: form.workPercentage,
        hasComplementaryLoan: form.hasComplementaryLoan,
        complementaryLoanType: form.complementaryLoanType,
        hasDependencies: form.hasDependencies,
        operationId: form.operationId,
        primoAccedantException: form.primoAccedantException,
        isOldProperty: form.isOldProperty,
        propertyType: form.propertyType,
        operationType: form.operationType,
      });
      setEligibilityResult(eligibilityResult);

      if (eligibilityResult.isEligible) {
        const ptzResult = await computePtzAmount({
          propertyPrice: form.propertyPrice * 100,
          propertyZone: form.propertyZone,
          householdSize: form.householdSize,
          isPrimoAccedant: form.isPrimoAccedant,
          annualIncome: form.annualIncome * 100,
          workPercentage: form.workPercentage,
          hasComplementaryLoan: form.hasComplementaryLoan,
          complementaryLoanType: form.complementaryLoanType,
          hasDependencies: form.hasDependencies,
          operationId: form.operationId,
          primoAccedantException: form.primoAccedantException,
          isOldProperty: form.isOldProperty,
          propertyType: form.propertyType,
          operationType: form.operationType,
        });
        setComputeResult(ptzResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
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
            href="/simulation/ptz/conditions"
            color="primary"
            underline="always"
            sx={{ fontWeight: 600 }}
          >
            {t("helperLink")}
          </MuiLink>
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleCalculate}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) minmax(0, 1fr)" },
          gap: 2,
          width: "100%",
          maxWidth: 800,
        }}
      >
        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
            {t("sections.property")}
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            label={t("fields.propertyPrice.label")}
            helperText={t("fields.propertyPrice.helperText")}
            type="number"
            required
            placeholder="250 000"
            value={form.propertyPrice || ""}
            onChange={field("propertyPrice")}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              },
              htmlInput: { min: 0, step: 1000 },
            }}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label={t("fields.propertyZone.label")}
            value={form.propertyZone}
            onChange={field("propertyZone")}
            helperText={t("fields.propertyZone.helperText")}
          >
            {ZONE_OPTIONS.map((value) => (
              <MenuItem key={value} value={value}>
                {t(`fields.propertyZone.options.${value}`)}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
            {t("sections.household")}
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label={t("fields.householdSize.label")}
            value={form.householdSize}
            onChange={field("householdSize")}
            helperText={t("fields.householdSize.helperText")}
          >
            {HOUSEHOLD_SIZES.map((value) => (
              <MenuItem key={value} value={value}>
                {value === 8
                  ? t("fields.householdSize.options.8plus")
                  : t("fields.householdSize.options.n", { count: value })}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box>
          <TextField
            fullWidth
            label={t("fields.annualIncome.label")}
            helperText={t("fields.annualIncome.helperText")}
            type="number"
            required
            placeholder="45 000"
            value={form.annualIncome || ""}
            onChange={field("annualIncome")}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">€ / an</InputAdornment>,
              },
              htmlInput: { min: 0, step: 1000 },
            }}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
            {t("sections.buyerStatus")}
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label={t("fields.isPrimoAccedant.label")}
            helperText={t("fields.isPrimoAccedant.helperText")}
            value={form.isPrimoAccedant ? "yes" : "no"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                isPrimoAccedant: e.target.value === "yes",
              }))
            }
          >
            <MenuItem value="yes">{t("yes")}</MenuItem>
            <MenuItem value="no">{t("no")}</MenuItem>
          </TextField>
        </Box>
        <Box>
          {!form.isPrimoAccedant && (
            <TextField
              fullWidth
              select
              label={t("fields.primoAccedantException.label")}
              value={form.primoAccedantException || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  primoAccedantException: e.target.value as PrimoAccedantException,
                }))
              }
              helperText={t("fields.primoAccedantException.helperText")}
            >
              {PRIMO_EXCEPTION_OPTIONS.map((value) => (
                <MenuItem key={value} value={value}>
                  {t(`fields.primoAccedantException.options.${value}`)}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
            {t("sections.project")}
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label={t("fields.propertyType.label")}
            value={form.propertyType || "COLLECTIF"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                propertyType: e.target.value as PtzPropertyType,
              }))
            }
            helperText={t("fields.propertyType.helperText")}
          >
            {PROPERTY_TYPE_OPTIONS.map((value) => (
              <MenuItem key={value} value={value}>
                {t(`fields.propertyType.options.${value}`)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label={t("fields.operationType.label")}
            value={form.operationType || "NEUF"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                operationType: e.target.value as PtzOperationType,
                isOldProperty: e.target.value === "ANCIEN_AVEC_TRAVAUX",
              }))
            }
            helperText={t("fields.operationType.helperText")}
          >
            {OPERATION_TYPE_OPTIONS.map((value) => (
              <MenuItem key={value} value={value}>
                {t(`fields.operationType.options.${value}`)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box>
          <TextField
            fullWidth
            label={t("fields.workPercentage.label")}
            helperText={t("fields.workPercentage.helperText")}
            type="number"
            placeholder="25"
            value={form.workPercentage || ""}
            onChange={field("workPercentage")}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              },
              htmlInput: { min: 0, max: 100, step: 1 },
            }}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
            {t("sections.financing")}
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label={t("fields.hasComplementaryLoan.label")}
            value={form.hasComplementaryLoan ? "yes" : "no"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                hasComplementaryLoan: e.target.value === "yes",
              }))
            }
            helperText={t("fields.hasComplementaryLoan.helperText")}
          >
            <MenuItem value="yes">{t("yes")}</MenuItem>
            <MenuItem value="no">{t("no")}</MenuItem>
          </TextField>
        </Box>
        <Box>
          {form.hasComplementaryLoan && (
            <TextField
              fullWidth
              select
              label={t("fields.complementaryLoanType.label")}
              value={form.complementaryLoanType || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  complementaryLoanType: e.target.value as ComplementaryLoanType,
                }))
              }
              helperText={t("fields.complementaryLoanType.helperText")}
            >
              {COMPLEMENTARY_LOAN_OPTIONS.map((value) => (
                <MenuItem key={value} value={value}>
                  {t(`fields.complementaryLoanType.options.${value}`)}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
            {t("sections.metadata")}
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label={t("fields.hasDependencies.label")}
            value={form.hasDependencies ? "yes" : "no"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                hasDependencies: e.target.value === "yes",
              }))
            }
            helperText={t("fields.hasDependencies.helperText")}
          >
            <MenuItem value="yes">{t("yes")}</MenuItem>
            <MenuItem value="no">{t("no")}</MenuItem>
          </TextField>
        </Box>
        <Box>
          <TextField
            fullWidth
            label={t("fields.operationId.label")}
            helperText={t("fields.operationId.helperText")}
            type="text"
            placeholder="OP-2024-001"
            value={form.operationId || ""}
            onChange={field("operationId")}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Stack direction="row" spacing={2} sx={{ mt: 1, width: "100%" }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ flex: 1 }}
          >
            {loading ? t("button.loading") : t("button.submit")}
          </Button>
          </Stack>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}

      {(eligibilityResult || computeResult) && (
        <Paper
          component="section"
          aria-live="polite"
          variant="outlined"
          sx={{ mt: 5, p: 3, width: "100%" }}
        >
          <Typography
            variant="overline"
            color="primary"
            sx={{ fontWeight: 700, letterSpacing: "0.12em" }}
          >
            {t("result.title")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mt: 2,
            }}
          >
            {(() => {
              const isEligible = computeResult?.isEligible ?? eligibilityResult?.isEligible ?? false;
              const maxPtzAmount = computeResult?.maxPtzAmount ?? eligibilityResult?.maxPtzAmount;
              const ptzDuration = computeResult?.ptzDuration ?? eligibilityResult?.ptzDuration;
              const loanPercentage = computeResult?.loanPercentage;
              const durationInfo = computeResult?.durationInfo ?? eligibilityResult?.durationInfo;
              const reasons = computeResult?.reasons ?? eligibilityResult?.reasons;

              return (
                <>
                  <ResultBadge
                    label={t("result.eligibleLabel")}
                    value={isEligible ? t("result.eligibleYes") : t("result.eligibleNo")}
                    prominent
                  />
                  {maxPtzAmount !== undefined && (
                    <ResultBadge
                      label={t("result.amountLabel")}
                      value={formatEuros(maxPtzAmount)}
                    />
                  )}
                  {loanPercentage !== undefined && (
                    <ResultBadge
                      label={t("result.loanPercentageLabel")}
                      value={t("result.loanPercentageValue", { percentage: loanPercentage })}
                    />
                  )}
                  {ptzDuration && (
                    <ResultBadge
                      label={t("result.durationLabel")}
                      value={t("result.durationValue", { months: ptzDuration })}
                    />
                  )}
                  {durationInfo && (
                    <>
                      <ResultBadge
                        label={t("result.totalDurationLabel")}
                        value={t("result.totalDurationValue", { months: durationInfo.totalDurationMonths })}
                      />
                      <ResultBadge
                        label={t("result.deferredPeriodLabel")}
                        value={t("result.deferredPeriodValue", { months: durationInfo.deferredPeriodMonths })}
                      />
                      <ResultBadge
                        label={t("result.repaymentPeriodLabel")}
                        value={t("result.repaymentPeriodValue", { months: durationInfo.repaymentPeriodMonths })}
                      />
                      <ResultBadge
                        label={t("result.rfrPercentageLabel")}
                        value={t("result.rfrPercentageValue", { value: (durationInfo.rfrPercentage / 100).toFixed(2) })}
                      />
                    </>
                  )}
                  {reasons && reasons.length > 0 && (
                    <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
                      <Alert severity="info" variant="outlined">
                        <Typography variant="body2">
                          {reasons.join(" • ")}
                        </Typography>
                      </Alert>
                    </Box>
                  )}
                </>
              );
            })()}
          </Box>
        </Paper>
      )}
    </Container>
  );
}
