import { StreamVideo } from "@stream-io/video-react-sdk";
import { useStreamClients } from "../hooks/use-stream-clients";
import { Chat } from "stream-chat-react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export default function StreamProvider({ children, user, token }) {
  const { videoClient, chatClient } = useStreamClients({ apiKey, user, token });

  // Initializing the app with it
  if (!videoClient || !chatClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-700 via-gray-900 to-gray-700">
        <p>Connecting ......</p>
      </div>
    );
  }

  return (
    <StreamVideo client={videoClient}>
      <Chat client={chatClient}>{children}</Chat>
    </StreamVideo>
  );
}
