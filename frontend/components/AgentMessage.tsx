import { useState } from "react";

export default function AgentMessage({ text }: { text: string | null }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If text is null or undefined, show a placeholder
  if (!text) {
    return (
      <div className="p-4 m-2 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 italic">Processing...</p>
      </div>
    );
  }

  return (
    <div
      className="p-4 m-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <p className="text-gray-800">
        {isExpanded
          ? text
          : text.slice(0, 50) + (text.length > 50 ? "..." : "")}
      </p>
    </div>
  );
}
