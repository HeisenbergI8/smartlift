"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import type { Exercise, ExerciseDifficulty } from "../types";

type Props = {
  exercise: Exercise;
  onClick: (id: number) => void;
};

const difficultyColorMap: Record<
  ExerciseDifficulty,
  "success" | "warning" | "error"
> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "error",
};

const categoryLabelMap: Record<string, string> = {
  compound: "Compound",
  isolation: "Isolation",
  bodyweight: "Bodyweight",
  cardio: "Cardio",
};

export default function ExerciseCard({ exercise, onClick }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        border: 1,
        borderColor: "divider",
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 0 0 1px rgba(16, 185, 129, 0.3)",
        },
      }}
    >
      <CardActionArea
        onClick={() => onClick(exercise.id)}
        sx={{ height: "100%" }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
              {exercise.name}
            </Typography>
            <Chip
              size="small"
              color={difficultyColorMap[exercise.difficulty]}
              label={exercise.difficulty}
              sx={{ textTransform: "capitalize", flexShrink: 0 }}
            />
          </Box>

          <Chip
            size="small"
            variant="outlined"
            label={categoryLabelMap[exercise.category]}
            sx={{ alignSelf: "flex-start" }}
          />

          {exercise.exerciseMuscles.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {exercise.exerciseMuscles.map((em) => (
                <Chip
                  key={em.id}
                  size="small"
                  label={em.muscleGroup.name}
                  sx={{
                    fontSize: "0.7rem",
                    height: 22,
                    bgcolor: "rgba(16, 185, 129, 0.1)",
                    color: "primary.main",
                  }}
                />
              ))}
            </Box>
          )}

          {exercise.exerciseEquipment.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                mt: "auto",
              }}
            >
              {exercise.exerciseEquipment.map((ee) => (
                <Chip
                  key={ee.id}
                  size="small"
                  variant="outlined"
                  label={ee.equipment.name}
                  sx={{ fontSize: "0.7rem", height: 22 }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
