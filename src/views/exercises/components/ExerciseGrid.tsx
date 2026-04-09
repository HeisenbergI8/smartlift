"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import type { Exercise } from "../types";
import ExerciseCard from "./ExerciseCard";

type Props = {
  exercises: Exercise[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onCardClick: (id: number) => void;
};

export default function ExerciseGrid({
  exercises,
  total,
  page,
  limit,
  isLoading,
  onPageChange,
  onLimitChange,
  onCardClick,
}: Props) {
  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Skeleton variant="rounded" height={180} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (exercises.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <FitnessCenterIcon
          sx={{ fontSize: 48, color: "text.secondary", opacity: 0.5 }}
        />
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          No exercises found. Try adjusting your filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {exercises.map((exercise) => (
          <Grid key={exercise.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ExerciseCard exercise={exercise} onClick={onCardClick} />
          </Grid>
        ))}
      </Grid>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        onRowsPerPageChange={(e) => {
          onLimitChange(parseInt(e.target.value, 10));
          onPageChange(1);
        }}
        rowsPerPageOptions={[8, 12, 24]}
        sx={{ mt: 2, color: "text.secondary" }}
      />
    </Box>
  );
}
