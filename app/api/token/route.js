import { StreamClient } from "@stream-io/node-sdk";
import { name } from "@stream-io/video-react-sdk";

// for creating Endpoint like POST or GET
const apiKey = process.env.STREAM_API_KEY;
const secretKey = process.env.STREAM_API_SECRET;

export async function POST(request) {
  try {
    const { userId } = await request.json();
    // Check if both apiKey and secretKey are present or not
    if (!apiKey || !secretKey) {
      return Response.json(
        { error: "API or Secret key is missing " },
        { status: 500 }
      );
    }

    // Lets create new Stream Client
    const serverClient = new StreamClient(apiKey, secretKey);

    // Now we will create user in Stream System
    const newUser = {
      id: userId,
      role: "admin",
      name: userId,
    };

    // Upsert = Update or Insert
    await serverClient.upsertUser(newUser);
    const validity = 60 * 60 * 24; // 24 hours
    const token = serverClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: validity,
    });

    return Response.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return Response.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
