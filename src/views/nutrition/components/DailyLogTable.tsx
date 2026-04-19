"use client";

import { useState } from "react";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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

import type { DailyNutritionLog } from "../types";

type Props = {
  logs: DailyNutritionLog[];
  isLoading: boolean;
};

const fmt = (val: number | null, unit = "") =>
  val !== null ? `${val.toLocaleString()}${unit}` : "—";

const fmtDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
};

export default function DailyLogTable({ logs, isLoading }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isLoading) {
    return (
      <Box sx={{ px: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={52} sx={{ mb: 0.5 }} />
        ))}
      </Box>
    );
  }

  if (logs.length === 0) {
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
        <EventNoteIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No daily logs yet. Log your first entry above.
        </Typography>
      </Box>
    );
  }

  const paginated = logs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const pagination = (
    <TablePagination
      component="div"
      count={logs.length}
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
          {paginated.map((log) => (
            <Card
              key={log.id}
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
                    {fmtDate(log.logDate)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary.main"
                    fontWeight={600}
                  >
                    {fmt(log.totalCaloriesKcal, " kcal")}
                  </Typography>
                </Stack>
                <Stack direction="row" gap={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Protein
                    </Typography>
                    <Typography variant="body2">
                      {fmt(log.proteinG, " g")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Carbs
                    </Typography>
                    <Typography variant="body2">
                      {fmt(log.carbohydratesG, " g")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fats
                    </Typography>
                    <Typography variant="body2">
                      {fmt(log.fatsG, " g")}
                    </Typography>
                  </Box>
                </Stack>
                {log.notes && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {log.notes}
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
              "Calories (kcal)",
              "Protein (g)",
              "Carbs (g)",
              "Fats (g)",
              "Notes",
            ].map((col) => (
              <TableCell key={col} sx={{ textTransform: "uppercase" }}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((log) => (
            <TableRow key={log.id} hover>
              <TableCell>{fmtDate(log.logDate)}</TableCell>
              <TableCell>{fmt(log.totalCaloriesKcal)}</TableCell>
              <TableCell>{fmt(log.proteinG)}</TableCell>
              <TableCell>{fmt(log.carbohydratesG)}</TableCell>
              <TableCell>{fmt(log.fatsG)}</TableCell>
              <TableCell>{log.notes ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination}
    </>
  );
}
