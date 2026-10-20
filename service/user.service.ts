import { UserDetailsDto } from "@/types/auth.dto";
import { apiClient } from "./apiClient";

export const userService = {
  async getUserDetails(accessToken: string | null): Promise<UserDetailsDto> {
    return await apiClient<UserDetailsDto>(`/users/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },

  async getUserPreferences(): Promise<UserDetailsDto> {
    return await apiClient<UserDetailsDto>(`/users/me`);
  },

  async updatePreferences(payload: Partial<UserDetailsDto>): Promise<UserDetailsDto> {
    return await apiClient<UserDetailsDto>('/users/me/config', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

}