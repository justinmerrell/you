import { useState, useEffect } from "react";
import { geminiService } from "../services/geminiService";
import { agentNetworkService } from "../services/agentNetworkService";
import { contextSourceService } from "../services/contextSourceService";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [isGeminiConnected, setIsGeminiConnected] = useState(false);
  const [networks, setNetworks] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [newNetwork, setNewNetwork] = useState({
    name: "",
    description: "",
    agents: [],
  });
  const [newSource, setNewSource] = useState({
    name: "",
    type: "text",
    content: "",
  });
  const [showNetworkOptions, setShowNetworkOptions] = useState(false);
  const [matrixConfig, setMatrixConfig] = useState({
    homeserver: "",
    accessToken: "",
  });
  const [ircConfig, setIrcConfig] = useState({
    server: "",
    channel: "",
    nickname: "",
  });

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const authUrl = await geminiService.getAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError("Failed to initiate Google authentication");
      console.error("Google auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeminiApiKey = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await geminiService.updateConfig({ api_key: geminiApiKey });
      setIsGeminiConnected(true);
    } catch (err) {
      setError("Failed to save Gemini API key");
      console.error("Gemini config error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeminiDisconnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await geminiService.disconnect();
      setIsGeminiConnected(false);
      setGeminiApiKey("");
    } catch (err) {
      setError("Failed to disconnect Gemini");
      console.error("Gemini disconnect error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatrixConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement Matrix connection
      // await agentNetworkService.connectMatrix(matrixConfig);
      setShowNetworkOptions(false);
    } catch (err) {
      setError("Failed to connect to Matrix");
      console.error("Matrix connection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIRCConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement IRC connection
      // await agentNetworkService.connectIRC(ircConfig);
      setShowNetworkOptions(false);
    } catch (err) {
      setError("Failed to connect to IRC");
      console.error("IRC connection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Gemini config on mount
  useEffect(() => {
    const loadGeminiConfig = async () => {
      try {
        const config = await geminiService.getConfig();
        if (config.api_key) {
          setIsGeminiConnected(true);
          setGeminiApiKey(config.api_key);
        }
      } catch (err) {
        console.error("Error loading Gemini config:", err);
      }
    };
    loadGeminiConfig();
  }, []);

  // Check for auth callback status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const tab = urlParams.get("tab");

    if (status === "success" && tab === "accounts") {
      setActiveTab("accounts");
      // Optionally show a success message
    }
  }, []);

  // Load agent networks
  useEffect(() => {
    if (activeTab === "agents") {
      loadNetworks();
    }
  }, [activeTab]);

  // Load context sources
  useEffect(() => {
    if (activeTab === "context") {
      loadSources();
    }
  }, [activeTab]);

  const loadNetworks = async () => {
    try {
      setIsLoading(true);
      const data = await agentNetworkService.getNetworks();
      setNetworks(data);
    } catch (err) {
      setError("Failed to load agent networks");
      console.error("Network loading error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSources = async () => {
    try {
      setIsLoading(true);
      const data = await contextSourceService.getSources();
      setSources(data);
    } catch (err) {
      setError("Failed to load context sources");
      console.error("Source loading error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNetwork = async () => {
    try {
      setIsLoading(true);
      await agentNetworkService.createNetwork({
        ...newNetwork,
        isActive: true,
      });
      setNewNetwork({ name: "", description: "", agents: [] });
      await loadNetworks();
    } catch (err) {
      setError("Failed to create agent network");
      console.error("Network creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSource = async () => {
    try {
      setIsLoading(true);
      await contextSourceService.createSource({
        ...newSource,
        type: newSource.type as "text" | "url" | "file",
        metadata: {},
        isEnabled: true,
      });
      setNewSource({ name: "", type: "text", content: "" });
      await loadSources();
    } catch (err) {
      setError("Failed to create context source");
      console.error("Source creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      await contextSourceService.uploadFile(file);
      await loadSources();
    } catch (err) {
      setError("Failed to upload file");
      console.error("File upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl h-[50vh] flex">
        {/* Left sidebar navigation */}
        <div className="w-64 border-r border-gray-200 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("agents")}
            className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
              activeTab === "agents"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">🤖</span>
            <span>Agents</span>
          </button>
          <button
            onClick={() => setActiveTab("networks")}
            className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
              activeTab === "networks"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">🌐</span>
            <span>Agent Networks</span>
          </button>
          <button
            onClick={() => setActiveTab("pairagents")}
            className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
              activeTab === "pairagents"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">✨</span>
            <span>AI Models</span>
          </button>
          <button
            onClick={() => setActiveTab("context")}
            className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
              activeTab === "context"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">📚</span>
            <span>Context</span>
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
              activeTab === "account"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">👤</span>
            <span>Account</span>
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {activeTab === "agents" && "Agents"}
              {activeTab === "networks" && "Agent Networks"}
              {activeTab === "pairagents" && "AI Models"}
              {activeTab === "context" && "Context Sources"}
              {activeTab === "account" && "Account Settings"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {activeTab === "pairagents" && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Connect to external AI models and services.
              </p>
              <div className="space-y-2">
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">✨</span>
                    <div>
                      <h4 className="font-medium">Google Gemini</h4>
                      <p className="text-sm text-gray-500">
                        Connect to Google's Gemini AI models
                      </p>
                    </div>
                  </div>

                  {!isGeminiConnected ? (
                    <div className="space-y-3">
                      <input
                        type="password"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={handleGeminiApiKey}
                        disabled={isLoading || !geminiApiKey}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                      >
                        {isLoading ? "Connecting..." : "Connect Gemini"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-green-600">
                        ✓ Gemini Connected
                      </p>
                      <button
                        onClick={handleGeminiDisconnect}
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
                      >
                        {isLoading ? "Disconnecting..." : "Disconnect Gemini"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "networks" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-gray-600">
                  Connect to different communities and networks to expand your
                  agent's reach.
                </p>

                {/* Network connection options */}
                <div className="space-y-4">
                  {/* Matrix Connection */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">🔗</span>
                      <div>
                        <h4 className="font-medium">Matrix Community</h4>
                        <p className="text-sm text-gray-500">
                          Connect to a Matrix homeserver and rooms
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={matrixConfig.homeserver}
                        onChange={(e) =>
                          setMatrixConfig({
                            ...matrixConfig,
                            homeserver: e.target.value,
                          })
                        }
                        placeholder="Matrix homeserver URL (e.g., matrix.org)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="password"
                        value={matrixConfig.accessToken}
                        onChange={(e) =>
                          setMatrixConfig({
                            ...matrixConfig,
                            accessToken: e.target.value,
                          })
                        }
                        placeholder="Access Token"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={handleMatrixConnect}
                        disabled={
                          isLoading ||
                          !matrixConfig.homeserver ||
                          !matrixConfig.accessToken
                        }
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                      >
                        {isLoading ? "Connecting..." : "Connect to Matrix"}
                      </button>
                    </div>
                  </div>

                  {/* IRC Connection */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">💬</span>
                      <div>
                        <h4 className="font-medium">IRC Network</h4>
                        <p className="text-sm text-gray-500">
                          Connect to an IRC server and channels
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={ircConfig.server}
                        onChange={(e) =>
                          setIrcConfig({ ...ircConfig, server: e.target.value })
                        }
                        placeholder="IRC server (e.g., irc.libera.chat)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        value={ircConfig.channel}
                        onChange={(e) =>
                          setIrcConfig({
                            ...ircConfig,
                            channel: e.target.value,
                          })
                        }
                        placeholder="Channel name (e.g., #general)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        value={ircConfig.nickname}
                        onChange={(e) =>
                          setIrcConfig({
                            ...ircConfig,
                            nickname: e.target.value,
                          })
                        }
                        placeholder="Nickname"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={handleIRCConnect}
                        disabled={
                          isLoading ||
                          !ircConfig.server ||
                          !ircConfig.channel ||
                          !ircConfig.nickname
                        }
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                      >
                        {isLoading ? "Connecting..." : "Connect to IRC"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "agents" && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Configure and manage your AI agents.
              </p>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center h-32">
                  <p className="text-gray-500">
                    Agent configuration coming soon
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "context" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Context Sources</h3>
                <p className="text-gray-600">
                  Manage your context sources to provide additional information
                  to your AI agents.
                </p>

                {/* Create new source form */}
                <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <h4 className="font-medium">Add New Source</h4>
                  <input
                    type="text"
                    value={newSource.name}
                    onChange={(e) =>
                      setNewSource({ ...newSource, name: e.target.value })
                    }
                    placeholder="Source name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <select
                    value={newSource.type}
                    onChange={(e) =>
                      setNewSource({
                        ...newSource,
                        type: e.target.value as "file" | "url" | "text",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="text">Text</option>
                    <option value="url">URL</option>
                    <option value="file">File</option>
                  </select>
                  {newSource.type === "file" ? (
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full"
                    />
                  ) : (
                    <textarea
                      value={newSource.content}
                      onChange={(e) =>
                        setNewSource({ ...newSource, content: e.target.value })
                      }
                      placeholder={
                        newSource.type === "url" ? "Enter URL" : "Enter content"
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                  <button
                    onClick={handleCreateSource}
                    disabled={
                      isLoading ||
                      !newSource.name ||
                      (!newSource.content && newSource.type !== "file")
                    }
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {isLoading ? "Adding..." : "Add Source"}
                  </button>
                </div>

                {/* Existing sources list */}
                <div className="space-y-4">
                  {sources.map((source) => (
                    <div
                      key={source.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{source.name}</h4>
                          <p className="text-sm text-gray-600">
                            Type: {source.type}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              /* Handle edit */
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              /* Handle delete */
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
