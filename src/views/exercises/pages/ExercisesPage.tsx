"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { useExerciseActions } from "../hooks/useExerciseActions";
import ExerciseDetailDialog from "../components/ExerciseDetailDialog";
import ExerciseFilters from "../components/ExerciseFilters";
import ExerciseGrid from "../components/ExerciseGrid";

export default function ExercisesPage() {
  const {
    exercises,
    total,
    page,
    limit,
    isLoading,
    search,
    category,
    difficulty,
    muscleGroupId,
    equipmentId,
    hasActiveFilters,
    selectedExercise,
    isDetailOpen,
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
  } = useExerciseActions();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
        px: 2,
        pt: { xs: 3, sm: 4 },
        pb: { xs: 10, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: "text.primary", mb: 0.5 }}>
            Exercise Library
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Browse and filter exercises by muscle group, equipment, and more
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <ExerciseFilters
            search={search}
            category={category}
            difficulty={difficulty}
            muscleGroupId={muscleGroupId}
            equipmentId={equipmentId}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onDifficultyChange={handleDifficultyChange}
            onMuscleGroupChange={handleMuscleGroupChange}
            onEquipmentChange={handleEquipmentChange}
            onClearFilters={clearFilters}
          />
        </Box>

        <ExerciseGrid
          exercises={exercises}
          total={total}
          page={page}
          limit={limit}
          isLoading={isLoading}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onCardClick={openDetail}
        />
      </Container>

      <ExerciseDetailDialog
        open={isDetailOpen}
        exercise={selectedExercise}
        isLoading={isLoadingDetail}
        onClose={closeDetail}
      />
    </Box>
  );
}
