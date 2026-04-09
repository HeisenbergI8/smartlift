export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  email: string;
  password: string;
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
