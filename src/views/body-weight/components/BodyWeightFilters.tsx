"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

type Props = {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
};

export default function BodyWeightFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  return (
    <Stack direction="row" gap={1.5} flexWrap="wrap">
      <TextField
        label="From"
        type="date"
        size="small"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 160 }}
      />
      <TextField
        label="To"
        type="date"
        size="small"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 160 }}
      />
    </Stack>
  );
}
