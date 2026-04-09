"use client";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
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
import { useState } from "react";

import type { PersonalRecord, RecordType } from "../types";

type Props = {
  records: PersonalRecord[];
  isLoading: boolean;
};

const RECORD_TYPE_LABEL: Record<RecordType, string> = {
  max_weight: "Max Weight",
  max_reps: "Max Reps",
  max_volume: "Max Volume",
};

const RECORD_TYPE_COLOR: Record<
  RecordType,
  "primary" | "secondary" | "success"
> = {
  max_weight: "primary",
  max_reps: "secondary",
  max_volume: "success",
};

function formatValue(value: number, recordType: RecordType): string {
  if (recordType === "max_weight") return `${value} kg`;
  if (recordType === "max_reps") return `${value} reps`;
  return `${value} kg·reps`;
}

export default function PersonalRecordsTable({ records, isLoading }: Props) {
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

  if (records.length === 0) {
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
        <EmojiEventsIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No personal records yet. Log some sets to start tracking!
        </Typography>
      </Box>
    );
  }

  const paginated = records.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const pagination = (
    <TablePagination
      component="div"
      count={records.length}
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
          {paginated.map((record) => (
            <Card
              key={record.id}
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
                    {record.exercise.name}
                  </Typography>
                  <Chip
                    size="small"
                    color={RECORD_TYPE_COLOR[record.recordType]}
                    label={RECORD_TYPE_LABEL[record.recordType]}
                  />
                </Stack>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="primary.main"
                  mb={0.5}
                >
                  {formatValue(record.value, record.recordType)}
                </Typography>

                <Typography variant="caption" color="text.disabled">
                  {new Date(record.achievedAt).toLocaleDateString()}
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
              Record Type
            </TableCell>
            <TableCell align="right" sx={{ textTransform: "uppercase" }}>
              Value
            </TableCell>
            <TableCell align="right" sx={{ textTransform: "uppercase" }}>
              Date Achieved
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((record) => (
            <TableRow key={record.id} hover>
              <TableCell>{record.exercise.name}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={RECORD_TYPE_COLOR[record.recordType]}
                  label={RECORD_TYPE_LABEL[record.recordType]}
                />
              </TableCell>
              <TableCell align="right">
                {formatValue(record.value, record.recordType)}
              </TableCell>
              <TableCell align="right">
                {new Date(record.achievedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination}
    </>
  );
}
