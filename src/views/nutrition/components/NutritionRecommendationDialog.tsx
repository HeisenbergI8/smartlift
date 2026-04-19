"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import type { CreateNutritionRecommendationDto } from "../types";

type Props = {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateNutritionRecommendationDto) => void;
};

type FormValues = {
  dailyCaloriesKcal: number;
  proteinG: number;
  carbohydratesG: number;
  fatsG: number;
  effectiveFrom: string;
  effectiveTo: string;
  notes: string;
};

const today = () => new Date().toISOString().split("T")[0];

const DEFAULT_VALUES: FormValues = {
  dailyCaloriesKcal: 2000,
  proteinG: 150,
  carbohydratesG: 200,
  fatsG: 55,
  effectiveFrom: today(),
  effectiveTo: "",
  notes: "",
};

export default function NutritionRecommendationDialog({
  open,
  isLoading,
  onClose,
  onSubmit,
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset({ ...DEFAULT_VALUES, effectiveFrom: today() });
    }
  }, [open, reset]);

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      dailyCaloriesKcal: Number(values.dailyCaloriesKcal),
      proteinG: Number(values.proteinG),
      carbohydratesG: Number(values.carbohydratesG),
      fatsG: Number(values.fatsG),
      effectiveFrom: values.effectiveFrom,
      effectiveTo: values.effectiveTo || null,
      notes: values.notes || null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Add Nutrition Recommendation</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            pt: "16px !important",
          }}
        >
          <Controller
            name="dailyCaloriesKcal"
            control={control}
            rules={{ required: true, min: 500 }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Daily Calories (kcal)"
                size="small"
                type="number"
                inputProps={{ step: 50, min: 500 }}
              />
            )}
          />

          <Controller
            name="proteinG"
            control={control}
            rules={{ required: true, min: 0 }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Protein (g)"
                size="small"
                type="number"
                inputProps={{ step: 1, min: 0 }}
              />
            )}
          />

          <Controller
            name="carbohydratesG"
            control={control}
            rules={{ required: true, min: 0 }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Carbohydrates (g)"
                size="small"
                type="number"
                inputProps={{ step: 1, min: 0 }}
              />
            )}
          />

          <Controller
            name="fatsG"
            control={control}
            rules={{ required: true, min: 0 }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fats (g)"
                size="small"
                type="number"
                inputProps={{ step: 1, min: 0 }}
              />
            )}
          />

          <Controller
            name="effectiveFrom"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Effective From"
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                inputProps={{ style: { colorScheme: "dark" } }}
              />
            )}
          />

          <Controller
            name="effectiveTo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Effective To (optional)"
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                inputProps={{ style: { colorScheme: "dark" } }}
              />
            )}
          />

          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Notes (optional)"
                size="small"
                multiline
                rows={2}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
