"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import type { CompleteSessionDto } from "../types";

type FormValues = {
  notes: string;
};

type Props = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onComplete: (dto: CompleteSessionDto) => void;
};

export default function CompleteSessionDialog({
  open,
  isSubmitting,
  onClose,
  onComplete,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { notes: "" },
  });

  useEffect(() => {
    if (open) reset({ notes: "" });
  }, [open, reset]);

  const onSubmit = (values: FormValues) => {
    const dto: CompleteSessionDto = {
      ...(values.notes && { notes: values.notes }),
    };
    onComplete(dto);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Complete Session</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          id="complete-session-form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={2.5}
          sx={{ pt: 1 }}
        >
          <DialogContentText variant="body2">
            This will finalize the session and calculate the total duration.
          </DialogContentText>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Session notes (optional)"
                multiline
                rows={3}
                error={!!errors.notes}
                helperText={errors.notes?.message}
                fullWidth
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="complete-session-form"
          variant="contained"
          color="success"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Completing…" : "Complete Session"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
