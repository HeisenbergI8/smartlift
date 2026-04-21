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

import type { LogBodyWeightDto } from "../types";

type Props = {
  open: boolean;
  isLoading: boolean;
  isCoachMode: boolean;
  onClose: () => void;
  onSubmit: (dto: LogBodyWeightDto) => void;
};

type FormValues = {
  logDate: string;
  weightKg: string;
  notes: string;
};

const today = () => new Date().toISOString().split("T")[0];

const DEFAULT_VALUES: FormValues = {
  logDate: today(),
  weightKg: "",
  notes: "",
};

export default function BodyWeightDialog({
  open,
  isLoading,
  isCoachMode,
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
      weightKg: Math.round(parseFloat(values.weightKg) * 10) / 10,
      source: isCoachMode ? "coach" : "manual",
      notes: values.notes || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Log Weight</DialogTitle>
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
            name="weightKg"
            control={control}
            rules={{
              required: "Weight is required",
              validate: (v) => {
                const n = parseFloat(v);
                if (isNaN(n)) return "Enter a valid weight";
                if (n < 20) return "Minimum weight is 20 kg";
                if (n > 500) return "Maximum weight is 500 kg";
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Weight (kg)"
                size="small"
                type="number"
                inputProps={{ step: 0.1, min: 20, max: 500 }}
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? fieldState.error.message
                    : "Decimals allowed, e.g. 80.5"
                }
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
