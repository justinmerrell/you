import { API_BASE_URL } from "@/config";

interface AgentNetwork {
  id: string;
  name: string;
  description: string;
  agents: string[];
  isActive: boolean;
}

export const agentNetworkService = {
  getNetworks: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/networks/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to get agent networks");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting agent networks:", error);
      throw error;
    }
  },

  createNetwork: async (network: Omit<AgentNetwork, "id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/networks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        credentials: "include",
        body: JSON.stringify(network),
      });

      if (!response.ok) {
        throw new Error("Failed to create agent network");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating agent network:", error);
      throw error;
    }
  },

  updateNetwork: async (id: string, network: Partial<AgentNetwork>) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/agents/networks/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          credentials: "include",
          body: JSON.stringify(network),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update agent network");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating agent network:", error);
      throw error;
    }
  },

  deleteNetwork: async (id: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/agents/networks/${id}/`,
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
        throw new Error("Failed to delete agent network");
      }

      return true;
    } catch (error) {
      console.error("Error deleting agent network:", error);
      throw error;
    }
  },
};
