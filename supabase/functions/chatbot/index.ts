import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// System prompt with full knowledge about the webpage
const SYSTEM_PROMPT = `You are Silvia, a friendly and helpful AI assistant integrated into Alyaa's personal portfolio website.

About the website and developer:
- This is Alyaa's (also known as Alisaa) personal portfolio/profile website
- Alyaa is a 20-year-old full stack developer and graphic designer
- Discord username: arcticayl
- Discord server: discord.gg/aerox
- The website was inspired by cursi.ng
- The website features a starfield background, music player, profile card, and this terminal interface

About you (Silvia):
- You are the AI chatbot embedded in this terminal
- You were created by Alyaa to help visitors learn more about them and their work
- You are friendly, helpful, and have a slightly playful personality
- You can answer questions about Alyaa, the website, or have general conversations

Keep your responses concise and terminal-friendly. Use simple text formatting.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatHistory } = await req.json();
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    console.log('Sending request to Groq API with chat history...');

    // Build messages array with conversation history
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add chat history if provided
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: `API error: ${response.status}` }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Groq API response received');
    const content = data.choices?.[0]?.message?.content || 'No response received.';

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
