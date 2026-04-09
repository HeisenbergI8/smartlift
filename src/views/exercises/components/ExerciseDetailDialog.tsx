"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import type { Exercise, ExerciseDifficulty } from "../types";

type Props = {
  open: boolean;
  exercise: Exercise | null;
  isLoading: boolean;
  onClose: () => void;
};

const difficultyColorMap: Record<
  ExerciseDifficulty,
  "success" | "warning" | "error"
> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "error",
};

export default function ExerciseDetailDialog({
  open,
  exercise,
  isLoading,
  onClose,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            backgroundImage: "none",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FitnessCenterIcon sx={{ color: "primary.main" }} />
          <span>{exercise?.name ?? "Exercise Detail"}</span>
        </Box>
        <IconButton onClick={onClose} aria-label="Close dialog" size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading || !exercise ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                size="small"
                color={difficultyColorMap[exercise.difficulty]}
                label={exercise.difficulty}
                sx={{ textTransform: "capitalize" }}
              />
              <Chip
                size="small"
                variant="outlined"
                label={exercise.category}
                sx={{ textTransform: "capitalize" }}
              />
            </Box>

            {exercise.description && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {exercise.description}
              </Typography>
            )}

            <Divider />

            <Box>
              <Typography
                variant="overline"
                sx={{ color: "text.secondary", mb: 1, display: "block" }}
              >
                Muscles Targeted
              </Typography>
              {exercise.exerciseMuscles.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {exercise.exerciseMuscles.map((em) => (
                    <Chip
                      key={em.id}
                      size="small"
                      label={`${em.muscleGroup.name} · ${em.muscleGroup.bodyRegion.replace("_", " ")}`}
                      sx={{
                        bgcolor: "rgba(16, 185, 129, 0.1)",
                        color: "primary.main",
                        textTransform: "capitalize",
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  No muscle groups specified
                </Typography>
              )}
            </Box>

            <Box>
              <Typography
                variant="overline"
                sx={{ color: "text.secondary", mb: 1, display: "block" }}
              >
                Equipment Needed
              </Typography>
              {exercise.exerciseEquipment.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {exercise.exerciseEquipment.map((ee) => (
                    <Chip
                      key={ee.id}
                      size="small"
                      variant="outlined"
                      label={ee.equipment.name}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  No equipment needed — bodyweight only
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
