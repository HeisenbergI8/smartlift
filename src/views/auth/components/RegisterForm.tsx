"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";

import type { RegisterDto } from "../types";

const registerSchema = v.object({
  firstName: v.pipe(v.string(), v.minLength(1, "First name is required")),
  lastName: v.pipe(v.string(), v.minLength(1, "Last name is required")),
  email: v.pipe(v.string(), v.email("Enter a valid email")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Password must be at least 8 characters"),
  ),
  confirmPassword: v.pipe(v.string(), v.minLength(1, "Confirm your password")),
  accountType: v.picklist(["user", "coach"]),
  isCoachMode: v.boolean(),
});

type Props = {
  onSubmit: (data: RegisterDto) => void;
  isLoading: boolean;
  error?: string;
};

export default function RegisterForm({ onSubmit, isLoading, error }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: valibotResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "user",
      isCoachMode: false,
    },
  });

  const onFormSubmit = (data: RegisterDto) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }
    onSubmit(data);
  };

  const passwordAdornment = (
    show: boolean,
    toggle: React.Dispatch<React.SetStateAction<boolean>>,
  ) => (
    <InputAdornment position="end">
      <IconButton
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => toggle((prev) => !prev)}
        edge="end"
        size="small"
      >
        {show ? (
          <VisibilityOffIcon fontSize="small" />
        ) : (
          <VisibilityIcon fontSize="small" />
        )}
      </IconButton>
    </InputAdornment>
  );

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            {...register("firstName")}
            label="First Name"
            autoComplete="given-name"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            {...register("lastName")}
            label="Last Name"
            autoComplete="family-name"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Box>
        <TextField
          {...register("email")}
          label="Email"
          type="email"
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          {...register("password")}
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            input: {
              endAdornment: passwordAdornment(showPassword, setShowPassword),
            },
          }}
        />
        <TextField
          {...register("confirmPassword")}
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          slotProps={{
            input: {
              endAdornment: passwordAdornment(showConfirm, setShowConfirm),
            },
          }}
        />
        <Controller
          name="accountType"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.accountType}>
              <InputLabel>Account Type</InputLabel>
              <Select {...field} label="Account Type">
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="coach">Coach</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="isCoachMode"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  color="primary"
                />
              }
              label="Enable Coach Mode"
              sx={{ color: "text.secondary" }}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mt: 1 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Create Account"
          )}
        </Button>
      </Stack>
    </form>
  );
}
