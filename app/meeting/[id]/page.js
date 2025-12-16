"use client";

import MeetingRoom from "@/app/components/meeting-room";
import StreamProvider from "@/app/components/stream-provider";
import { StreamTheme } from "@stream-io/video-react-sdk";
// This will also be a client component since we are using hooks here

import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const MeetingPage = () => {
  // searchParams is for the user name
  const searchParams = useSearchParams();
  //   params is for the id
  // const rawCallId = params.id;
  const params = useParams();
  const router = useRouter();

  const callId = params.id;
  const name = searchParams.get("name") || "Anonymous";
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUser({
      // "Manasi Kathale" -> "manasi-kathale"
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
    });
  }, [name]);

  useEffect(() => {
    if (!user) return;

    fetch("/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) setToken(data.token);
        else setError("No token returned");
      })
      .catch((err) => setError(err.message));
  }, [user]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
        <div className="p-6 bg-red-900/20 border border-red-600 rounded-lg">
          <p className="text-red-600 font-bold text-lg mb-2 "> Error</p>
          <p>{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-800"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-200 mx-auto "></div>
          <p className="mt-4 text-lg">Connecting</p>
        </div>
      </div>
    );
  }

  const handleLeave = () => {
    router.push("/");
  };

  return (
    <StreamProvider user={user} token={token}>
      {/* This will make the call  UI look good */}
      <StreamTheme>
        <MeetingRoom callId={callId} userId={user.id} onLeave={handleLeave} />
      </StreamTheme>
    </StreamProvider>
  );
};
export default MeetingPage;
