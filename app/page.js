"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  // State for creating user name
  const [username, setUsername] = useState("");
  const router = useRouter();
  const handleJoin = () => {
    const name = username.trim() === "" ? "Anonymous" : username.trim();
    const meetingId = process.env.NEXT_PUBLIC_CALL_ID;
    router.push(`/meeting/${meetingId} ?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-8 bg-gray-700/80 rounded-2xl border border-gray-600 w-70 shadow-2xl">
        <h2 className="text-md mb-4 font-normal text-center ">
          Enter Your Name
        </h2>

        <input
          placeholder="e.g Manasi"
          className="px-4 py-3 rounded-lg w-full bg-gray-800/70 border border-gray-900/60 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleJoin}
          className="mt-5 w-full py-3 bg-gray-900 hover-bg-blue-700 rounded-lg font-md "
        >
          Connect Now
        </button>
      </div>
    </div>
  );
}
