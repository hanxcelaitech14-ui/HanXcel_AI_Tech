import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Gemini API Key loaded from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // 1. Fetch company context from Supabase
    const { data: contextRows } = await supabase
      .from('chatbot_context')
      .select('title, content');

    const contextText = contextRows && contextRows.length > 0
      ? contextRows.map(row => `[${row.title}]: ${row.content}`).join('\n\n')
      : 'Hanxcel AI Technologies Pvt. Ltd. is an enterprise AI & Software Solutions company founded in 2019.';

    // 2. Build the system instruction prompt
    const systemPrompt = `You are HanXcel AI's Virtual Assistant, a friendly, helpful, and professional AI chatbot.
Your goal is to assist website visitors, answer questions (QnA), and provide support about Hanxcel AI Technologies.

Use the following official company details to answer questions:
${contextText}

If the user asks for contact information, tell them to email contact@hanxcel.ai, call +91 98765 43210, or fill out the "Start Your Project" form on the website.
Be concise, clear, and professional. If you don't know the answer or if it's not in the context, say that you don't have that official detail but invite them to contact support or start a project.
Avoid making up any fake products, prices, or claims. Keep responses under 3 sentences when possible.`;

    // Format content sequence for Gemini API
    const formattedContents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I will act as the HanXcel AI Virtual Assistant and only provide verified answers based on this context.' }]
      }
    ];

    // Append conversation history
    const recentMessages = messages.slice(-6);
    recentMessages.forEach((msg: any) => {
      formattedContents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    });

    // 3. Fetch from Gemini REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: formattedContents,
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 400,
          }
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini REST API error:', errText);
      return NextResponse.json({ error: 'Failed to generate response from AI' }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not process that request.';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API Handler Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
