import { useCallback } from "react";
import { toast } from "react-toastify";

import {
  useGetProfileQuery,
  useUpsertProfileMutation,
} from "@/store/services/userProfileApi";

import type { UpdateProfileDto } from "../types";

export function useUserProfileActions() {
  const { data: profile, isLoading, isError } = useGetProfileQuery();
  const [upsertProfile, { isLoading: isSaving }] = useUpsertProfileMutation();

  const handleSave = useCallback(
    async (dto: UpdateProfileDto) => {
      try {
        await upsertProfile(dto).unwrap();
        toast.success("Profile updated");
      } catch (err) {
        toast.error((err as Error).message ?? "Failed to update profile");
      }
    },
    [upsertProfile],
  );

  return {
    profile,
    isLoading,
    isError,
    handleSave,
    isSaving,
  };
}
