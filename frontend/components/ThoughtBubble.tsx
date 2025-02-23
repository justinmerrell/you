import { useState } from "react";

interface ThoughtBubbleProps {
  text: string | null;
  isLoading?: boolean;
}

export default function ThoughtBubble({
  text,
  isLoading = false,
}: ThoughtBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4 m-2 bg-white rounded-full shadow-md">
        <div className="flex items-center justify-center">
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!text) {
    return null;
  }

  return (
    <div
      className="p-4 m-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer"
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
