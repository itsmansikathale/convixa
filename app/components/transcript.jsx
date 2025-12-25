"use client";

import { useCall } from "@stream-io/video-react-sdk";
import React, { useEffect, useRef, useState } from "react";
import { useChatContext } from "stream-chat-react";

const TranscriptPanel = () => {
  // check whether it is using transcription or not
  // const client = useChatContext();
  const [transcript, setTranscript] = useState([]);

  const transcriptEndRef = (useRef < HTMLDivElement) | (null > null);

  // const transcriptEndRef = useRef(null);
  const call = useCall();

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  useEffect(() => {
    if (!call) {
      console.log("⚠️ Call not ready");
      return;
    }

    const handleClosedCaption = (event) => {
      const text = event?.closed_caption?.text;
      if (text) {
        setTranscript((prev) => [...prev, text]);
        console.log("🗒️ Caption", text);
      }

      if (event.closed_caption.text) {
        const newTranscript = {
          text: event.closed_caption.text,
          speaker:
            event.closed_caption.user?.name ||
            event.closed_caption.user?.id ||
            "Unknown",
          timestamp: new Date(
            event.closed_caption.start_time
          ).toLocaleDateString(),
        };
        setTranscript((prev) => [...prev, newTranscript]);
      }
    };

    // const callId = process.env.NEXT_PUBLIC_CALL_ID;
    // const channel = client.channel("messaging", callId);
    // channel.watch();

    call.on("call.closed_caption", handleClosedCaption);
    return () => {
      console.log("🧹 Cleaning up caption listeners");
      call.off("call.closed_caption", handleClosedCaption);
      // channel.off("message.new", handleNewMessage);
    };
  }, [call]);

  return (
    <div className="h-full flex flex-col">
      <div
        className="px-6 py-5 border-b border-gray-700 bg-linear-to-r from-gray-800 to-gray-750
      flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-2xl">📝</div>
          <div>
            <h3 className="text-lg font-bold text-white  ">Live Transcript</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {transcript.length}
              {transcript.length === 1 ? "message" : "messages"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-500 font-medium">Live</span>
        </div>
      </div>

      {/* transcript list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-850 custom-scrollbar">
        {transcript.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <p className="text-gray-300 text-lg font-semibold mb-2 ">
              Waiting for transcripts .....
            </p>
            <p className="text-gray-500 text-sm max-w-xs">
              Start speaking to see live transcription appear here.
            </p>
          </div>
        ) : (
          transcript.map((item, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-3 text-sm">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{item.speaker}</span>
                <span>{item.timestamp}</span>
              </div>
              <p className="text-white">{item.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TranscriptPanel;
