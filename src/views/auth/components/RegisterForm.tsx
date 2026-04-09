"use client";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";

import type { RegisterDto } from "../types";

type RegisterFormData = RegisterDto & { confirmPassword: string };

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
};

export default function RegisterForm({ onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
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

  const onFormSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }
    const { confirmPassword: _, ...dto } = data;
    onSubmit(dto);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <Stack spacing={2.5}>
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
          type="password"
          autoComplete="new-password"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          {...register("confirmPassword")}
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
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
