"use client";

import React, { useState, useRef } from "react";

export default function RealTimeStream() {
  const [response, setResponse] = useState<string>(""); // Real-time response string
  const [isLoading, setIsLoading] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]); // Debug logs for troubleshooting
  const responseRef = useRef<string>(""); // Ref to accumulate response

  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const extractContentFromChunk = (chunk: string): string | null => {
    const regex = /content='([^']+)'/g;
    const matches = [];
    let match;
    while ((match = regex.exec(chunk)) !== null) {
      matches.push(match[1]);
    }
    return matches.length > 0 ? matches.join("") : null;
  };

  const handleStream = async () => {
    try {
      setIsLoading(true);
      setResponse(""); // Clear the existing response
      responseRef.current = ""; // Reset the ref
      setDebugLogs([]); // Reset debug logs

      addDebugLog("Starting API request...");

      const apiResponse = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "What are some additional options?" }),
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`HTTP error ${apiResponse.status}: ${errorText}`);
      }

      const reader = apiResponse.body?.getReader();
      if (!reader) throw new Error("No reader available on response body.");

      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunk = decoder.decode(value);
          addDebugLog(`Received chunk: ${chunk}`);

          // Extract content from the chunk
          const content = extractContentFromChunk(chunk);
          if (content) {
            // Append the content to the ref
            responseRef.current += content;
            // Force a re-render by updating the state with the new content
            setResponse(responseRef.current); // This ensures immediate UI update
            addDebugLog(`Extracted content: ${content}`);
          } else {
            addDebugLog("No content found in this chunk.");
          }
        }
      }

      addDebugLog("Stream complete");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      addDebugLog(`Error: ${errorMessage}`);
      setResponse((prev) => prev + `\nError occurred: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      addDebugLog("Process completed");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button
        onClick={handleStream}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
      >
        {isLoading ? "Loading..." : "Start Stream"}
      </button>
      <div className="mt-4 border rounded-lg p-4">
        <h3 className="font-bold">Response</h3>
        {/* Render response incrementally */}
        <div className="whitespace-pre-wrap">{response || "Waiting for response..."}</div>
      </div>
      <div className="mt-4 border rounded-lg p-4">
        <h3 className="font-bold">Debug Logs</h3>
        <div className="whitespace-pre-wrap max-h-64 overflow-y-auto text-sm">
          {debugLogs.map((log, idx) => (
            <p key={idx}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
}