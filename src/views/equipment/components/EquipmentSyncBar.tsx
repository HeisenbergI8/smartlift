"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

type Props = {
  selectedCount: number;
  onSync: () => void;
  isSyncing: boolean;
  hasChanges: boolean;
};

export default function EquipmentSyncBar({
  selectedCount,
  onSync,
  isSyncing,
  hasChanges,
}: Props) {
  if (!hasChanges) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        px: 3,
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 1200,
      }}
    >
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
      </Typography>
      <Button
        variant="contained"
        onClick={onSync}
        disabled={isSyncing || selectedCount === 0}
      >
        {isSyncing ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Save Equipment"
        )}
      </Button>
    </Box>
  );
}
