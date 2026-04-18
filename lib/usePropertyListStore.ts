import { useState, useCallback, useEffect } from "react";
import type {
  FinancingSettings,
  PropertyItem,
  PropertyWithResults,
} from "@/types/simulation";
import {
  saveSettings,
  addProperty,
  getPropertyList,
  deleteProperty,
} from "./propertyListApi";
import { useSessionReset } from "./SessionResetContext";

interface PropertyListStore {
  financingSettings: FinancingSettings | null;
  properties: PropertyItem[];
  results: PropertyWithResults[] | null;
  loading: boolean;
  error: string | null;
}

export function usePropertyListStore() {
  const [store, setStore] = useState<PropertyListStore>({
    financingSettings: null,
    properties: [],
    results: null,
    loading: false,
    error: null,
  });
  const { registerPropertyListReset } = useSessionReset();

  // Register reset function on mount
  useEffect(() => {
    const resetFn = () => {
      setStore({
        financingSettings: null,
        properties: [],
        results: null,
        loading: false,
        error: null,
      });
    };
    registerPropertyListReset(resetFn);
  }, [registerPropertyListReset]);

  const setError = useCallback((error: string | null) => {
    setStore((prev) => ({ ...prev, error }));
  }, []);

  const syncFromApi = useCallback(async () => {
    const data = await getPropertyList();
    setStore((prev) => ({
      ...prev,
      financingSettings: data.financingSettings || null,
      properties: data.properties,
      results: data.lastSimulation?.results ?? null,
    }));
  }, []);

  // Load initial state from API
  const loadPropertyList = useCallback(async () => {
    setStore((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await syncFromApi();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load property list";
      setError(message);
    } finally {
      setStore((prev) => ({ ...prev, loading: false }));
    }
  }, [setError]);

  // Save financing settings
  const updateFinancingSettings = useCallback(
    async (settings: FinancingSettings) => {
      setStore((prev) => ({ ...prev, loading: true, error: null }));
      try {
        await saveSettings(settings);
        await syncFromApi();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save settings";
        setError(message);
        throw err;
      } finally {
        setStore((prev) => ({ ...prev, loading: false }));
      }
    },
    [setError, syncFromApi]
  );

  // Add or update property
  const updateProperty = useCallback(
    async (property: PropertyItem) => {
      setStore((prev) => ({ ...prev, loading: true, error: null }));
      try {
        await addProperty(property);
        await syncFromApi();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save property";
        setError(message);
        throw err;
      } finally {
        setStore((prev) => ({ ...prev, loading: false }));
      }
    },
    [setError, syncFromApi]
  );

  // Remove property
  const removeProperty = useCallback(
    async (propertyId: string) => {
      setStore((prev) => ({ ...prev, loading: true, error: null }));
      try {
        await deleteProperty(propertyId);
        await syncFromApi();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete property";
        setError(message);
        throw err;
      } finally {
        setStore((prev) => ({ ...prev, loading: false }));
      }
    },
    [setError, syncFromApi]
  );

  return {
    ...store,
    loadPropertyList,
    updateFinancingSettings,
    updateProperty,
    removeProperty,
  };
}
