import { useCallback, useMemo, useReducer } from "react";
import { toast } from "react-toastify";

import {
  useGetAllEquipmentQuery,
  useGetUserEquipmentQuery,
  useSyncUserEquipmentMutation,
} from "@/store/services/equipmentApi";

type ToggleAction = { type: "toggle"; id: number } | { type: "reset" };

function toggleReducer(state: Map<number, boolean>, action: ToggleAction) {
  if (action.type === "reset") return new Map<number, boolean>();
  const next = new Map(state);
  const current = next.get(action.id);
  if (current === undefined) {
    next.set(action.id, true);
  } else {
    next.delete(action.id);
  }
  return next;
}

export function useEquipmentActions() {
  const { data: catalog, isLoading: isLoadingCatalog } =
    useGetAllEquipmentQuery();
  const { data: userEquipment, isLoading: isLoadingUser } =
    useGetUserEquipmentQuery();
  const [syncEquipment, { isLoading: isSyncing }] =
    useSyncUserEquipmentMutation();

  const [overrides, dispatch] = useReducer(toggleReducer, new Map());

  const serverIds = useMemo(
    () => new Set(userEquipment?.map((ue) => ue.equipmentId) ?? []),
    [userEquipment],
  );

  const selectedIds = useMemo(() => {
    const result = new Set(serverIds);
    for (const [id, added] of overrides) {
      if (added && !result.has(id)) {
        result.add(id);
      } else if (added && result.has(id)) {
        result.delete(id);
      }
    }
    return result;
  }, [serverIds, overrides]);

  const toggleItem = useCallback((id: number) => {
    dispatch({ type: "toggle", id });
  }, []);

  const handleSync = useCallback(async () => {
    try {
      await syncEquipment({ equipmentIds: [...selectedIds] }).unwrap();
      dispatch({ type: "reset" });
      toast.success("Equipment updated");
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to update equipment");
    }
  }, [syncEquipment, selectedIds]);

  const hasChanges = overrides.size > 0;

  return {
    catalog: catalog ?? [],
    isLoadingCatalog,
    isLoadingUser,
    selectedIds,
    toggleItem,
    handleSync,
    isSyncing,
    hasChanges,
  };
}
