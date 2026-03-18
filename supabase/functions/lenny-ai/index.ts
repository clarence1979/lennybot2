import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "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";

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
      const messages = [
        { role: "system", content: LENNY_SYSTEM_PROMPT },
        ...(conversationHistory ?? []),
        { role: "user", content: transcript },
      ];

      const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          max_tokens: 200,
          temperature: 0.85,
        }),
      });

      if (!chatRes.ok) {
        const err = await chatRes.text();
        return new Response(JSON.stringify({ error: err }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const chatData = await chatRes.json();
      const replyText: string = chatData.choices[0].message.content.trim();

      const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
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
        const err = await ttsRes.text();
        return new Response(JSON.stringify({ error: err, text: replyText }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const audioBuffer = await ttsRes.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

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
