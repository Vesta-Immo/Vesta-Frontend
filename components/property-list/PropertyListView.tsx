"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import { useTranslations } from "next-intl";
import type { PropertyItem, PropertyWithResults } from "@/types/simulation";
import { useFormat } from "@/lib/format";

interface PropertyListViewProps {
  properties: PropertyItem[];
  resultsByPropertyId?: Record<string, PropertyWithResults>;
  onEdit: (property: PropertyItem) => void;
  onDelete: (propertyId: string) => Promise<void>;
  loading?: boolean;
}

export default function PropertyListView({
  properties,
  resultsByPropertyId,
  onEdit,
  onDelete,
  loading,
}: PropertyListViewProps) {
  const t = useTranslations("propertyList");
  const { formatEuros } = useFormat();

  if (properties.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">
          {t("noProperties")}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {t("title", { count: properties.length })}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {properties.map((property) => {
        const result = resultsByPropertyId?.[property.id];
        const totalRenovation = property.renovationWorkItems.reduce(
          (sum, item) => sum + item.cost,
          0
        );

        return (
          <Card key={property.id}>
            <CardContent>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                    {property.addressOrSector}
                  </Typography>
                  <Chip
                    label={property.status === "wanted" ? t("status.wanted") : t("status.visited")}
                    size="small"
                    color={property.status === "wanted" ? "default" : "primary"}
                  />
                </Box>

                {result && (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    useFlexGap
                    flexWrap="wrap"
                  >
                    <Chip
                      label={t("chip.monthlyCredit", { amount: formatEuros(result.monthlyCreditPayment) })}
                      color="default"
                      size="small"
                      sx={{ alignSelf: "flex-start" }}
                    />
                    <Chip
                      label={t("chip.debtRatio", { ratio: result.debtRatioPercent.toFixed(1) })}
                      color={
                        result.debtRatioLevel === "LOW"
                          ? "success"
                          : result.debtRatioLevel === "OK"
                            ? "warning"
                            : "error"
                      }
                      size="small"
                      sx={{ alignSelf: "flex-start" }}
                    />
                    <Chip
                      label={t("chip.monthlyWithCharges", { amount: formatEuros(result.monthlyPaymentWithCharges) })}
                      color="primary"
                      size="small"
                      sx={{ alignSelf: "flex-start" }}
                    />
                  </Stack>
                )}

                <Typography variant="body2" color="text.secondary">
                  {property.propertyType === "NEW" ? t("propertyType.new") : t("propertyType.old")}
                  {property.departmentCode && ` • ${property.departmentCode}`}
                </Typography>

                {property.listingUrl && (
                  <Link
                    href={property.listingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body2"
                  >
                    {t("viewListing")}
                  </Link>
                )}

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("label.purchasePrice")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatEuros(property.price)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("label.annualTaxes")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatEuros(property.propertyTaxAnnual)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("label.coOwnershipFees")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatEuros(property.coOwnershipFeesAnnual)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("label.renovations")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatEuros(totalRenovation)}
                    </Typography>
                  </Box>

                  {result && (
                    <>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t("label.requiredLoan")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatEuros(result.requiredLoanAmount)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t("label.notaryFees")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatEuros(result.notaryFees)}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>

                {property.renovationWorkItems.length > 0 && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {t("label.works")}
                      </Typography>
                      <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                        {property.renovationWorkItems.map((item, idx) => (
                          <Typography key={idx} variant="body2" color="text.secondary">
                            • {item.name}
                            {item.details && ` - ${item.details}`}
                            : {formatEuros(item.cost)}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}
              </Stack>
            </CardContent>

            <Divider />

            <CardActions>
              <Button
                size="small"
                onClick={() => onEdit(property)}
                startIcon={<EditIcon />}
              >
                {t("action.edit")}
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => onDelete(property.id)}
                startIcon={<DeleteIcon />}
                disabled={loading}
              >
                {t("action.delete")}
              </Button>
            </CardActions>
          </Card>
        );
      })}
      </Box>
    </Stack>
  );
}
