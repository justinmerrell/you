import { API_BASE_URL } from "@/config";

interface ContextSource {
  id: string;
  name: string;
  type: "file" | "url" | "text";
  content: string;
  metadata: Record<string, any>;
  isEnabled: boolean;
}

export const contextSourceService = {
  getSources: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/context/sources/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to get context sources");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting context sources:", error);
      throw error;
    }
  },

  createSource: async (source: Omit<ContextSource, "id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/context/sources/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        credentials: "include",
        body: JSON.stringify(source),
      });

      if (!response.ok) {
        throw new Error("Failed to create context source");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating context source:", error);
      throw error;
    }
  },

  updateSource: async (id: string, source: Partial<ContextSource>) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/context/sources/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          credentials: "include",
          body: JSON.stringify(source),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update context source");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating context source:", error);
      throw error;
    }
  },

  deleteSource: async (id: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/context/sources/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete context source");
      }

      return true;
    } catch (error) {
      console.error("Error deleting context source:", error);
      throw error;
    }
  },

  uploadFile: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API_BASE_URL}/api/context/sources/upload/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },
};
