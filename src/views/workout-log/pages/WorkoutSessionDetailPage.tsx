"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddIcon from "@mui/icons-material/Add";
import SkipNextIcon from "@mui/icons-material/SkipNext";
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
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import CompleteSessionDialog from "../components/CompleteSessionDialog";
import LogSetDialog from "../components/LogSetDialog";
import SkipSessionDialog from "../components/SkipSessionDialog";
import WorkoutSetTable from "../components/WorkoutSetTable";
import { useWorkoutSessionActions } from "../hooks/useWorkoutSessionActions";
import type { SessionStatus } from "../types";

const STATUS_COLOR_MAP: Record<
  SessionStatus,
  "warning" | "success" | "default"
> = {
  in_progress: "warning",
  completed: "success",
  skipped: "default",
};

const STATUS_LABEL: Record<SessionStatus, string> = {
  in_progress: "In Progress",
  completed: "Completed",
  skipped: "Skipped",
};

const BG =
  "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)";

type Props = {
  sessionId: number;
};

export default function WorkoutSessionDetailPage({ sessionId }: Props) {
  const router = useRouter();
  const {
    session,
    isLoading,
    isError,
    exerciseOptions,
    logSetDialogOpen,
    completeDialogOpen,
    skipDialogOpen,
    deleteDialogOpen,
    isLoggingSet,
    isCompleting,
    isSkipping,
    isDeleting,
    openLogSetDialog,
    closeLogSetDialog,
    openCompleteDialog,
    closeCompleteDialog,
    openSkipDialog,
    closeSkipDialog,
    openDeleteDialog,
    closeDeleteDialog,
    handleLogSet,
    handleComplete,
    handleSkip,
    handleDelete,
  } = useWorkoutSessionActions(sessionId);

  const handleDeleteAndNavigate = () => {
    handleDelete(() => router.push("/workout-log"));
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          background: BG,
          px: 2,
          pt: { xs: 4, sm: 12 },
          pb: { xs: 16, sm: 12 },
        }}
      >
        <Container maxWidth="md">
          <Skeleton variant="text" width={120} height={36} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={120} sx={{ mb: 3 }} />
          <Skeleton variant="rounded" height={300} />
        </Container>
      </Box>
    );
  }

  if (isError || !session) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          background: BG,
          px: 2,
          pt: { xs: 4, sm: 12 },
          pb: { xs: 16, sm: 12 },
        }}
      >
        <Container maxWidth="md">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/workout-log")}
            sx={{ mb: 2 }}
          >
            Back to Workout Log
          </Button>
          <Typography color="error">Session not found.</Typography>
        </Container>
      </Box>
    );
  }

  const isInProgress = session.status === "in_progress";
  const nextSetNumber = session.sets.length + 1;

  const formattedDate = new Date(session.startedAt).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  );
  const formattedTime = new Date(session.startedAt).toLocaleTimeString(
    "en-US",
    { hour: "2-digit", minute: "2-digit" },
  );

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background: BG,
        px: 2,
        pt: { xs: 4, sm: 12 },
        pb: { xs: 16, sm: 12 },
      }}
    >
      <Container maxWidth="md">
        {/* Breadcrumb */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/workout-log")}
          sx={{ mb: 3, color: "text.secondary" }}
        >
          Workout Log
        </Button>

        {/* Session header card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={2}
              flexWrap="wrap"
            >
              <Box>
                <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                  <FitnessCenterIcon sx={{ color: "text.secondary" }} />
                  <Typography variant="h6" fontWeight={600}>
                    {formattedDate}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {formattedTime}
                </Typography>
              </Box>

              <Stack
                direction="row"
                gap={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Chip
                  size="small"
                  color={STATUS_COLOR_MAP[session.status]}
                  label={STATUS_LABEL[session.status]}
                />
                {session.durationMinutes !== null && (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${session.durationMinutes} min`}
                  />
                )}
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${session.sets.length} set${session.sets.length !== 1 ? "s" : ""}`}
                />
              </Stack>
            </Stack>

            {session.notes && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {session.notes}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>

        {/* Action buttons for in-progress sessions */}
        {isInProgress && (
          <Stack direction="row" gap={1.5} flexWrap="wrap" mb={3}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openLogSetDialog}
            >
              Log Set
            </Button>
            <Button
              variant="outlined"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={openCompleteDialog}
            >
              Complete
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<SkipNextIcon />}
              onClick={openSkipDialog}
            >
              Skip
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={openDeleteDialog}
            >
              Delete
            </Button>
          </Stack>
        )}

        {/* Sets table */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Sets
            </Typography>
            <WorkoutSetTable sets={session.sets} />
          </CardContent>
        </Card>
      </Container>

      {/* Log set dialog */}
      <LogSetDialog
        open={logSetDialogOpen}
        isSubmitting={isLoggingSet}
        nextSetNumber={nextSetNumber}
        exercises={exerciseOptions}
        onClose={closeLogSetDialog}
        onSubmit={handleLogSet}
      />

      {/* Complete session dialog */}
      <CompleteSessionDialog
        open={completeDialogOpen}
        isSubmitting={isCompleting}
        onClose={closeCompleteDialog}
        onComplete={handleComplete}
      />

      {/* Skip session dialog */}
      <SkipSessionDialog
        open={skipDialogOpen}
        isSubmitting={isSkipping}
        onClose={closeSkipDialog}
        onSkip={handleSkip}
      />

      {/* Delete confirm dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} maxWidth="xs">
        <DialogTitle>Delete Session?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This will permanently delete the session and all its logged sets.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteAndNavigate}
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
