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

import type { NotificationType } from "../types";
import type { ReadFilter } from "../hooks/useNotificationActions";

type Props = {
  typeFilter: NotificationType | "";
  readFilter: ReadFilter;
  onTypeChange: (value: NotificationType | "") => void;
  onReadFilterChange: (value: ReadFilter) => void;
};

const TYPE_LABELS: Record<NotificationType, string> = {
  workout_reminder: "Workout Reminder",
  missed_session: "Missed Session",
  nutrition_reminder: "Nutrition Reminder",
  ego_lift_warning: "Ego-Lift Warning",
  progression_update: "Progression Update",
  milestone: "Milestone",
  general: "General",
};

const NOTIFICATION_TYPES: NotificationType[] = [
  "workout_reminder",
  "missed_session",
  "nutrition_reminder",
  "ego_lift_warning",
  "progression_update",
  "milestone",
  "general",
];

export default function NotificationsFilters({
  typeFilter,
  readFilter,
  onTypeChange,
  onReadFilterChange,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCount =
    (typeFilter !== "" ? 1 : 0) + (readFilter !== "all" ? 1 : 0);

  const filterControls = (
    <Stack direction={isMobile ? "column" : "row"} gap={2} flexWrap="wrap">
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="notifications-type-filter-label">Type</InputLabel>
        <Select
          labelId="notifications-type-filter-label"
          label="Type"
          value={typeFilter}
          onChange={(e) =>
            onTypeChange(e.target.value as NotificationType | "")
          }
        >
          <MenuItem value="">All Types</MenuItem>
          {NOTIFICATION_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {TYPE_LABELS[type]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="notifications-read-filter-label">Status</InputLabel>
        <Select
          labelId="notifications-read-filter-label"
          label="Status"
          value={readFilter}
          onChange={(e) => onReadFilterChange(e.target.value as ReadFilter)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="unread">Unread</MenuItem>
          <MenuItem value="read">Read</MenuItem>
        </Select>
      </FormControl>
    </Stack>
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
            sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, pb: 9 },
          }}
        >
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
            <Box sx={{ mb: 2 }}>{filterControls}</Box>
            <Stack direction="row" gap={1} justifyContent="flex-end">
              {activeCount > 0 && (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => {
                    onTypeChange("");
                    onReadFilterChange("all");
                  }}
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
      {filterControls}
    </Box>
  );
}
