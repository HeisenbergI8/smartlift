"use client";

import { useState } from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";

import { useGetMuscleGroupsQuery } from "@/store/services/muscleGroupApi";
import { useGetAllEquipmentQuery } from "@/store/services/equipmentApi";

import type { ExerciseCategory, ExerciseDifficulty } from "../types";

type Props = {
  search: string;
  category: ExerciseCategory | "";
  difficulty: ExerciseDifficulty | "";
  muscleGroupId: number | "";
  equipmentId: number | "";
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: ExerciseCategory | "") => void;
  onDifficultyChange: (value: ExerciseDifficulty | "") => void;
  onMuscleGroupChange: (value: number | "") => void;
  onEquipmentChange: (value: number | "") => void;
  onClearFilters: () => void;
};

const CATEGORIES: { value: ExerciseCategory; label: string }[] = [
  { value: "compound", label: "Compound" },
  { value: "isolation", label: "Isolation" },
  { value: "flexibility", label: "Flexibility" },
  { value: "cardio", label: "Cardio" },
];

const DIFFICULTIES: { value: ExerciseDifficulty; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function ExerciseFilters({
  search,
  category,
  difficulty,
  muscleGroupId,
  equipmentId,
  hasActiveFilters,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onMuscleGroupChange,
  onEquipmentChange,
  onClearFilters,
}: Props) {
  const { data: muscleGroups } = useGetMuscleGroupsQuery();
  const { data: equipment } = useGetAllEquipmentQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const groupedMuscles = (muscleGroups ?? []).reduce(
    (acc, mg) => {
      const region = mg.bodyRegion.replace("_", " ");
      if (!acc[region]) acc[region] = [];
      acc[region].push(mg);
      return acc;
    },
    {} as Record<string, typeof muscleGroups>,
  );

  const activeCount = [category, difficulty, muscleGroupId, equipmentId].filter(
    (v) => v !== "",
  ).length;

  const selectControls = (
    <>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Category</InputLabel>
        <Select
          label="Category"
          value={category}
          onChange={(e) =>
            onCategoryChange(e.target.value as ExerciseCategory | "")
          }
        >
          <MenuItem value="">All</MenuItem>
          {CATEGORIES.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Difficulty</InputLabel>
        <Select
          label="Difficulty"
          value={difficulty}
          onChange={(e) =>
            onDifficultyChange(e.target.value as ExerciseDifficulty | "")
          }
        >
          <MenuItem value="">All</MenuItem>
          {DIFFICULTIES.map((d) => (
            <MenuItem key={d.value} value={d.value}>
              {d.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Muscle Group</InputLabel>
        <Select
          label="Muscle Group"
          value={muscleGroupId}
          onChange={(e) => onMuscleGroupChange(e.target.value as number | "")}
        >
          <MenuItem value="">All</MenuItem>
          {Object.entries(groupedMuscles).map(([region, muscles]) => [
            <MenuItem
              key={`header-${region}`}
              disabled
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "0.75rem",
                color: "text.secondary",
                opacity: "1 !important",
                mt: 0.5,
              }}
            >
              {region}
            </MenuItem>,
            ...(muscles ?? []).map((mg) => (
              <MenuItem key={mg.id} value={mg.id} sx={{ pl: 3 }}>
                {mg.name}
              </MenuItem>
            )),
          ])}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Equipment</InputLabel>
        <Select
          label="Equipment"
          value={equipmentId}
          onChange={(e) => onEquipmentChange(e.target.value as number | "")}
        >
          <MenuItem value="">All</MenuItem>
          {(equipment ?? []).map((eq) => (
            <MenuItem key={eq.id} value={eq.id}>
              {eq.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );

  if (isMobile) {
    return (
      <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
        <TextField
          size="small"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flex: 1, minWidth: 160 }}
        />

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
          <Stack spacing={2} sx={{ px: 2 }}>
            {selectControls}
            <Stack direction="row" gap={1} justifyContent="flex-end">
              {hasActiveFilters && (
                <Button
                  size="small"
                  variant="text"
                  onClick={onClearFilters}
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
          </Stack>
        </Drawer>
      </Stack>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        size="small"
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ maxWidth: { sm: 320 } }}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        {selectControls}

        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
            sx={{ color: "text.secondary" }}
          >
            Clear
          </Button>
        )}
      </Box>
    </Box>
  );
}
