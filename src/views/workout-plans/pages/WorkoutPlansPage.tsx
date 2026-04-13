"use client";

import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useGetWorkoutPlansQuery } from "@/store/services/workoutPlanApi";

import WorkoutPlanCard from "../components/WorkoutPlanCard";
import WorkoutPlanDialog from "../components/WorkoutPlanDialog";
import GeneratePlanDialog from "../components/GeneratePlanDialog";
import { useWorkoutPlanActions } from "../hooks/useWorkoutPlanActions";

export default function WorkoutPlansPage() {
  const { data: plans = [], isLoading } = useGetWorkoutPlansQuery();
  const activePlan = plans.find((p) => p.isActive) ?? null;

  const {
    dialogOpen,
    editTarget,
    deleteId,
    generateDialogOpen,
    isCreating,
    isUpdating,
    isActivating,
    isGenerating,
    isDeleting,
    openCreate,
    openEdit,
    closeDialog,
    handleCreate,
    handleUpdate,
    handleActivate,
    openGenerate,
    closeGenerate,
    handleGenerate,
    confirmDelete,
    cancelDelete,
    handleDelete,
  } = useWorkoutPlanActions();

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
        {/* Page header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={4}
          gap={2}
          flexWrap="wrap"
        >
          <Box>
            <Typography variant="h4" sx={{ color: "text.primary", mb: 0.5 }}>
              Workout Plans
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Create and manage your training plans with daily exercise
              programming
            </Typography>
          </Box>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<AutoAwesomeIcon />}
              onClick={openGenerate}
            >
              Auto-Generate
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
            >
              New Plan
            </Button>
          </Stack>
        </Stack>

        {/* Active plan banner */}
        {!isLoading && activePlan && (
          <Card
            sx={{
              mb: 3,
              border: "1px solid",
              borderColor: "success.dark",
              bgcolor: "rgba(16, 185, 129, 0.06)",
            }}
          >
            <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Stack
                direction="row"
                alignItems="center"
                gap={1.5}
                flexWrap="wrap"
              >
                <CalendarMonthIcon sx={{ color: "success.main" }} />
                <Typography variant="subtitle2" color="success.main">
                  Active Plan
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {activePlan.name}
                </Typography>
                <Chip
                  size="small"
                  label={`${activePlan.daysPerWeek} days/week · ${activePlan.durationWeeks} weeks`}
                  color="success"
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {!isLoading && !activePlan && plans.length > 0 && (
          <Card
            sx={{
              mb: 3,
              border: "1px solid",
              borderColor: "warning.dark",
              bgcolor: "rgba(245, 158, 11, 0.06)",
            }}
          >
            <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Typography variant="body2" color="warning.main">
                No active plan — activate one of your plans to start training.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <Grid container spacing={2}>
            {[1, 2, 3].map((n) => (
              <Grid key={n} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rounded" height={220} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty state */}
        {!isLoading && plans.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 56, color: "text.disabled" }} />
            <Typography variant="h6" color="text.secondary">
              No workout plans yet
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Create your first plan to get started
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={openCreate}
            >
              New Plan
            </Button>
          </Box>
        )}

        {/* Plans grid */}
        {!isLoading && plans.length > 0 && (
          <Grid container spacing={2}>
            {plans.map((plan) => (
              <Grid key={plan.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <WorkoutPlanCard
                  plan={plan}
                  isActivePlan={plan.id === activePlan?.id}
                  onEdit={openEdit}
                  onDelete={confirmDelete}
                  onActivate={handleActivate}
                  isActivating={isActivating}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Create / Edit dialog */}
      <WorkoutPlanDialog
        open={dialogOpen}
        editTarget={editTarget}
        isSubmitting={isCreating || isUpdating}
        onClose={closeDialog}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      {/* Auto-generate dialog */}
      <GeneratePlanDialog
        open={generateDialogOpen}
        isSubmitting={isGenerating}
        onClose={closeGenerate}
        onGenerate={handleGenerate}
      />

      {/* Delete confirm dialog */}
      <Dialog open={deleteId !== null} onClose={cancelDelete} maxWidth="xs">
        <DialogTitle>Delete Workout Plan?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            This will permanently delete the workout plan and all its days and
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
            onClick={handleDelete}
            startIcon={isDeleting ? <CircularProgress size={14} /> : undefined}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
