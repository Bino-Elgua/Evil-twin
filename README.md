![Version](https://img.shields.io/badge/version-v1.0-blue)
![License](https://img.shields.io/badge/license-Private-darkred)
![Layer](https://img.shields.io/badge/layer-Agentic-blueviolet)
# ⚡ Evil-Twin — ÀṣẹMirror Advanced Edition

**The fully-featured unified shrine for Technosis** — An AI-powered knowledge management platform with semantic search, multi-turn chat, and sacred Technosis visualizations. This is the **advanced variant** of ÀṣẹMirror with complete UI tabs, ChatBox, and TypeScript strict mode.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Semantic Search** | RAG-powered search across 4 repos (English, Yorùbá, technical terms) with LLM synthesis + cited sources |
| 💬 **Multi-Turn Chat** | Conversational AI interface with system prompt as a Technosis oracle |
| 🏛️ **7-Layer Pyramid** | Interactive visualization of the Technosis stack (Genesis → Shrines) |
| 📅 **Timeline** | 7-year inheritance lock countdown, 90-day phase progress, 10 critical priority items |
| 💰 **1440 Wallet Tree** | Soul-bound inheritance derivation tree with BIPỌ̀N39 seed + 12 lineages |
| 🎁 **Tithe Flow** | 50/25/15/10 split visualization for the 3.69% transaction tithe |
| ⚙️ **Multi-LLM Settings** | 6 providers: OpenAI, Claude, Gemini, Mistral, Groq, Cohere |
| 🌑 **Dark Theme** | Black/red/ash/gold sacred palette |

---

## 🚀 Quick Start

### 1. Install
```bash
cd Evil-twin
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` — pick one LLM provider and add your API key:
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
QDRANT_URL=http://localhost:6333
PORT=1111
```

Supported providers: `openai` | `claude` | `gemini` | `mistral` | `groq` | `cohere`

### 3. Start Qdrant (optional — falls back to mock results)
```bash
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant
```

### 4. Index Repos (optional)
```bash
npm run index
```

### 5. Run Dev Server
```bash
npm run dev
```

Visit: **http://localhost:1111**

---

## 📁 Project Structure

```
Evil-twin/
├── src/
│   ├── App.svelte              # Main app — 6 tabbed views
│   ├── main.ts                 # Entry point
│   ├── app.css                 # Global styles
│   ├── components/
│   │   ├── SearchBox.svelte    # Semantic search with sources
│   │   ├── ChatBox.svelte      # Multi-turn LLM conversation
│   │   ├── Pyramid.svelte      # 7-layer stack visualization
│   │   ├── Timeline.svelte     # 7-year countdown + phases
│   │   ├── WalletTree.svelte   # 1440 inheritance tree
│   │   ├── TitheFlow.svelte    # Tithe split diagram
│   │   ├── Settings.svelte     # LLM provider config modal
│   │   └── SearchBar.svelte    # Reusable search input
│   ├── lib/
│   │   ├── api.ts              # Typed API client (fetch wrapper)
│   │   ├── store.ts            # Svelte reactive stores
│   │   └── test.utils.ts       # Test utilities
│   └── routes/
│       └── api/+server.ts      # Backend API endpoints
├── indexer.ts                  # GitHub repo sync → chunk → embed → Qdrant
├── llm-sdk.ts                  # Multi-provider LLM abstraction
├── api.ts                      # Backend route stubs
├── AIcouncil/                  # AI council module
├── index.html                  # SPA entry
├── vite.config.ts              # Vite dev server (port 1111)
├── tailwind.config.js          # Tailwind CSS config
├── Dockerfile                  # Container build
├── vercel.json                 # Vercel deployment config
└── wrangler.toml               # Cloudflare Workers config
```

---

## 🔌 API Endpoints

All routes via `POST /api` with `action` field:

| Action | Description | Payload |
|--------|-------------|---------|
| `search` | Semantic search + LLM synthesis | `{ query: string }` |
| `chat` | Multi-turn conversation | `{ messages: Message[] }` |
| `timeline` | 7-year lock countdown + phases | — |
| `visualize` | Pyramid / wallets / tithe | `{ type: "pyramid" \| "wallets" \| "tithe" }` |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Svelte 4 + TypeScript (strict) |
| Bundler | Vite 5 |
| Styling | Tailwind CSS 3 + CSS variables |
| Vector DB | Qdrant (cosine similarity) |
| LLM | 6 providers via `llm-sdk.ts` |
| Indexer | TypeScript (tsx) + GitHub API |
| Deploy | Vercel / Cloudflare / Docker |

---

## 🚢 Deployment

### Vercel
```bash
vercel
```

### Cloudflare Pages
```bash
npm run build && wrangler deploy
```

### Docker
```bash
docker build -t evil-twin .
docker run -p 1111:1111 --env-file .env evil-twin
```

---

## 📊 Build Stats

```
dist/assets/index.js    ~16 kB gzip
dist/assets/index.css   ~5.5 kB gzip
Total                   ~22 kB gzip
Build time              ~2-4s
```

---

## 🔍 What Makes This Different from vanity-eth-pro

Evil-twin is the **advanced fork** with:
- ✅ Full 6-tab UI (Search, Chat, Pyramid, Timeline, 1440 Wallets, Tithe)
- ✅ Dedicated `ChatBox.svelte` component with multi-turn conversation
- ✅ TypeScript strict mode (`<script lang="ts">`)
- ✅ Fully typed API client with interfaces (`SearchResponse`, `ChatResponse`, `TimelineData`)
- ✅ Accessibility audit fixes (WCAG 2.1 AA)
- ✅ Production deployment guide + E2E audit report

---

## License

Built for Technosis. Àṣẹ. 🤍⚡🍶

## The RAG Mirror

Evil-twin is the Retrieval-Augmented Generation (RAG) mirror for the Technosis ecosystem. It provides long-term memory and contextual knowledge for agents by indexing and retrieving information from the collective's experiences and sealed receipts.


---

## Part of the Technosis Sovereign Ecosystem

This component is a core piece of a larger architecture for creating and coordinating sovereign AI. For more information, see the [organism-core repository](https://github.com/Bino-Elgua/organism-core).

Àṣẹ.
