"use client";

import { useState } from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

import { useGetExercisesQuery } from "@/store/services/exerciseApi";

type Props = {
  exerciseIdFilter: number | "";
  onExerciseChange: (value: number | "") => void;
};

export default function ProgressionHistoryFilters({
  exerciseIdFilter,
  onExerciseChange,
}: Props) {
  const { data: exercisesData } = useGetExercisesQuery({ page: 1, limit: 100 });
  const exercises = exercisesData?.data ?? [];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCount = exerciseIdFilter !== "" ? 1 : 0;

  const filterControl = (
    <FormControl size="small" sx={{ minWidth: 220 }}>
      <InputLabel id="progression-history-exercise-label">Exercise</InputLabel>
      <Select
        labelId="progression-history-exercise-label"
        label="Exercise"
        value={exerciseIdFilter}
        onChange={(e) => onExerciseChange(e.target.value as number | "")}
      >
        <MenuItem value="">All Exercises</MenuItem>
        {exercises.map((exercise) => (
          <MenuItem key={exercise.id} value={exercise.id}>
            {exercise.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  if (isMobile) {
    return (
      <>
        <Badge badgeContent={activeCount} color="primary">
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />}
            onClick={() => setDrawerOpen(true)}
          >
            Filters
          </Button>
        </Badge>

        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, pb: 3 },
          }}
        >
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Filters
            </Typography>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box sx={{ mb: 2 }}>{filterControl}</Box>
            <Stack direction="row" gap={1} justifyContent="flex-end">
              {activeCount > 0 && (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => {
                    onExerciseChange("");
                  }}
                  sx={{ color: "text.secondary" }}
                >
                  Clear all
                </Button>
              )}
              <Button
                size="small"
                variant="contained"
                onClick={() => setDrawerOpen(false)}
              >
                Done
              </Button>
            </Stack>
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {filterControl}
    </Box>
  );
}
