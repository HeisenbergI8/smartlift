"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import { useGetWorkoutPlanQuery } from "@/store/services/workoutPlanApi";

import AddDayDialog from "../components/AddDayDialog";
import WorkoutPlanDayAccordion from "../components/WorkoutPlanDayAccordion";
import WorkoutPlanDialog from "../components/WorkoutPlanDialog";
import { useWorkoutPlanActions } from "../hooks/useWorkoutPlanActions";

const GOAL_COLOR_MAP: Record<
  string,
  "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info"
> = {
  strength: "error",
  hypertrophy: "primary",
  endurance: "info",
  general: "success",
};

type WorkoutPlanDetailPageProps = {
  planId: number;
};

export default function WorkoutPlanDetailPage({
  planId,
}: WorkoutPlanDetailPageProps) {
  const router = useRouter();
  const { data: plan, isLoading, isError } = useGetWorkoutPlanQuery(planId);

  const {
    dialogOpen,
    editTarget,
    deleteId,
    isUpdating,
    isActivating,
    isDeleting,
    isAddingDay,
    addDayDialogOpen,
    openEdit,
    closeDialog,
    handleUpdate,
    handleActivate,
    openAddDay,
    closeAddDay,
    handleAddDay,
    confirmDelete,
    cancelDelete,
    handleDelete,
  } = useWorkoutPlanActions();

  const handleDeleteAndNavigate = async () => {
    await handleDelete();
    router.push("/workout-plans");
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
          px: 2,
          pt: { xs: 3, sm: 4 },
          pb: { xs: 10, sm: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" width={400} height={28} sx={{ mb: 4 }} />
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} variant="rounded" height={60} sx={{ mb: 1 }} />
          ))}
        </Container>
      </Box>
    );
  }

  if (isError || !plan) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          background: "linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box textAlign="center">
          <Typography variant="h5" color="text.secondary" mb={2}>
            Plan not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/workout-plans")}
          >
            Back to Plans
          </Button>
        </Box>
      </Box>
    );
  }

  const goalLabel = plan.trainingGoal.replace(/_/g, " ");
  const sortedDays = [...plan.days].sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
        px: 2,
        pt: { xs: 3, sm: 4 },
        pb: { xs: 10, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/workout-plans")}
          sx={{ mb: 3, color: "text.secondary" }}
        >
          All Plans
        </Button>

        {/* Plan header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          mb={1.5}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} mb={0.75}>
              {plan.name}
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <Chip
                size="small"
                color={plan.isActive ? "success" : "default"}
                variant={plan.isActive ? "filled" : "outlined"}
                label={plan.isActive ? "Active" : "Inactive"}
              />
              <Chip
                size="small"
                color={GOAL_COLOR_MAP[plan.trainingGoal] ?? "default"}
                label={goalLabel.charAt(0).toUpperCase() + goalLabel.slice(1)}
              />
              <Chip
                size="small"
                variant="outlined"
                label={`${plan.daysPerWeek} days/week`}
              />
              <Chip
                size="small"
                variant="outlined"
                label={`${plan.durationWeeks} weeks`}
              />
            </Stack>
          </Box>

          <Stack direction="row" gap={1}>
            {!plan.isActive && (
              <Button
                variant="contained"
                color="success"
                startIcon={
                  isActivating ? (
                    <CircularProgress size={14} />
                  ) : (
                    <PlayArrowIcon />
                  )
                }
                disabled={isActivating}
                onClick={() => handleActivate(plan.id)}
              >
                Activate
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => openEdit(plan)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => confirmDelete(plan.id)}
            >
              Delete
            </Button>
          </Stack>
        </Stack>

        {plan.description && (
          <Typography variant="body1" color="text.secondary" mb={3}>
            {plan.description}
          </Typography>
        )}

        {/* Days */}
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={600}>
              Training Days
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={openAddDay}
            >
              Add Day
            </Button>
          </Stack>
          {sortedDays.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No days configured for this plan.
            </Typography>
          ) : (
            <Stack gap={1}>
              {sortedDays.map((day, index) => (
                <WorkoutPlanDayAccordion
                  key={day.id}
                  day={day}
                  defaultExpanded={index === 0}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Container>

      {/* Edit dialog */}
      <WorkoutPlanDialog
        open={dialogOpen}
        editTarget={editTarget}
        isSubmitting={isUpdating}
        onClose={closeDialog}
        onCreate={() => {}}
        onUpdate={handleUpdate}
      />

      {/* Add Day dialog */}
      <AddDayDialog
        open={addDayDialogOpen}
        nextDayNumber={sortedDays.length + 1}
        isSubmitting={isAddingDay}
        onClose={closeAddDay}
        onAdd={(dto) => handleAddDay(plan.id, dto)}
      />

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onClose={cancelDelete} maxWidth="xs">
        <DialogTitle>Delete Workout Plan?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            This will permanently delete this plan and all its days and
            exercises. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={isDeleting}
            onClick={handleDeleteAndNavigate}
            startIcon={isDeleting ? <CircularProgress size={14} /> : undefined}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
