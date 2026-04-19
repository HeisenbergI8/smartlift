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

import type { LogDailyNutritionDto } from "../types";

type Props = {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (dto: LogDailyNutritionDto) => void;
};

type FormValues = {
  logDate: string;
  totalCaloriesKcal: string;
  proteinG: string;
  carbohydratesG: string;
  fatsG: string;
  notes: string;
};

const today = () => new Date().toISOString().split("T")[0];

const DEFAULT_VALUES: FormValues = {
  logDate: today(),
  totalCaloriesKcal: "",
  proteinG: "",
  carbohydratesG: "",
  fatsG: "",
  notes: "",
};

export default function DailyLogDialog({
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
      reset({ ...DEFAULT_VALUES, logDate: today() });
    }
  }, [open, reset]);

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      logDate: values.logDate,
      totalCaloriesKcal: values.totalCaloriesKcal
        ? Number(values.totalCaloriesKcal)
        : undefined,
      proteinG: values.proteinG ? Number(values.proteinG) : undefined,
      carbohydratesG: values.carbohydratesG
        ? Number(values.carbohydratesG)
        : undefined,
      fatsG: values.fatsG ? Number(values.fatsG) : undefined,
      notes: values.notes || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Log Daily Nutrition</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            pt: "16px !important",
          }}
        >
          <Controller
            name="logDate"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Date"
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                inputProps={{ style: { colorScheme: "dark" } }}
              />
            )}
          />
          <Controller
            name="totalCaloriesKcal"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Total Calories (kcal)"
                size="small"
                type="number"
                inputProps={{ step: 50, min: 0 }}
              />
            )}
          />
          <Controller
            name="proteinG"
            control={control}
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
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Notes"
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
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
