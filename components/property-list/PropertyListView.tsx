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
import type { PropertyItem, PropertyWithResults } from "@/types/simulation";
import { formatEuros } from "@/lib/format";

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
  if (properties.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">
          Aucune piste d'achat ajoutee. Commencez a ajouter vos pistes.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Pistes d'achat ({properties.length})
      </Typography>

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
                    label={property.status === "wanted" ? "Convoitée" : "Visitée"}
                    size="small"
                    color={property.status === "wanted" ? "default" : "primary"}
                  />
                </Box>

                {result && (
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Chip
                      label={`Mensualite + charges: ${formatEuros(result.monthlyPaymentWithCharges)}`}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={`Endettement: ${result.debtRatioPercent.toFixed(1)}%`}
                      color={
                        result.debtRatioLevel === "LOW"
                          ? "success"
                          : result.debtRatioLevel === "OK"
                            ? "warning"
                            : "error"
                      }
                      size="small"
                    />
                  </Stack>
                )}

                <Typography variant="body2" color="text.secondary">
                  {property.propertyType === "NEW" ? "Neuf" : "Ancien"}
                  {property.departmentCode && ` • ${property.departmentCode}`}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Prix d'achat
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatEuros(property.price)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Impôts annuels
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatEuros(property.propertyTaxAnnual)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Charges copropriété
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatEuros(property.coOwnershipFeesAnnual)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Rénovations
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatEuros(totalRenovation)}
                    </Typography>
                  </Box>

                  {result && (
                    <>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Prêt requis
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatEuros(result.requiredLoanAmount)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Frais de notaire
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
                        Travaux:
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
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => onDelete(property.id)}
                startIcon={<DeleteIcon />}
                disabled={loading}
              >
                Supprimer
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </Stack>
  );
}
