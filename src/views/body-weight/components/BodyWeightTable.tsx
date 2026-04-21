"use client";

import { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";

import type { BodyWeightLog, WeightSource } from "../types";
import { formatDate } from "@/libs/formatDate";

type Props = {
  logs: BodyWeightLog[];
  isLoading: boolean;
  isDeleting: boolean;
  onDeleteRequest: (id: number) => void;
};

const SOURCE_COLOR: Record<WeightSource, "primary" | "secondary" | "info"> = {
  smart_scale: "primary",
  coach: "secondary",
  manual: "info",
};

const SOURCE_LABEL: Record<WeightSource, string> = {
  smart_scale: "Smart Scale",
  coach: "Coach",
  manual: "Manual",
};

export default function BodyWeightTable({
  logs,
  isLoading,
  isDeleting,
  onDeleteRequest,
}: Props) {
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
        <MonitorWeightIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No weight logs yet. Log your first entry above.
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
                    {formatDate(log.logDate)}
                  </Typography>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography
                      variant="body2"
                      color="primary.main"
                      fontWeight={600}
                    >
                      {log.weightKg} kg
                    </Typography>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        disabled={isDeleting}
                        onClick={() => onDeleteRequest(log.id)}
                        color="error"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
                <Stack direction="row" gap={1} alignItems="center">
                  <Chip
                    size="small"
                    color={SOURCE_COLOR[log.source]}
                    label={SOURCE_LABEL[log.source]}
                  />
                  {log.notes && (
                    <Typography variant="caption" color="text.secondary">
                      {log.notes}
                    </Typography>
                  )}
                </Stack>
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
            {["Date", "Weight (kg)", "Source", "Notes", ""].map((col, i) => (
              <TableCell key={i} sx={{ textTransform: "uppercase" }}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((log) => (
            <TableRow key={log.id} hover>
              <TableCell>{formatDate(log.logDate)}</TableCell>
              <TableCell>{log.weightKg}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={SOURCE_COLOR[log.source]}
                  label={SOURCE_LABEL[log.source]}
                />
              </TableCell>
              <TableCell>{log.notes ?? "—"}</TableCell>
              <TableCell align="right">
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    disabled={isDeleting}
                    onClick={() => onDeleteRequest(log.id)}
                    color="error"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination}
    </>
  );
}
