"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import { useGetMuscleGroupsQuery } from "@/store/services/muscleGroupApi";

import type {
  PriorityLevel,
  UpsertMusclePriorityDto,
  UserMusclePriority,
} from "../types";

type Props = {
  open: boolean;
  editTarget: UserMusclePriority | null;
  existingMuscleGroupIds: number[];
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (dto: UpsertMusclePriorityDto) => void;
};

type FormValues = {
  muscleGroupId: number | "";
  priorityLevel: PriorityLevel;
  hasImbalance: boolean;
  notes: string;
};

const PRIORITY_OPTIONS: { value: PriorityLevel; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

export default function MusclePriorityDialog({
  open,
  editTarget,
  existingMuscleGroupIds,
  isLoading,
  onClose,
  onSubmit,
}: Props) {
  const { data: muscleGroups } = useGetMuscleGroupsQuery();
  const isEdit = editTarget !== null;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      muscleGroupId: "",
      priorityLevel: "normal",
      hasImbalance: false,
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        editTarget
          ? {
              muscleGroupId: editTarget.muscleGroupId,
              priorityLevel: editTarget.priorityLevel,
              hasImbalance: editTarget.hasImbalance,
              notes: editTarget.notes ?? "",
            }
          : {
              muscleGroupId: "",
              priorityLevel: "normal",
              hasImbalance: false,
              notes: "",
            },
      );
    }
  }, [open, editTarget, reset]);

  const handleFormSubmit = (values: FormValues) => {
    if (values.muscleGroupId === "") return;
    onSubmit({
      muscleGroupId: values.muscleGroupId as number,
      priorityLevel: values.priorityLevel,
      hasImbalance: values.hasImbalance,
      notes: values.notes || undefined,
    });
  };

  const availableMuscleGroups = (muscleGroups ?? []).filter((mg) =>
    isEdit
      ? mg.id === editTarget?.muscleGroupId
      : !existingMuscleGroupIds.includes(mg.id),
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>
          {isEdit ? "Edit Priority" : "Add Muscle Priority"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            pt: "16px !important",
          }}
        >
          <Controller
            name="muscleGroupId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl fullWidth size="small" required disabled={isEdit}>
                <InputLabel>Muscle Group</InputLabel>
                <Select label="Muscle Group" {...field}>
                  {availableMuscleGroups.map((mg) => (
                    <MenuItem key={mg.id} value={mg.id}>
                      {mg.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="priorityLevel"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Priority Level</InputLabel>
                <Select label="Priority Level" {...field}>
                  {PRIORITY_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="hasImbalance"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                label="Flag as imbalance"
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    color="error"
                  />
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
                placeholder="Optional notes about this muscle focus..."
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
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Priority"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
