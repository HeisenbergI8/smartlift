"use client";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import PersonalRecordsFilters from "../components/PersonalRecordsFilters";
import PersonalRecordsTable from "../components/PersonalRecordsTable";
import { usePersonalRecordsActions } from "../hooks/usePersonalRecordsActions";

export default function PersonalRecordsPage() {
  const { records, isLoading, exerciseIdFilter, handleExerciseFilter } =
    usePersonalRecordsActions();

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
        {/* Page header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={3}
          gap={2}
          flexWrap="wrap"
        >
          <Box>
            <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
              <EmojiEventsIcon sx={{ color: "warning.main" }} />
              <Typography variant="h4" sx={{ color: "text.primary" }}>
                Personal Records
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Your best lifts — automatically tracked after every logged set
            </Typography>
          </Box>
        </Stack>

        {/* Filters */}
        <Box mb={3}>
          <PersonalRecordsFilters
            exerciseIdFilter={exerciseIdFilter}
            onExerciseChange={handleExerciseFilter}
          />
        </Box>

        {/* Table */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <PersonalRecordsTable records={records} isLoading={isLoading} />
        </Paper>
      </Container>
    </Box>
  );
}
