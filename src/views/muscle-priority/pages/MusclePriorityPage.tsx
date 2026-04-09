"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import { useMusclePriorityActions } from "../hooks/useMusclePriorityActions";
import MusclePriorityDialog from "../components/MusclePriorityDialog";
import MusclePriorityTable from "../components/MusclePriorityTable";

export default function MusclePriorityPage() {
  const {
    priorities,
    isLoading,
    dialogOpen,
    editTarget,
    deleteId,
    isUpserting,
    isDeleting,
    openCreate,
    openEdit,
    closeDialog,
    handleUpsert,
    confirmDelete,
    cancelDelete,
    handleDelete,
  } = useMusclePriorityActions();

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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: "text.primary", mb: 0.5 }}>
            Muscle Focus
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Set priority levels and flag imbalances for your target muscle
            groups
          </Typography>
        </Box>

        <MusclePriorityTable
          priorities={priorities}
          isLoading={isLoading}
          onAdd={openCreate}
          onEdit={openEdit}
          onDelete={confirmDelete}
        />
      </Container>

      <MusclePriorityDialog
        open={dialogOpen}
        editTarget={editTarget}
        existingMuscleGroupIds={priorities.map((p) => p.muscleGroupId)}
        isLoading={isUpserting}
        onClose={closeDialog}
        onSubmit={handleUpsert}
      />

      <Dialog open={deleteId !== null} onClose={cancelDelete} maxWidth="xs">
        <DialogTitle>Remove Priority?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            This will remove the muscle priority entry. You can re-add it at any
            time.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={cancelDelete} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Remove"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
