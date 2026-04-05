"use client";

import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { getRegions } from "@/lib/prix-immo-api";
import type { PrixImmoRegion } from "@/types/prix-immo";

interface RegionListProps {
  selectedRegion: string | null;
  onRegionSelect: (region: string | null) => void;
}

const ANNEES_DISPONIBLES = [2020, 2021, 2022, 2023, 2024, 2025];
const TYPES_BIEN = [
  { value: "tous", label: "Tous" },
  { value: "appartement", label: "Appartement" },
  { value: "maison", label: "Maison" },
];

export default function RegionList({
  selectedRegion,
  onRegionSelect,
}: RegionListProps) {
  const [data, setData] = useState<PrixImmoRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeBien, setTypeBien] = useState<string>("tous");
  const [annee, setAnnee] = useState<number>(2025);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const result = await getRegions();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les données"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.nomRegion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.departements.some((d) => d.includes(searchQuery));

      const matchesType = item.typeBien === typeBien;
      const matchesAnnee = item.annee === annee;

      return matchesSearch && matchesType && matchesAnnee;
    });
  }, [data, searchQuery, typeBien, annee]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const selectedRegionData = useMemo(() => {
    if (!selectedRegion) return null;
    return filteredData.find((item) => item.nomRegion === selectedRegion);
  }, [filteredData, selectedRegion]);

  const getEvolutionColor = (evolution: number | null) => {
    if (evolution === null) return "text.secondary";
    if (evolution > 0) return "success.main";
    if (evolution < 0) return "error.main";
    return "text.secondary";
  };

  const getEvolutionIcon = (evolution: number | null) => {
    if (evolution === null) return <TrendingFlatIcon fontSize="small" />;
    if (evolution > 0) return <TrendingUpIcon fontSize="small" />;
    if (evolution < 0) return <TrendingDownIcon fontSize="small" />;
    return <TrendingFlatIcon fontSize="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        placeholder="Rechercher une région..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl fullWidth size="small">
          <InputLabel id="type-bien-label">Type de bien</InputLabel>
          <Select
            labelId="type-bien-label"
            value={typeBien}
            label="Type de bien"
            onChange={(e) => setTypeBien(e.target.value)}
          >
            {TYPES_BIEN.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel id="annee-label">Année</InputLabel>
          <Select
            labelId="annee-label"
            value={annee}
            label="Année"
            onChange={(e) => setAnnee(Number(e.target.value))}
          >
            {ANNEES_DISPONIBLES.map((a) => (
              <MenuItem key={a} value={a}>
                {a}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: selectedRegionData ? 7 : 12 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Région</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Type de bien
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Prix m² médian
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Évolution 1 an
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Aucune région trouvée
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow
                      key={`${item.nomRegion}-${item.typeBien}-${item.annee}`}
                      hover
                      selected={selectedRegion === item.nomRegion}
                      onClick={() =>
                        onRegionSelect(
                          selectedRegion === item.nomRegion
                            ? null
                            : item.nomRegion
                        )
                      }
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>
                          {item.nomRegion}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            textTransform: "capitalize",
                            color: "text.secondary",
                          }}
                        >
                          {item.typeBien}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {formatPrice(item.prixMedianM2)}
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          justifyContent="flex-end"
                        >
                          {getEvolutionIcon(item.evolution1anPct)}
                          <Typography
                            variant="body2"
                            sx={{
                              color: getEvolutionColor(item.evolution1anPct),
                              fontWeight: 500,
                            }}
                          >
                            {item.evolution1anPct !== null
                              ? `${item.evolution1anPct > 0 ? "+" : ""}${item.evolution1anPct.toFixed(1)}%`
                              : "N/A"}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {selectedRegionData && (
          <Grid size={{ xs: 12, lg: 5 }}>
            <Card elevation={2} sx={{ height: "fit-content" }}>
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {selectedRegionData.nomRegion}
                    </Typography>
                    <Divider />
                  </Box>

                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <AttachMoneyIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Prix médian au m²
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {formatPrice(selectedRegionData.prixMedianM2)}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      {selectedRegionData.evolution1anPct !== null &&
                      selectedRegionData.evolution1anPct > 0 ? (
                        <TrendingUpIcon color="success" />
                      ) : selectedRegionData.evolution1anPct !== null &&
                        selectedRegionData.evolution1anPct < 0 ? (
                        <TrendingDownIcon color="error" />
                      ) : (
                        <TrendingFlatIcon color="disabled" />
                      )}
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Évolution sur 1 an
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: getEvolutionColor(
                              selectedRegionData.evolution1anPct
                            ),
                          }}
                        >
                          {selectedRegionData.evolution1anPct !== null
                            ? `${selectedRegionData.evolution1anPct > 0 ? "+" : ""}${selectedRegionData.evolution1anPct.toFixed(1)}%`
                            : "N/A"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <SwapHorizIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Nombre de transactions
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formatNumber(selectedRegionData.nbTransactions)}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <HomeIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Type de bien
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            textTransform: "capitalize",
                          }}
                        >
                          {selectedRegionData.typeBien}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <CalendarTodayIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Année
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedRegionData.annee}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>

                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 1.5 }}
                    >
                      <LocationOnIcon color="primary" fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        Départements ({selectedRegionData.departements.length})
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {selectedRegionData.departements.map((dept) => (
                        <Chip
                          key={dept}
                          label={dept}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: 1,
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Typography variant="caption" color="text.secondary">
        Données indicatives basées sur les transactions récentes. Cliquez sur une
        ligne pour voir les détails d&apos;une région.
      </Typography>
    </Stack>
  );
}
