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

import type { SkipSessionDto } from "../types";

type FormValues = {
  notes: string;
};

type Props = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSkip: (dto: SkipSessionDto) => void;
};

export default function SkipSessionDialog({
  open,
  isSubmitting,
  onClose,
  onSkip,
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
    const dto: SkipSessionDto = {
      ...(values.notes && { notes: values.notes }),
    };
    onSkip(dto);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Skip Session?</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          id="skip-session-form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={2.5}
          sx={{ pt: 1 }}
        >
          <DialogContentText variant="body2">
            The session will be marked as skipped. You can start a new session
            afterwards.
          </DialogContentText>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Reason (optional)"
                multiline
                rows={2}
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
          form="skip-session-form"
          variant="contained"
          color="warning"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Skipping…" : "Skip Session"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
