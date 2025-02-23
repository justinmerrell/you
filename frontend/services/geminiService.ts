import { API_BASE_URL } from "@/config";

export const geminiService = {
  getAuthUrl: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/agents/gemini/auth-url/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get auth URL");
      }

      const data = await response.json();
      return data.auth_url;
    } catch (error) {
      console.error("Error getting Gemini auth URL:", error);
      throw error;
    }
  },

  getConfig: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/agents/gemini/config/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get Gemini config");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting Gemini config:", error);
      throw error;
    }
  },

  updateConfig: async (config: any) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/agents/gemini/config/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          credentials: "include",
          body: JSON.stringify(config),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Gemini config");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating Gemini config:", error);
      throw error;
    }
  },

  disconnect: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/agents/gemini/disconnect/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to disconnect Gemini");
      }

      return true;
    } catch (error) {
      console.error("Error disconnecting Gemini:", error);
      throw error;
    }
  },
};
