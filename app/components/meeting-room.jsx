"use client";

import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useRef, useState } from "react";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const MeetingRoom = ({ callId, onLeave, userId }) => {
  const client = useStreamVideoClient();
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);

  const joinedRef = useRef(false);
  const leavingRef = useRef(false);

  const callType = "default";

  useEffect(() => {
    if (!callId || !client || joinedRef.current) return;
    joinedRef.current = true;

    const init = async () => {
      try {
        const sanitizedCallId = callId.trim();

        const myCall = client.call(callType, sanitizedCallId);

        // creating new call
        await myCall.getOrCreate({
          data: {
            created_by_id: userId,
            members: [{ user_id: userId, role: "call_member" }],
          },
        });
        await myCall.join(),
          await myCall.startClosedCaptions({ language: "en" });

        // we also want to listen if user leaves the call
        myCall.on("call.session_ended", () => {
          console.log("Session Ended");
          onLeave?.();
        });

        setCall(myCall);
      } catch (error) {
        setError(error.message);
      }
    };
    // simply calling the function
    init();

    // if the component unmounts, we want to leave the call
    return () => {
      if (call && !leavingRef.current) {
        leavingRef.current = true;
        call.startClosedCaptions().catch(() => {});
        call.leave().catch(() => {});
      }
    };
  }, [callId, client, userId]);
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Error: {error}
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex items-center justify-center ">
        <div className="animate-spin h-16 w-16 border-t-4 border-blue-500 rounded-full"></div>
        <p className="mt-4 text-lg ">Meeting Loading Soon ......</p>
      </div>
    );
  }

  const handleLeaveClick = async () => {
    if (leavingRef.current) {
      onLeave?.();
      return;
    }
    leavingRef.current = true;
    try {
      if (call) {
        await call.startClosedCaptions().catch(() => {});
        await call.leave().catch(() => {});
      }
    } catch (error) {}
  };

  return (
    <StreamCall call={call}>
      <div className="min-h-screen bg-linear-to-r from-gray-800 via-gray-700 to-gray-800 text-white container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 h-screen">
          {/* Now lets render our speaker layout */}
          <div className="flex flex-col gap-4">
            {/* Speaker Layout */}
            <div className="flex-1 rounded-xl bg-gray-800 border-blue-600 overflow-hidden shadow-2xl">
              <SpeakerLayout />
            </div>
            {/* Call Controls */}
            <div className="flex justify-center pb-4 bg-gray-700 rounded-full px-8 py-4 border border-blue-700 shadow-xl w-fit mx-auto">
              <CallControls onLeave={handleLeaveClick} />
            </div>
          </div>
          {/* Transcription */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl ">
            Transcription
          </div>
        </div>
      </div>
    </StreamCall>
  );
};

export default MeetingRoom;
