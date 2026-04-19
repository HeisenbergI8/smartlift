import { useState, useCallback } from "react";
import { toast } from "react-toastify";

import {
  useGetActiveNutritionRecommendationQuery,
  useCreateNutritionRecommendationMutation,
  useGenerateNutritionRecommendationMutation,
} from "@/store/services/nutritionApi";
import type { CreateNutritionRecommendationDto } from "../types";

export function useNutritionActions() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: active, isLoading: isActiveLoading } =
    useGetActiveNutritionRecommendationQuery();

  const history = active ? [active] : [];
  const isHistoryLoading = isActiveLoading;

  const [createRecommendation, { isLoading: isCreating }] =
    useCreateNutritionRecommendationMutation();

  const [generateRecommendation, { isLoading: isGenerating }] =
    useGenerateNutritionRecommendationMutation();

  const handleCreate = useCallback(
    async (dto: CreateNutritionRecommendationDto) => {
      try {
        await createRecommendation(dto).unwrap();
        toast.success("Nutrition recommendation saved");
        setDialogOpen(false);
      } catch (err) {
        toast.error(
          (err as { message?: string }).message ??
            "Failed to save recommendation",
        );
      }
    },
    [createRecommendation],
  );

  const handleGenerate = useCallback(async () => {
    try {
      const result = await generateRecommendation().unwrap();
      toast.success(
        `Smart recommendation generated — ${result.dailyCaloriesKcal} kcal / day`,
      );
    } catch (err) {
      toast.error((err as { message?: string }).message ?? "Generation failed");
    }
  }, [generateRecommendation]);

  return {
    active: active ?? null,
    isActiveLoading,
    history,
    isHistoryLoading,
    dialogOpen,
    openDialog: () => setDialogOpen(true),
    closeDialog: () => setDialogOpen(false),
    isCreating,
    isGenerating,
    handleCreate,
    handleGenerate,
  };
}
