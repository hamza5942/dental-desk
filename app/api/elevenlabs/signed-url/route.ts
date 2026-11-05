import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Accessing req or searchParams marks the route dynamic under cacheComponents
  void req.nextUrl.searchParams;

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || process.env.ELEVENLABS_AGENT_ID;

  if (!agentId) {
    return NextResponse.json(
      {
        configured: false,
        error: "ELEVENLABS_AGENT_ID or NEXT_PUBLIC_ELEVENLABS_AGENT_ID not set in environment variables.",
      },
      { status: 200 }
    );
  }

  // 1. If an API key is available, attempt to get a signed URL (useful for private agents)
  if (apiKey) {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
        {
          headers: {
            "xi-api-key": apiKey,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          configured: true,
          signedUrl: data.signed_url,
          agentId: agentId,
        });
      }

      // If signed URL generation returns 401 or lacks convai_write permission,
      // gracefully fall back to direct connection using the public agentId.
    } catch {
      // Graceful fallback to direct public agentId session
    }
  }

  // 2. Return configured agentId directly so client SDK connects seamlessly to the public agent
  return NextResponse.json({
    configured: true,
    signedUrl: null,
    agentId: agentId,
  });
}
