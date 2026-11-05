import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || process.env.ELEVENLABS_AGENT_ID;

  if (!apiKey || !agentId) {
    return NextResponse.json(
      {
        configured: false,
        error: "ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID not set in environment variables.",
      },
      { status: 200 }
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { configured: false, error: `ElevenLabs API error: ${errText}` },
        { status: 200 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      configured: true,
      signedUrl: data.signed_url,
      agentId: agentId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { configured: false, error: message },
      { status: 500 }
    );
  }
}

