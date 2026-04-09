"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { useEquipmentActions } from "../hooks/useEquipmentActions";
import EquipmentGrid from "../components/EquipmentGrid";
import EquipmentSyncBar from "../components/EquipmentSyncBar";

export default function EquipmentPage() {
  const {
    catalog,
    isLoadingCatalog,
    isLoadingUser,
    selectedIds,
    toggleItem,
    handleSync,
    isSyncing,
    hasChanges,
  } = useEquipmentActions();

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
            My Equipment
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Select the equipment available to you
          </Typography>
        </Box>

        <EquipmentGrid
          catalog={catalog}
          selectedIds={selectedIds}
          onToggle={toggleItem}
          isLoading={isLoadingCatalog || isLoadingUser}
        />
      </Container>

      <EquipmentSyncBar
        selectedCount={selectedIds.size}
        onSync={handleSync}
        isSyncing={isSyncing}
        hasChanges={hasChanges}
      />
    </Box>
  );
}
