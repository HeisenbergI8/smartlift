export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  isCoachMode: boolean;
  accountType: "user" | "coach";
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isCoachMode: boolean;
  accountType: "user" | "coach";
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

/** Raw shape returned by GET /auth/me */
export type MeResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isCoachMode: boolean;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
  role: string;
};
