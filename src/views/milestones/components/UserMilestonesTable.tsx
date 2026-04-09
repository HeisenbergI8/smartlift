"use client";

import { useState } from "react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
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

import type { UserMilestone, MilestoneCategory } from "../types";

type Props = {
  userMilestones: UserMilestone[];
  isLoading: boolean;
};

const CATEGORY_COLOR: Record<
  MilestoneCategory,
  "primary" | "secondary" | "success" | "info" | "default"
> = {
  strength: "primary",
  consistency: "secondary",
  weight: "success",
  nutrition: "info",
  general: "default",
};

const CATEGORY_LABEL: Record<MilestoneCategory, string> = {
  strength: "Strength",
  consistency: "Consistency",
  weight: "Weight Loss",
  nutrition: "Nutrition",
  general: "General",
};

const CATEGORY_BORDER: Record<MilestoneCategory, string> = {
  strength: "primary.main",
  consistency: "secondary.main",
  weight: "success.main",
  nutrition: "info.main",
  general: "text.disabled",
};

export default function UserMilestonesTable({
  userMilestones,
  isLoading,
}: Props) {
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

  if (userMilestones.length === 0) {
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
        <MilitaryTechIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No milestones earned yet. Keep lifting and logging!
        </Typography>
      </Box>
    );
  }

  const paginated = userMilestones.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const pagination = (
    <TablePagination
      component="div"
      count={userMilestones.length}
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
          {paginated.map((um) => (
            <Card
              key={um.id}
              variant="outlined"
              sx={{
                bgcolor: "background.default",
                borderLeftWidth: 3,
                borderLeftColor: CATEGORY_BORDER[um.milestone.category],
              }}
            >
              <CardContent sx={{ pb: "12px !important" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={1}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {um.milestone.name}
                  </Typography>
                  <Chip size="small" color="success" label="Earned" />
                </Stack>

                <Stack direction="row" gap={0.75} mb={1}>
                  <Chip
                    size="small"
                    color={CATEGORY_COLOR[um.milestone.category]}
                    label={CATEGORY_LABEL[um.milestone.category]}
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary" mb={0.75}>
                  {um.milestone.description}
                </Typography>

                <Stack direction="row" alignItems="center" gap={0.5}>
                  <EmojiEventsIcon
                    sx={{ fontSize: 13, color: "warning.main" }}
                  />
                  <Typography variant="caption" color="text.disabled">
                    Earned {new Date(um.earnedAt).toLocaleDateString()}
                  </Typography>
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ textTransform: "uppercase" }}>Milestone</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Category</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>
              Description
            </TableCell>
            <TableCell align="right" sx={{ textTransform: "uppercase" }}>
              Earned On
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((um) => (
            <TableRow key={um.id} hover>
              <TableCell sx={{ fontWeight: 600 }}>
                {um.milestone.name}
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={CATEGORY_COLOR[um.milestone.category]}
                  label={CATEGORY_LABEL[um.milestone.category]}
                />
              </TableCell>
              <TableCell
                sx={{ maxWidth: 320, whiteSpace: "normal", lineHeight: 1.4 }}
              >
                {um.milestone.description}
              </TableCell>
              <TableCell align="right">
                {new Date(um.earnedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination}
    </>
  );
}
