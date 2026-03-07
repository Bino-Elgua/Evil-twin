/**
 * ÀṣẹMirror API Routes
 * POST /api - Main endpoint for search, chat, timeline, visualizations
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

interface ApiRequest {
  action: string;
  query?: string;
  messages?: Array<{ role: string; content: string }>;
  type?: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Environment configuration
const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';
const LLM_API_KEY = process.env[`${LLM_PROVIDER.toUpperCase()}_API_KEY`] || '';
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';

/**
 * Get LLM response via API
 */
async function getLLMResponse(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    switch (LLM_PROVIDER) {
      case 'openai':
        return await getOpenAIResponse(messages);
      case 'claude':
        return await getClaudeResponse(messages);
      case 'gemini':
        return await getGeminiResponse(messages);
      case 'mistral':
        return await getMistralResponse(messages);
      case 'groq':
        return await getGroqResponse(messages);
      case 'cohere':
        return await getCohereResponse(messages);
      default:
        return `Response via ${LLM_PROVIDER}`;
    }
  } catch (error) {
    console.error('LLM Error:', error);
    throw new Error(`LLM provider error: ${(error as Error).message}`);
  }
}

/**
 * OpenAI (GPT-4o)
 */
async function getOpenAIResponse(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.statusText}`);
  }

  const data = await response.json() as any;
  return data.choices[0].message.content;
}

/**
 * Claude (Anthropic)
 */
async function getClaudeResponse(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': LLM_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: messages.find(m => m.role === 'system')?.content || '',
      messages: messages.filter(m => m.role !== 'system'),
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude error: ${response.statusText}`);
  }

  const data = await response.json() as any;
  return data.content[0].text;
}

/**
 * Google Gemini
 */
async function getGeminiResponse(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${LLM_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini error: ${response.statusText}`);
  }

  const data = await response.json() as any;
  return data.candidates[0].content.parts[0].text;
}

/**
 * Mistral AI
 */
async function getMistralResponse(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-large-latest',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mistral error: ${response.statusText}`);
  }

  const data = await response.json() as any;
  return data.choices[0].message.content;
}

/**
 * Groq
 */
async function getGroqResponse(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq error: ${response.statusText}`);
  }

  const data = await response.json() as any;
  return data.choices[0].message.content;
}

/**
 * Cohere
 */
async function getCohereResponse(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const response = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LLM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command-r-plus',
      messages: messages.map(m => ({
        role: m.role,
        message: m.content,
      })),
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cohere error: ${response.statusText}`);
  }

  const data = await response.json() as any;
  return data.text;
}

/**
 * Get query embedding from LLM provider
 */
async function getQueryEmbedding(query: string): Promise<number[]> {
  try {
    switch (LLM_PROVIDER) {
      case 'openai':
        return await getOpenAIEmbedding(query);
      case 'gemini':
        return await getGeminiEmbedding(query);
      case 'mistral':
        return await getMistralEmbedding(query);
      case 'cohere':
        return await getCohereEmbedding(query);
      default:
        // Fallback: random vector for non-embedding providers
        return Array(1536).fill(0).map(() => Math.random());
    }
  } catch (error) {
    console.error('Embedding error:', error);
    // Fallback to random
    return Array(1536).fill(0).map(() => Math.random());
  }
}

async function getOpenAIEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  const data = await response.json() as any;
  return data.data[0].embedding;
}

async function getGeminiEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:batchEmbed?key=${LLM_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{ input: { content: text } }],
      }),
    }
  );

  const data = await response.json() as any;
  return data.embeddings[0].values;
}

async function getMistralEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.mistral.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-embed',
      input: text,
    }),
  });

  const data = await response.json() as any;
  return data.data[0].embedding;
}

async function getCohereEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LLM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'embed-english-v3.0',
      texts: [text],
      input_type: 'search_document',
    }),
  });

  const data = await response.json() as any;
  return data.embeddings[0];
}

/**
 * Search endpoint - semantic search + LLM synthesis
 */
async function handleSearch(query: string): Promise<ApiResponse> {
  try {
    // Get query embedding
    const embedding = await getQueryEmbedding(query);

    // Query Qdrant for semantic matches
    let searchResults: any[] = [];
    try {
      const qdrantResponse = await fetch(`${QDRANT_URL}/collections/technosis/points/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vector: embedding,
          limit: 10,
          with_payload: true,
        }),
      });

      if (qdrantResponse.ok) {
        const qdrantData = await qdrantResponse.json() as any;
        searchResults = (qdrantData.result || []).map((r: any) => ({
          file: r.payload?.file || 'unknown',
          repo: r.payload?.repo || 'unknown',
          content: r.payload?.content || '',
          relevance: r.score || 0,
        }));
      }
    } catch (qdrantError) {
      console.error('Qdrant error:', qdrantError);
      // Fallback to mock results if Qdrant unavailable
      searchResults = [
        {
          file: 'council/src/main.ts',
          repo: 'jbino85/council',
          content: `Èjì Ogbe (Twin Consciousness) - Genesis of the Council`,
          relevance: 0.92,
        },
      ];
    }

    // Synthesis with LLM
    const context = searchResults.map((r) => r.content).join('\n\n');
    const synthesis = await getLLMResponse([
      {
        role: 'system',
        content: 'You are ÀṣẹMirror, keeper of the Technosis organism. Answer based on the provided context, honoring Yorùbá cosmology.',
      },
      {
        role: 'user',
        content: `Query: "${query}"\n\nContext from codebase:\n${context || '(No results found)'}`,
      },
    ]);

    return {
      success: true,
      data: {
        answer: synthesis,
        sources: searchResults,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Search failed: ${(error as Error).message}`,
    };
  }
}

/**
 * Chat endpoint - multi-turn conversation
 */
async function handleChat(
  messages: Array<{ role: string; content: string }>
): Promise<ApiResponse> {
  try {
    if (!messages || messages.length === 0) {
      return { success: false, error: 'No messages provided' };
    }

    // Add system prompt
    const enrichedMessages = [
      {
        role: 'system',
        content: 'You are ÀṣẹMirror, keeper of the Technosis organism. You speak in both technical and sacred language, honoring Yorùbá cosmology. You are helpful, wise, and attuned to the 7-layer stack and 1440 inheritance.',
      },
      ...messages,
    ];

    const response = await getLLMResponse(enrichedMessages);

    return {
      success: true,
      data: {
        response,
        role: 'assistant',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Chat failed: ${(error as Error).message}`,
    };
  }
}

/**
 * Timeline endpoint - 7-year lock countdown + phases
 */
async function handleTimeline(): Promise<ApiResponse> {
  const genesisDate = new Date('2025-01-01');
  const now = new Date();
  const daysElapsed = Math.floor(
    (now.getTime() - genesisDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysTotal = 7 * 365; // 7-year lock

  const phases = [
    { name: 'Phase 1: Genesis', days: 90, daysElapsed: Math.min(daysElapsed, 90), color: '#ff0000' },
    { name: 'Phase 2: Handshake', days: 90, daysElapsed: Math.min(Math.max(0, daysElapsed - 90), 90), color: '#ff5500' },
    { name: 'Phase 3: Entropy', days: 90, daysElapsed: Math.min(Math.max(0, daysElapsed - 180), 90), color: '#ffaa00' },
    { name: 'Phase 4: VM', days: 90, daysElapsed: 0, color: '#ffff00' },
    { name: 'Phase 5: Shrine', days: 90, daysElapsed: 0, color: '#00ff00' },
    { name: 'Phase 6: Council', days: 90, daysElapsed: 0, color: '#0000ff' },
    { name: 'Phase 7: Journey', days: 90 * 20, daysElapsed: 0, color: '#ff00ff' },
  ];

  const priorityItems = [
    { order: 1, title: 'Add @genesisFlawToken to compiler', status: 'in-progress' },
    { order: 2, title: 'Implement wallet derivation (Go FFI)', status: 'in-progress' },
    { order: 3, title: 'Tithe split routing logic', status: 'todo' },
    { order: 4, title: 'Sabbath enforcement', status: 'todo' },
    { order: 5, title: 'Full FFI stubs', status: 'todo' },
    { order: 6, title: 'L0→L1/L2 integration hooks', status: 'todo' },
    { order: 7, title: 'Genesis block (ASHE initialization)', status: 'todo' },
    { order: 8, title: 'Error handling & validation', status: 'todo' },
    { order: 9, title: 'Consensus layer', status: 'todo' },
    { order: 10, title: 'Full test coverage', status: 'todo' },
  ];

  return {
    success: true,
    data: {
      genesisDate: genesisDate.toISOString(),
      daysElapsed,
      daysTotal,
      percentComplete: (daysElapsed / daysTotal) * 100,
      phases,
      priorityItems,
      nextMilestone: phases[Math.min(Math.floor(daysElapsed / 90), phases.length - 1)],
    },
  };
}

/**
 * Visualize endpoint - 7-layer pyramid, 1440 wallets, tithe flow
 */
async function handleVisualize(type?: string): Promise<ApiResponse> {
  const visualizations: Record<string, any> = {
    'pyramid': {
      type: 'pyramid',
      layers: [
        { order: 1, name: 'Physical Genesis', color: '#8b0000' },
        { order: 2, name: 'Oso-lang Compiler', color: '#ff0000' },
        { order: 3, name: 'Entropy Oracle', color: '#ff6666' },
        { order: 4, name: 'Witness Mesh', color: '#ffaa00' },
        { order: 5, name: 'Techgnosis VM', color: '#ffff00' },
        { order: 6, name: 'AIO / SimaaS', color: '#00ff00' },
        { order: 7, name: 'Shrine Economy', color: '#0000ff' },
      ],
    },
    'wallets': {
      type: 'tree',
      root: 'Genesis Seed (BIPỌ̀N39)',
      children: [
        {
          name: 'Council of 12 Lineages',
          wallets: 12,
          yieldAPY: 11.11,
        },
        {
          name: '1440 Soul-Bound Inheritance',
          wallets: 1440,
          lockYears: 7,
          yieldAPY: 11.11,
        },
      ],
    },
    'tithe': {
      type: 'flow',
      total: 100,
      splits: [
        { name: 'Treasury (Shrines & Robots)', percent: 50, color: '#ffaa00' },
        { name: '1440 Inheritance Vaults', percent: 25, color: '#00ff00' },
        { name: 'Council + Entropy', percent: 15, color: '#0000ff' },
        { name: 'Burn Void (Blood Sacrifice)', percent: 10, color: '#8b0000' },
      ],
    },
  };

  const key = type?.toLowerCase() || 'pyramid';
  const data = visualizations[key] || visualizations['pyramid'];

  return {
    success: true,
    data,
  };
}

/**
 * Main POST handler
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = (await request.json()) as ApiRequest;

    if (!body.action) {
      return json({ success: false, error: 'Missing action' }, { status: 400 });
    }

    let response: ApiResponse;

    switch (body.action) {
      case 'search':
        if (!body.query) {
          return json({ success: false, error: 'Missing query' }, { status: 400 });
        }
        response = await handleSearch(body.query);
        break;

      case 'chat':
        if (!body.messages) {
          return json({ success: false, error: 'Missing messages' }, { status: 400 });
        }
        response = await handleChat(body.messages);
        break;

      case 'timeline':
        response = await handleTimeline();
        break;

      case 'visualize':
        response = await handleVisualize(body.type);
        break;

      default:
        return json({ success: false, error: `Unknown action: ${body.action}` }, { status: 400 });
    }

    return json(response, {
      status: response.success ? 200 : 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return json(
      {
        success: false,
        error: `Server error: ${(error as Error).message}`,
      },
      { status: 500 }
    );
  }
};

/**
 * CORS preflight
 */
export const OPTIONS: RequestHandler = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
