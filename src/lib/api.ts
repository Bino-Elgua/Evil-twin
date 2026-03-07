/**
 * API Client for ÀṣẹMirror
 * Communicates with /api routes
 */

export interface SearchResult {
  file: string;
  repo: string;
  content: string;
  relevance: number;
}

export interface SearchResponse {
  success: boolean;
  data?: {
    answer: string;
    sources: SearchResult[];
  };
  error?: string;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    response: string;
    role: string;
  };
  error?: string;
}

export interface TimelineData {
  genesisDate: string;
  daysElapsed: number;
  daysTotal: number;
  percentComplete: number;
  phases: Array<{
    name: string;
    days: number;
    daysElapsed: number;
    color: string;
  }>;
  priorityItems: Array<{
    order: number;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
  }>;
  nextMilestone: any;
}

export interface TimelineResponse {
  success: boolean;
  data?: TimelineData;
  error?: string;
}

export interface VisualizationResponse {
  success: boolean;
  data?: any;
  error?: string;
}

async function apiCall(
  action: string,
  payload: any = {}
): Promise<any> {
  const response = await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, ...payload }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.success && data.error) {
    throw new Error(data.error);
  }

  return data;
}

/**
 * Search endpoint - semantic search with LLM synthesis
 */
export async function search(query: string): Promise<SearchResponse> {
  try {
    const result = await apiCall('search', { query });
    return result as SearchResponse;
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Chat endpoint - multi-turn conversation
 */
export async function chat(
  messages: Array<{ role: string; content: string }>
): Promise<ChatResponse> {
  try {
    const result = await apiCall('chat', { messages });
    return result as ChatResponse;
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Timeline endpoint - 7-year lock countdown + phases
 */
export async function getTimeline(): Promise<TimelineResponse> {
  try {
    const result = await apiCall('timeline');
    return result as TimelineResponse;
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Visualize endpoint - 7-layer pyramid, 1440 wallets, tithe flow
 */
export async function visualize(type: string): Promise<VisualizationResponse> {
  try {
    const result = await apiCall('visualize', { type });
    return result as VisualizationResponse;
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
