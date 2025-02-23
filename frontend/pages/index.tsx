import { useState, useEffect } from "react";
import InputBar from "../components/InputBar";
import ThoughtBubble from "../components/ThoughtBubble";
import AgentMessage from "../components/AgentMessage";
import NavBar from "../components/NavBar";
import SettingsModal from "../components/SettingsModal";
import LoginModal from "../components/LoginModal";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const [thoughts, setThoughts] = useState<
    Array<{ text: string; introspective_version: string; isLoading?: boolean }>
  >([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchThoughts();
    }
  }, [isAuthenticated]);

  const fetchThoughts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/thoughts/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching thoughts:", errorData);
        return;
      }
      const data = await response.json();
      setThoughts(data);
    } catch (error) {
      console.error("Error fetching thoughts:", error);
    }
  };

  const addThought = async (text: string) => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    // Add thought with loading state
    const tempThought = { text, introspective_version: "", isLoading: true };
    setThoughts((prev) => [...prev, tempThought]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/thoughts/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding thought:", errorData);
        // Remove the temporary thought if there's an error
        setThoughts((prev) => prev.filter((t) => t !== tempThought));
        return;
      }
      const newThought = await response.json();
      // Replace the loading thought with the actual response
      setThoughts((prev) =>
        prev.map((t) => (t === tempThought ? newThought : t))
      );
    } catch (error) {
      console.error("Error adding thought:", error);
      // Remove the temporary thought if there's an error
      setThoughts((prev) => prev.filter((t) => t !== tempThought));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <NavBar onOpenSettings={() => setIsSettingsOpen(true)} />
      <div className="flex h-[calc(100vh-144px)]">
        {/* Left column - Introspective Versions */}
        <div className="flex-1 overflow-y-auto p-4 border-r border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Introspective Thoughts
          </h2>
          <div className="max-w-xl mx-auto">
            {thoughts.map((thought, index) => (
              <ThoughtBubble
                key={index}
                text={thought.introspective_version}
                isLoading={thought.isLoading}
              />
            ))}
          </div>
        </div>

        {/* Right column - Future Feature */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Coming Soon
          </h2>
          <div className="max-w-xl mx-auto">
            <div className="p-4 m-2 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 italic text-center">
                Future feature coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
      <InputBar onThoughtAdd={addThought} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
