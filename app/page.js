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
    router.push(`/meeting/${meetingId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-900 via-gray-800 to-purple-900">
      <div className="p-4 bg-#928484-700/80 rounded-2xl border border-gray-600 w-104 h-120 shadow-2xl">
        <p className="text-sm mt-1 text-center">
          Connect, collaborate, and let AI handle the rest.
        </p>
        <img
          src="c_logo.png"
          alt="Convixa logo"
          className="h-60 w-auto pb-4  ml-20 items-center  justify-center"
        />

        <h2 className="text-sm mb-4 text-gray-200 font-normal text-center ">
          Enter Your Name
        </h2>

        <input
          placeholder="e.g Mansi"
          className="px-4 py-3 rounded-lg w-full bg-#5e4949-800/70 border border-gray-900/60 text-gray-200"
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
