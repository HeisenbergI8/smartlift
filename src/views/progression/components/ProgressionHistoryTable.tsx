"use client";

import { useState } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
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

import type { AdjustmentType, ProgressionHistoryItem } from "../types";

type Props = {
  history: ProgressionHistoryItem[];
  isLoading: boolean;
};

const ADJUSTMENT_LABEL: Record<AdjustmentType, string> = {
  weight_increase: "Weight ↑",
  weight_decrease: "Weight ↓",
  reps_increase: "Reps ↑",
  sets_increase: "Sets ↑",
  deload: "Deload",
};

const ADJUSTMENT_COLOR: Record<
  AdjustmentType,
  "success" | "primary" | "info" | "warning" | "error"
> = {
  weight_increase: "success",
  weight_decrease: "warning",
  reps_increase: "primary",
  sets_increase: "info",
  deload: "error",
};

export default function ProgressionHistoryTable({ history, isLoading }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isLoading) {
    return (
      <Box sx={{ px: 2 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={52} sx={{ mb: 0.5 }} />
        ))}
      </Box>
    );
  }

  if (history.length === 0) {
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
        <TrendingUpIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No progression history yet. Run an evaluation to generate adjustments.
        </Typography>
      </Box>
    );
  }

  const paginated = history.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const pagination = (
    <TablePagination
      component="div"
      count={history.length}
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
          {paginated.map((item) => (
            <Card
              key={item.id}
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
                    {item.exercise.name}
                  </Typography>
                  <Chip
                    size="small"
                    color={ADJUSTMENT_COLOR[item.adjustmentType]}
                    label={ADJUSTMENT_LABEL[item.adjustmentType]}
                  />
                </Stack>

                <Stack direction="row" gap={3} mb={1}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Previous
                    </Typography>
                    <Typography variant="body2">
                      {item.previousValue}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      New
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary.main"
                    >
                      {item.newValue}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Source
                    </Typography>
                    <Box>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={item.source}
                        sx={{ textTransform: "capitalize", fontSize: "0.7rem" }}
                      />
                    </Box>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 1 }} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5, lineHeight: 1.4 }}
                >
                  {item.reason}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Typography>
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ textTransform: "uppercase" }}>Exercise</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>
              Adjustment
            </TableCell>
            <TableCell align="right" sx={{ textTransform: "uppercase" }}>
              Prev Value
            </TableCell>
            <TableCell align="right" sx={{ textTransform: "uppercase" }}>
              New Value
            </TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Reason</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Source</TableCell>
            <TableCell align="right" sx={{ textTransform: "uppercase" }}>
              Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.exercise.name}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={ADJUSTMENT_COLOR[item.adjustmentType]}
                  label={ADJUSTMENT_LABEL[item.adjustmentType]}
                />
              </TableCell>
              <TableCell align="right">{item.previousValue}</TableCell>
              <TableCell align="right">{item.newValue}</TableCell>
              <TableCell
                sx={{ maxWidth: 260, whiteSpace: "normal", lineHeight: 1.4 }}
              >
                {item.reason}
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  variant="outlined"
                  label={item.source}
                  sx={{ textTransform: "capitalize" }}
                />
              </TableCell>
              <TableCell align="right">
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination}
    </>
  );
}
