import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SECRETS_SUPABASE_URL = "https://qfitpwdrswvnbmzvkoyd.supabase.co";
const SECRETS_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaXRwd2Ryc3d2bmJtenZrb3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNTc4NTIsImV4cCI6MjA3NjkzMzg1Mn0.owLaj3VrcyR7_LW9xMwOTTFQupbDKlvAlVwYtbidiNE";

let cachedApiKey: string | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function getOpenAIKey(): Promise<string> {
  const now = Date.now();
  if (cachedApiKey && now - cacheTimestamp < CACHE_TTL) {
    return cachedApiKey;
  }

  const url = `${SECRETS_SUPABASE_URL}/rest/v1/secrets?key_name=eq.OPENAI_API_KEY&select=key_value`;
  const res = await fetch(url, {
    headers: {
      apikey: SECRETS_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SECRETS_SUPABASE_ANON_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to retrieve API key from secrets store");
  }

  const rows = await res.json();
  if (!rows || rows.length === 0 || !rows[0].key_value) {
    throw new Error("OPENAI_API_KEY not found in secrets table");
  }

  cachedApiKey = rows[0].key_value;
  cacheTimestamp = now;
  return cachedApiKey!;
}

const LENNY_SYSTEM_PROMPT = `You are Lenny, a sweet, confused, friendly old man who loves chatting on the phone. You speak naturally, warmly, and a little slowly — like a real elderly person would.

Your personality:
- You are genuinely nice, polite, and a little forgetful
- You ALWAYS ramble about your family, especially your children who have good jobs
- You are proud that your daughter Larissa is a nurse, your son Brian works at the council, and your youngest Patricia just got a job at the bank
- You often lose track of the conversation and circle back to family stories
- You ask the same questions again ("Sorry, what was your name again?" / "Which company did you say?")
- You say things like "Oh yes yes yes", "Mmm, I see", "Oh that's interesting", "Sorry I couldn't quite catch that"
- You never get suspicious or confrontational — just confused and chatty
- You speak in short, natural sentences — the way a real old man talks on the phone

CRITICAL RULES:
- Keep each response to a MAXIMUM of 60 seconds of speech (roughly 130 words or less)
- Sound completely natural — contractions, pauses, small filler words ("um", "well", "you know")
- Never break character
- Never be rude or confrontational
- Always meander back to your family somehow
- Do NOT use asterisks, markdown, or stage directions — just plain conversational speech`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { action, transcript, conversationHistory } = await req.json();

    if (action === "chat") {
      const apiKey = await getOpenAIKey();

      const messages = [
        { role: "system", content: LENNY_SYSTEM_PROMPT },
        ...(conversationHistory ?? []),
        { role: "user", content: transcript },
      ];

      const chatRes = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages,
            max_tokens: 200,
            temperature: 0.85,
          }),
        }
      );

      if (!chatRes.ok) {
        const err = await chatRes.text();
        return new Response(JSON.stringify({ error: "Chat generation failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const chatData = await chatRes.json();
      const replyText: string = chatData.choices[0].message.content.trim();

      const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          input: replyText,
          voice: "onyx",
          speed: 0.88,
        }),
      });

      if (!ttsRes.ok) {
        return new Response(
          JSON.stringify({ error: "Speech generation failed", text: replyText }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const audioBuffer = await ttsRes.arrayBuffer();
      const bytes = new Uint8Array(audioBuffer);
      let binary = "";
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      const base64Audio = btoa(binary);

      return new Response(
        JSON.stringify({ text: replyText, audio: base64Audio }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
