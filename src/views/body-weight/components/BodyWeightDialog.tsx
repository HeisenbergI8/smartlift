"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import type { LogBodyWeightDto, WeightSource } from "../types";

type Props = {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (dto: LogBodyWeightDto) => void;
};

type FormValues = {
  logDate: string;
  weightKg: string;
  source: WeightSource;
  notes: string;
};

const today = () => new Date().toISOString().split("T")[0];

const DEFAULT_VALUES: FormValues = {
  logDate: today(),
  weightKg: "",
  source: "manual",
  notes: "",
};

export default function BodyWeightDialog({
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
      weightKg: Number(values.weightKg),
      source: values.source,
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
              />
            )}
          />
          <Controller
            name="weightKg"
            control={control}
            rules={{ required: true, min: 20 }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Weight (kg)"
                size="small"
                type="number"
                inputProps={{ step: 0.1, min: 20, max: 500 }}
                error={!!fieldState.error}
                helperText={fieldState.error ? "Weight is required" : undefined}
              />
            )}
          />
          <Controller
            name="source"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Source" size="small" select>
                <MenuItem value="manual">Manual</MenuItem>
                <MenuItem value="smart_scale">Smart Scale</MenuItem>
                <MenuItem value="coach">Coach</MenuItem>
              </TextField>
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
