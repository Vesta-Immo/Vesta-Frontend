"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Calendar,
  Home,
  Banknote,
  ArrowLeftRight,
  Loader2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useTranslations, useLocale } from "next-intl";
import { getRegions } from "@/lib/prix-immo-api";
import type { PrixImmoRegion } from "@/types/prix-immo";

interface RegionListProps {
  selectedRegion: string | null;
  onRegionSelect: (region: string | null) => void;
}

const ANNEES_DISPONIBLES = [2020, 2021, 2022, 2023, 2024, 2025];

export default function RegionList({
  selectedRegion,
  onRegionSelect,
}: RegionListProps) {
  const t = useTranslations("prixImmobilier");
  const locale = useLocale();
  const [data, setData] = useState<PrixImmoRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeBien, setTypeBien] = useState<string>("tous");
  const [annee, setAnnee] = useState<number>(2025);

  const TYPES_BIEN = [
    { value: "tous", label: t("propertyTypeAll") },
    { value: "appartement", label: t("propertyTypeApartment") },
    { value: "maison", label: t("propertyTypeHouse") },
  ];

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
            : t("errorLoad")
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [t]);

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
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(locale).format(num);
  };

  const selectedRegionData = useMemo(() => {
    if (!selectedRegion) return null;
    return filteredData.find((item) => item.nomRegion === selectedRegion);
  }, [filteredData, selectedRegion]);

  const getEvolutionColorClass = (evolution: number | null) => {
    if (evolution === null) return "text-[var(--muted-foreground)]";
    if (evolution > 0) return "text-green-600";
    if (evolution < 0) return "text-red-600";
    return "text-[var(--muted-foreground)]";
  };

  const getEvolutionIcon = (evolution: number | null) => {
    if (evolution === null) return <Minus className="h-4 w-4" />;
    if (evolution > 0) return <TrendingUp className="h-4 w-4" />;
    if (evolution < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-2 rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-[var(--muted-foreground)]" />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white py-3 pl-9 pr-4 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="grid gap-1.5 flex-1">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("propertyTypeLabel")}
          </label>
          <select
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            value={typeBien}
            onChange={(e) => setTypeBien(e.target.value)}
          >
            {TYPES_BIEN.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5 flex-1">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("yearLabel")}
          </label>
          <select
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            value={annee}
            onChange={(e) => setAnnee(Number(e.target.value))}
          >
            {ANNEES_DISPONIBLES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className={selectedRegionData ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-gray-50">
                  <th className="py-2 pr-4 pl-4 text-left font-semibold text-[var(--foreground)]">
                    {t("table.region")}
                  </th>
                  <th className="py-2 px-4 text-right font-semibold text-[var(--foreground)]">
                    {t("table.propertyType")}
                  </th>
                  <th className="py-2 px-4 text-right font-semibold text-[var(--foreground)]">
                    {t("table.medianPrice")}
                  </th>
                  <th className="py-2 pl-4 pr-4 text-right font-semibold text-[var(--foreground)]">
                    {t("table.evolution1y")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[var(--muted-foreground)]">
                      {t("noRegionsFound")}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={`${item.nomRegion}-${item.typeBien}-${item.annee}`}
                      className={`cursor-pointer border-b border-[var(--border)] transition-colors hover:bg-gray-50 ${
                        selectedRegion === item.nomRegion ? "bg-[var(--accent)]/5" : ""
                      }`}
                      onClick={() =>
                        onRegionSelect(
                          selectedRegion === item.nomRegion
                            ? null
                            : item.nomRegion
                        )
                      }
                    >
                      <td className="py-2 pr-4 pl-4">
                        <span className="font-medium text-[var(--foreground)]">
                          {item.nomRegion}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right capitalize text-[var(--muted-foreground)]">
                        {item.typeBien}
                      </td>
                      <td className="py-2 px-4 text-right">
                        {formatPrice(item.prixMedianM2)}
                      </td>
                      <td className="py-2 pl-4 pr-4">
                        <div className="flex items-center justify-end gap-1">
                          {getEvolutionIcon(item.evolution1anPct)}
                          <span className={`text-sm font-medium ${getEvolutionColorClass(item.evolution1anPct)}`}>
                            {item.evolution1anPct !== null
                              ? `${item.evolution1anPct > 0 ? "+" : ""}${item.evolution1anPct.toFixed(1)}%`
                              : t("na")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedRegionData && (
          <div className="lg:col-span-5">
            <Card className="h-fit p-6">
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                    {selectedRegionData.nomRegion}
                  </h3>
                  <hr className="border-[var(--border)]" />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-[var(--accent)]" />
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {t("medianPrice")}
                      </p>
                      <p className="text-lg font-semibold text-[var(--foreground)]">
                        {formatPrice(selectedRegionData.prixMedianM2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {selectedRegionData.evolution1anPct !== null &&
                    selectedRegionData.evolution1anPct > 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : selectedRegionData.evolution1anPct !== null &&
                      selectedRegionData.evolution1anPct < 0 ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <Minus className="h-5 w-5 text-[var(--muted-foreground)]" />
                    )}
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {t("evolution1y")}
                      </p>
                      <p className={`font-semibold ${getEvolutionColorClass(selectedRegionData.evolution1anPct)}`}>
                        {selectedRegionData.evolution1anPct !== null
                          ? `${selectedRegionData.evolution1anPct > 0 ? "+" : ""}${selectedRegionData.evolution1anPct.toFixed(1)}%`
                          : t("na")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ArrowLeftRight className="h-5 w-5 text-[var(--accent)]" />
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {t("transactions")}
                      </p>
                      <p className="font-medium text-[var(--foreground)]">
                        {formatNumber(selectedRegionData.nbTransactions)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-[var(--accent)]" />
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {t("propertyType")}
                      </p>
                      <p className="font-medium capitalize text-[var(--foreground)]">
                        {selectedRegionData.typeBien}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[var(--accent)]" />
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {t("year")}
                      </p>
                      <p className="font-medium text-[var(--foreground)]">
                        {selectedRegionData.annee}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-[var(--accent)]" />
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {t("departments", { count: selectedRegionData.departements.length })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegionData.departements.map((dept) => (
                      <Badge key={dept} variant="outline" className="rounded px-2 py-1 text-xs font-medium">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <p className="text-xs text-[var(--muted-foreground)]">
        {t("footer")}
      </p>
    </div>
  );
}
