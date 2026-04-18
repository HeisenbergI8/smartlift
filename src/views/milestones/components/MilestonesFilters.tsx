"use client";

import { useState } from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

import type { MilestoneCategory } from "../types";

type Props = {
  categoryFilter: MilestoneCategory | "";
  onCategoryChange: (value: MilestoneCategory | "") => void;
};

const CATEGORY_LABELS: Record<MilestoneCategory, string> = {
  strength: "Strength",
  consistency: "Consistency",
  weight: "Weight Loss",
  nutrition: "Nutrition",
  general: "General",
};

export default function MilestonesFilters({
  categoryFilter,
  onCategoryChange,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCount = categoryFilter !== "" ? 1 : 0;

  const filterControl = (
    <FormControl size="small" sx={{ minWidth: 220 }}>
      <InputLabel id="milestones-category-filter-label">Category</InputLabel>
      <Select
        labelId="milestones-category-filter-label"
        label="Category"
        value={categoryFilter}
        onChange={(e) =>
          onCategoryChange(e.target.value as MilestoneCategory | "")
        }
      >
        <MenuItem value="">All Categories</MenuItem>
        {(Object.keys(CATEGORY_LABELS) as MilestoneCategory[]).map((cat) => (
          <MenuItem key={cat} value={cat}>
            {CATEGORY_LABELS[cat]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  if (isMobile) {
    return (
      <>
        <Badge badgeContent={activeCount} color="primary">
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />}
            onClick={() => setDrawerOpen(true)}
          >
            Filters
          </Button>
        </Badge>

        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{ zIndex: 1400 }}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              pb: 9,
            },
          }}
        >
          {/* Drag handle */}
          <Box
            sx={{ display: "flex", justifyContent: "center", pt: 1.5, pb: 0.5 }}
          >
            <Box
              sx={{
                width: 36,
                height: 4,
                borderRadius: 2,
                bgcolor: "action.disabled",
              }}
            />
          </Box>
          <Box sx={{ px: 2, pt: 1, pb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Filters
            </Typography>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box sx={{ mb: 2 }}>{filterControl}</Box>
            <Stack direction="row" gap={1} justifyContent="flex-end">
              {activeCount > 0 && (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => onCategoryChange("")}
                  sx={{ color: "text.secondary" }}
                >
                  Clear all
                </Button>
              )}
              <Button
                size="small"
                variant="contained"
                onClick={() => setDrawerOpen(false)}
              >
                Done
              </Button>
            </Stack>
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {filterControl}
    </Box>
  );
}
