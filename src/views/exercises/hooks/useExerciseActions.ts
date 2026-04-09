import { useCallback, useState } from "react";

import {
  useGetExercisesQuery,
  useGetExerciseQuery,
} from "@/store/services/exerciseApi";

import type { ExerciseCategory, ExerciseDifficulty } from "../types";

export function useExerciseActions() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ExerciseCategory | "">("");
  const [difficulty, setDifficulty] = useState<ExerciseDifficulty | "">("");
  const [muscleGroupId, setMuscleGroupId] = useState<number | "">("");
  const [equipmentId, setEquipmentId] = useState<number | "">("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isLoading, isFetching } = useGetExercisesQuery({
    page,
    limit,
    ...(search && { search }),
    ...(category && { category }),
    ...(difficulty && { difficulty }),
    ...(muscleGroupId && { muscleGroupId: muscleGroupId as number }),
    ...(equipmentId && { equipmentId: equipmentId as number }),
  });

  const { data: selectedExercise, isLoading: isLoadingDetail } =
    useGetExerciseQuery(selectedId!, { skip: selectedId === null });

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: ExerciseCategory | "") => {
    setCategory(value);
    setPage(1);
  }, []);

  const handleDifficultyChange = useCallback(
    (value: ExerciseDifficulty | "") => {
      setDifficulty(value);
      setPage(1);
    },
    [],
  );

  const handleMuscleGroupChange = useCallback((value: number | "") => {
    setMuscleGroupId(value);
    setPage(1);
  }, []);

  const handleEquipmentChange = useCallback((value: number | "") => {
    setEquipmentId(value);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setCategory("");
    setDifficulty("");
    setMuscleGroupId("");
    setEquipmentId("");
    setPage(1);
  }, []);

  const openDetail = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedId(null);
  }, []);

  const hasActiveFilters =
    search !== "" ||
    category !== "" ||
    difficulty !== "" ||
    muscleGroupId !== "" ||
    equipmentId !== "";

  return {
    exercises: data?.data ?? [],
    total: data?.total ?? 0,
    page,
    limit,
    isLoading,
    isFetching,
    search,
    category,
    difficulty,
    muscleGroupId,
    equipmentId,
    hasActiveFilters,
    selectedExercise: selectedExercise ?? null,
    isDetailOpen: selectedId !== null,
    isLoadingDetail,
    setPage,
    setLimit,
    handleSearchChange,
    handleCategoryChange,
    handleDifficultyChange,
    handleMuscleGroupChange,
    handleEquipmentChange,
    clearFilters,
    openDetail,
    closeDetail,
  };
}
