"use client";

import { useState } from "react";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
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

import type { NutritionRecommendation, NutritionSource } from "../types";

type Props = {
  history: NutritionRecommendation[];
  isLoading: boolean;
};

const SOURCE_COLOR: Record<NutritionSource, "primary" | "secondary" | "info"> =
  {
    system: "primary",
    coach: "secondary",
    manual: "info",
  };

const SOURCE_LABEL: Record<NutritionSource, string> = {
  system: "Smart",
  coach: "Manual",
  manual: "Manual",
};

export default function NutritionHistoryTable({ history, isLoading }: Props) {
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
        <RestaurantMenuIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No nutrition recommendations yet.
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
                    {item.dailyCaloriesKcal.toLocaleString()} kcal
                  </Typography>
                  <Stack direction="row" gap={0.75}>
                    <Chip
                      size="small"
                      color={SOURCE_COLOR[item.source]}
                      label={SOURCE_LABEL[item.source]}
                    />
                    <Chip
                      size="small"
                      color={item.isActive ? "success" : "default"}
                      label={item.isActive ? "Active" : "Inactive"}
                    />
                  </Stack>
                </Stack>

                <Stack direction="row" gap={3} mb={1}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Protein
                    </Typography>
                    <Typography variant="body2">{item.proteinG} g</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Carbs
                    </Typography>
                    <Typography variant="body2">
                      {item.carbohydratesG} g
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fats
                    </Typography>
                    <Typography variant="body2">{item.fatsG} g</Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 1 }} />

                <Typography variant="caption" color="text.disabled">
                  {new Date(item.effectiveFrom).toLocaleDateString("en-GB")}
                  {item.effectiveTo
                    ? ` – ${new Date(item.effectiveTo).toLocaleDateString("en-GB")}`
                    : " – present"}
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
            <TableCell sx={{ textTransform: "uppercase" }}>Calories</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Protein</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Carbs</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Fats</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Source</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Status</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>
              Effective From
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>
                {item.dailyCaloriesKcal.toLocaleString()} kcal
              </TableCell>
              <TableCell>{item.proteinG} g</TableCell>
              <TableCell>{item.carbohydratesG} g</TableCell>
              <TableCell>{item.fatsG} g</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={SOURCE_COLOR[item.source]}
                  label={SOURCE_LABEL[item.source]}
                />
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={item.isActive ? "success" : "default"}
                  label={item.isActive ? "Active" : "Inactive"}
                />
              </TableCell>
              <TableCell>
                {new Date(item.effectiveFrom).toLocaleDateString("en-GB")}
                {item.effectiveTo
                  ? ` – ${new Date(item.effectiveTo).toLocaleDateString("en-GB")}`
                  : " – present"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination}
    </>
  );
}
