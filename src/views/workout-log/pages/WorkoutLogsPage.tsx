"use client";

import AddIcon from "@mui/icons-material/Add";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import WorkoutSessionCard from "../components/WorkoutSessionCard";
import StartSessionDialog from "../components/StartSessionDialog";
import { useWorkoutLogActions } from "../hooks/useWorkoutLogActions";
import type { SessionStatus } from "../types";

const STATUS_FILTERS: { label: string; value: SessionStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Skipped", value: "skipped" },
];

export default function WorkoutLogsPage() {
  const router = useRouter();
  const {
    sessions,
    total,
    page,
    limit,
    statusFilter,
    isLoading,
    isStarting,
    isDeleting,
    startDialogOpen,
    deleteId,
    activePlanDays,
    activePlanName,
    hasActivePlan,
    hasInProgressSession,
    activeSession,
    resolvePlanDayName,
    isSkippingActive,
    handleSkipActive,
    setPage,
    setLimit,
    handleStatusFilter,
    openStartDialog,
    closeStartDialog,
    handleStartSession,
    confirmDelete,
    cancelDelete,
    handleDelete,
  } = useWorkoutLogActions();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
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
          mb={3}
          gap={2}
          flexWrap="wrap"
        >
          <Box>
            <Typography variant="h4" sx={{ color: "text.primary", mb: 0.5 }}>
              Workout Log
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Track your sessions, log sets, and review your training history
            </Typography>
          </Box>
          <Tooltip
            title={
              hasInProgressSession
                ? "Complete or skip your active session before starting a new one"
                : ""
            }
            disableHoverListener={!hasInProgressSession}
          >
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openStartDialog}
                disabled={hasInProgressSession}
              >
                Start Session
              </Button>
            </span>
          </Tooltip>
        </Stack>

        {/* Active session banner */}
        {hasInProgressSession && activeSession && (
          <Alert
            severity="info"
            icon={<PlayArrowIcon />}
            action={
              <Stack direction="row" gap={1}>
                <Button
                  color="inherit"
                  size="small"
                  disabled={isSkippingActive}
                  onClick={() => handleSkipActive({})}
                >
                  {isSkippingActive ? "Skipping…" : "Skip"}
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() =>
                    router.push(`/workout-log/${activeSession.id}`)
                  }
                >
                  Continue
                </Button>
              </Stack>
            }
            sx={{ mb: 3 }}
          >
            <AlertTitle>Session In Progress</AlertTitle>
            You have an active session started on{" "}
            {new Date(activeSession.startedAt).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
            . Complete or skip it before starting a new one.
          </Alert>
        )}

        {/* Status filter chips */}
        <Stack direction="row" gap={1} flexWrap="wrap" mb={3}>
          {STATUS_FILTERS.map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              clickable
              color={statusFilter === f.value ? "primary" : "default"}
              variant={statusFilter === f.value ? "filled" : "outlined"}
              onClick={() => handleStatusFilter(f.value)}
            />
          ))}
        </Stack>

        {/* Loading skeletons */}
        {isLoading && (
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Grid key={n} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rounded" height={140} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty state */}
        {!isLoading && sessions.length === 0 && (
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
            <FitnessCenterIcon sx={{ fontSize: 56, color: "text.disabled" }} />
            <Typography variant="h6" color="text.secondary">
              No sessions found
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {statusFilter
                ? "Try a different filter or start a new session"
                : "Start your first session to begin logging"}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={openStartDialog}
            >
              Start Session
            </Button>
          </Box>
        )}

        {/* Sessions grid */}
        {!isLoading && sessions.length > 0 && (
          <>
            <Grid container spacing={2}>
              {sessions.map((session) => (
                <Grid key={session.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <WorkoutSessionCard
                    session={session}
                    planDayName={resolvePlanDayName(session.workoutPlanDayId)}
                    onDelete={confirmDelete}
                  />
                </Grid>
              ))}
            </Grid>

            <TablePagination
              component="div"
              count={total}
              page={page - 1}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25]}
              onPageChange={(_, newPage) => setPage(newPage + 1)}
              onRowsPerPageChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              sx={{ mt: 2, color: "text.secondary" }}
            />
          </>
        )}
      </Container>

      {/* Start session dialog */}
      <StartSessionDialog
        open={startDialogOpen}
        isSubmitting={isStarting}
        activePlanDays={activePlanDays}
        activePlanName={activePlanName}
        hasActivePlan={hasActivePlan}
        onClose={closeStartDialog}
        onStart={handleStartSession}
      />

      {/* Delete confirm dialog */}
      <Dialog open={deleteId !== null} onClose={cancelDelete} maxWidth="xs">
        <DialogTitle>Delete Session?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This will permanently delete the session and all its logged sets.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
