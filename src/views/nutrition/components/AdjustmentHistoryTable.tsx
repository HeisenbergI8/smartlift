"use client";

import { useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";

import type { NutritionAdjustment, NutritionAdjustmentTrigger } from "../types";

type Props = {
  adjustments: NutritionAdjustment[];
  isLoading: boolean;
};

const TRIGGER_COLOR: Record<
  NutritionAdjustmentTrigger,
  "warning" | "info" | "secondary" | "primary"
> = {
  plateau_detected: "warning",
  weight_trend: "info",
  goal_change: "secondary",
  coach_override: "primary",
};

const TRIGGER_LABEL: Record<NutritionAdjustmentTrigger, string> = {
  plateau_detected: "Plateau",
  weight_trend: "Weight Trend",
  goal_change: "Goal Change",
  coach_override: "Coach",
};

export default function AdjustmentHistoryTable({
  adjustments,
  isLoading,
}: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isLoading) {
    return (
      <Box sx={{ px: 2 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={52} sx={{ mb: 0.5 }} />
        ))}
      </Box>
    );
  }

  if (adjustments.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <TuneIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No smart adjustments recorded yet.
        </Typography>
      </Box>
    );
  }

  const paginated = adjustments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const pagination = (
    <TablePagination
      component="div"
      count={adjustments.length}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[5, 10, 25]}
      onPageChange={(_, newPage) => setPage(newPage)}
      onRowsPerPageChange={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      }}
    />
  );

  if (isMobile) {
    return (
      <>
        <Stack spacing={1.5} sx={{ p: 2 }}>
          {paginated.map((adj) => (
            <Card
              key={adj.id}
              variant="outlined"
              sx={{ bgcolor: "background.default" }}
            >
              <CardContent sx={{ pb: "12px !important" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {new Date(adj.createdAt).toLocaleDateString()}
                  </Typography>
                  <Chip
                    size="small"
                    color={TRIGGER_COLOR[adj.triggerReason]}
                    label={TRIGGER_LABEL[adj.triggerReason]}
                  />
                </Stack>
                <Stack direction="row" gap={1} alignItems="center" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    {adj.previousCaloriesKcal.toLocaleString()} kcal
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    →
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="primary.main"
                  >
                    {adj.newCaloriesKcal.toLocaleString()} kcal
                  </Typography>
                </Stack>
                <Stack direction="row" gap={3} mb={1}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Protein
                    </Typography>
                    <Typography variant="body2">
                      {adj.previousProteinG}→{adj.newProteinG} g
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Carbs
                    </Typography>
                    <Typography variant="body2">
                      {adj.previousCarbohydratesG}→{adj.newCarbohydratesG} g
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fats
                    </Typography>
                    <Typography variant="body2">
                      {adj.previousFatsG}→{adj.newFatsG} g
                    </Typography>
                  </Box>
                </Stack>
                {adj.notes && (
                  <Typography variant="caption" color="text.secondary">
                    {adj.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
        {pagination}
      </>
    );
  }

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            {[
              "Date",
              "Trigger",
              "Calories (kcal)",
              "Protein (g)",
              "Carbs (g)",
              "Fats (g)",
              "Reason",
            ].map((col) => (
              <TableCell key={col} sx={{ textTransform: "uppercase" }}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((adj) => (
            <TableRow key={adj.id} hover>
              <TableCell>
                {new Date(adj.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={TRIGGER_COLOR[adj.triggerReason]}
                  label={TRIGGER_LABEL[adj.triggerReason]}
                />
              </TableCell>
              <TableCell>
                {adj.previousCaloriesKcal.toLocaleString()} →{" "}
                {adj.newCaloriesKcal.toLocaleString()}
              </TableCell>
              <TableCell>
                {adj.previousProteinG} → {adj.newProteinG}
              </TableCell>
              <TableCell>
                {adj.previousCarbohydratesG} → {adj.newCarbohydratesG}
              </TableCell>
              <TableCell>
                {adj.previousFatsG} → {adj.newFatsG}
              </TableCell>
              <TableCell>{adj.notes ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination}
    </>
  );
}
