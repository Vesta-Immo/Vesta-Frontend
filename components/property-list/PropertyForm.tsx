"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import type { PropertyItem, PropertyStatus, PropertyType } from "@/types/simulation";

export function isValidListingUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

interface PropertyFormProps {
  initialValues?: PropertyItem;
  onSubmit: (property: PropertyItem) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function PropertyForm({
  initialValues,
  onSubmit,
  loading,
  error,
}: PropertyFormProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [form, setForm] = useState<PropertyItem>(
    initialValues || {
      id: "",
      status: "wanted",
      propertyType: "OLD",
      listingUrl: "",
      price: 0,
      addressOrSector: "",
      propertyTaxAnnual: 0,
      coOwnershipFeesAnnual: 0,
      renovationWorkItems: [],
    }
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const trimmedListingUrl = form.listingUrl?.trim() || "";

      if (trimmedListingUrl && !isValidListingUrl(trimmedListingUrl)) {
        setValidationError("Le lien d'annonce doit etre une URL valide (http:// ou https://).");
        return;
      }

      setValidationError(null);
      const payload: PropertyItem = {
        ...form,
        id: form.id || `prop-${crypto.randomUUID()}`,
        listingUrl: trimmedListingUrl || undefined,
      };
      await onSubmit(payload);
    } catch {
      // Error is already set by parent
    }
  }

  function field(key: keyof Omit<PropertyItem, "renovationWorkItems">) {
    return (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [key]: typeof prev[key] === "number" ? Number(value) : value,
      }));
    };
  }

  function addRenovationItem() {
    setForm((prev) => ({
      ...prev,
      renovationWorkItems: [
        ...prev.renovationWorkItems,
        { name: "", cost: 0 },
      ],
    }));
  }

  function updateRenovationItem(
    index: number,
    key: "name" | "details" | "cost",
    value: string | number
  ) {
    setForm((prev) => ({
      ...prev,
      renovationWorkItems: prev.renovationWorkItems.map((item, i) =>
        i === index
          ? { ...item, [key]: key === "cost" ? Number(value) : value }
          : item
      ),
    }));
  }

  function removeRenovationItem(index: number) {
    setForm((prev) => ({
      ...prev,
      renovationWorkItems: prev.renovationWorkItems.filter((_, i) => i !== index),
    }));
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {validationError && <Alert severity="error" sx={{ mb: 2 }}>{validationError}</Alert>}

      <Stack spacing={2.5} sx={{ pt: 1 }}>
        {/* Core property fields */}
        <FormControl fullWidth>
          <InputLabel>Statut</InputLabel>
          <Select
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as PropertyStatus }))}
            label="Statut"
          >
            <MenuItem value="wanted">Convoitée</MenuItem>
            <MenuItem value="visited">Visitée</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Type de propriété</InputLabel>
          <Select
            value={form.propertyType}
            onChange={(e) => setForm((prev) => ({ ...prev, propertyType: e.target.value as PropertyType }))}
            label="Type de propriété"
          >
            <MenuItem value="NEW">Neuf</MenuItem>
            <MenuItem value="OLD">Ancien</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Titre du bien"
          placeholder="Exemple: Lyon 7e - Gerland"
          value={form.addressOrSector}
          onChange={field("addressOrSector")}
          required
          fullWidth
        />

        <TextField
          label="Code département"
          placeholder="69"
          value={form.departmentCode || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, departmentCode: e.target.value || undefined }))}
          fullWidth
        />

        <TextField
          label="Lien d'annonce"
          placeholder="https://..."
          type="url"
          value={form.listingUrl || ""}
          onChange={(e) => {
            const value = e.target.value;
            setValidationError(null);
            setForm((prev) => ({ ...prev, listingUrl: value }));
          }}
          fullWidth
        />

        <TextField
          label="Prix d'achat"
          type="number"
          inputProps={{ min: 0, step: 1000 }}
          value={form.price}
          onChange={field("price")}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">€</InputAdornment> },
          }}
          required
          fullWidth
        />

        <TextField
          label="Impôts fonciers annuels"
          type="number"
          inputProps={{ min: 0, step: 100 }}
          value={form.propertyTaxAnnual}
          onChange={field("propertyTaxAnnual")}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">€</InputAdornment> },
          }}
          fullWidth
        />

        <TextField
          label="Charges copropriété annuelles"
          type="number"
          inputProps={{ min: 0, step: 100 }}
          value={form.coOwnershipFeesAnnual}
          onChange={field("coOwnershipFeesAnnual")}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">€</InputAdornment> },
          }}
          fullWidth
        />

        {/* Renovation work items */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Travaux de rénovation
          </Typography>
          <Stack spacing={1.5}>
            {form.renovationWorkItems.map((item, idx) => (
              <Paper
                key={idx}
                variant="outlined"
                sx={{ p: 2 }}
              >
                <Stack spacing={1.5} direction={{ xs: "column", sm: "row" }}>
                  <TextField
                    label="Nom"
                    placeholder="Cuisine, Salle de bain..."
                    value={item.name}
                    onChange={(e) => updateRenovationItem(idx, "name", e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Détails (optionnel)"
                    placeholder="Précisions"
                    value={item.details || ""}
                    onChange={(e) => updateRenovationItem(idx, "details", e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Coût"
                    type="number"
                    inputProps={{ min: 0, step: 500 }}
                    value={item.cost}
                    onChange={(e) => updateRenovationItem(idx, "cost", e.target.value)}
                    size="small"
                    slotProps={{
                      input: { endAdornment: <InputAdornment position="end">€</InputAdornment> },
                    }}
                    sx={{ width: 120 }}
                  />
                  <IconButton
                    onClick={() => removeRenovationItem(idx)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
            <Button
              onClick={addRenovationItem}
              startIcon={<AddIcon />}
              variant="outlined"
            >
              Ajouter un travail
            </Button>
          </Stack>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
        >
          {loading ? "Enregistrement..." : initialValues ? "Mettre à jour" : "Ajouter la propriété"}
        </Button>
      </Stack>
    </Box>
  );
}
