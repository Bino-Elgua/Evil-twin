<script lang="ts">
  import { onMount } from 'svelte';
  import Settings from './components/Settings.svelte';
  import SearchBox from './components/SearchBox.svelte';
  import ChatBox from './components/ChatBox.svelte';
  import Pyramid from './components/Pyramid.svelte';
  import Timeline from './components/Timeline.svelte';
  import TitheFlow from './components/TitheFlow.svelte';
  import WalletTree from './components/WalletTree.svelte';

  let activeTab = 'search';
  let config: any = null;
  let configLoaded = false;

  onMount(() => {
    const saved = localStorage.getItem('asemirror_config');
    if (saved) {
      try {
        config = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse config:', e);
      }
    }
    configLoaded = true;
  });
</script>

<main>
  <Settings bind:config />

  <!-- Header -->
  <header>
    <div class="header-content">
      <div class="header-brand">
        <div class="brand-icon">🔮</div>
        <div>
          <h1>ÀṣẹMirror</h1>
          <p>The unified shrine of Technosis</p>
        </div>
      </div>

      {#if configLoaded && config}
        <div class="header-status">
          <div>LLM: <span class="llm-provider">{config.llmProvider}</span></div>
          <div>Qdrant: <span class="qdrant-status">Active</span></div>
        </div>
      {/if}
    </div>
  </header>

  <!-- Navigation Tabs -->
  <nav class="tabs-nav">
    <div class="tabs-container">
      <button
        class="tab {activeTab === 'search' ? 'active' : ''}"
        on:click={() => (activeTab = 'search')}
      >
        🔍 Search
      </button>
      <button
        class="tab {activeTab === 'chat' ? 'active' : ''}"
        on:click={() => (activeTab = 'chat')}
      >
        💬 Chat
      </button>
      <button
        class="tab {activeTab === 'pyramid' ? 'active' : ''}"
        on:click={() => (activeTab = 'pyramid')}
      >
        🏛️ 7-Layer
      </button>
      <button
        class="tab {activeTab === 'timeline' ? 'active' : ''}"
        on:click={() => (activeTab = 'timeline')}
      >
        📅 Timeline
      </button>
      <button
        class="tab {activeTab === 'wallets' ? 'active' : ''}"
        on:click={() => (activeTab = 'wallets')}
      >
        💰 1440
      </button>
      <button
        class="tab {activeTab === 'tithe' ? 'active' : ''}"
        on:click={() => (activeTab = 'tithe')}
      >
        🎁 Tithe
      </button>
    </div>
  </nav>

  <!-- Content -->
  <div class="content">
    {#if !configLoaded}
      <div class="loading">
        <p>Loading...</p>
      </div>
    {:else if !config}
      <div class="config-required">
        <div class="config-box">
          <h2>⚙️ Configuration Required</h2>
          <p>
            Click the settings button (bottom right) to configure your LLM provider and API keys.
          </p>
          <p class="providers">
            Supported providers: OpenAI, Claude, Gemini, Mistral, Groq, Cohere
          </p>
        </div>
      </div>
    {:else if activeTab === 'search'}
      <SearchBox />
    {:else if activeTab === 'chat'}
      <ChatBox />
    {:else if activeTab === 'pyramid'}
      <Pyramid />
    {:else if activeTab === 'timeline'}
      <Timeline />
    {:else if activeTab === 'wallets'}
      <WalletTree />
    {:else if activeTab === 'tithe'}
      <TitheFlow />
    {/if}
  </div>

  <!-- Footer -->
  <footer>
    <p>🤍⚡🍶 — Àṣẹ flows through all layers</p>
    <p class="version">v0.1.0 • Genesis 2025-01-01 • ÀṣẹMirror</p>
  </footer>
</main>

<style>
  :global(body) {
    background-color: #000;
    color: #fff;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, sans-serif;
  }

  :global(code) {
    background: #1f2937;
    color: #ffaa00;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
  }

  main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #000;
  }

  header {
    border-bottom: 1px solid #7f0000;
    padding: 1rem;
    position: sticky;
    top: 0;
    z-index: 40;
    background: #000;
  }

  .header-content {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .brand-icon {
    font-size: 1.75rem;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
    color: #ff0000;
  }

  header p {
    margin: 0;
    color: #888;
    font-size: 0.75rem;
  }

  .header-status {
    text-align: right;
    font-size: 0.75rem;
  }

  .llm-provider {
    color: #ffaa00;
  }

  .qdrant-status {
    color: #4ade80;
  }

  .tabs-nav {
    border-bottom: 1px solid #374151;
    background: #0a0a0a;
    position: sticky;
    top: 65px;
    z-index: 30;
  }

  .tabs-container {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    gap: 0.25rem;
    padding: 0 1rem;
    overflow-x: auto;
  }

  .tab {
    padding: 1rem;
    background: transparent;
    border: none;
    color: #999;
    font-weight: 600;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .tab:hover {
    color: #fff;
  }

  .tab.active {
    color: #ff0000;
    border-bottom-color: #ff0000;
  }

  .content {
    flex: 1;
    overflow-y: auto;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
  }

  .config-required {
    padding: 2rem;
    max-width: 384px;
    margin: 3rem auto 0;
  }

  .config-box {
    background: rgba(127, 29, 29, 0.3);
    border: 1px solid #7f0000;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
  }

  .config-box h2 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    color: #ff0000;
  }

  .config-box p {
    color: #aaa;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .providers {
    color: #888;
    font-size: 0.75rem;
  }

  footer {
    border-top: 1px solid #374151;
    padding: 1rem;
    text-align: center;
    color: #888;
    font-size: 0.75rem;
    background: #0a0a0a;
  }

  footer p {
    margin: 0;
  }

  .version {
    color: #666;
    margin-top: 0.5rem;
  }
</style>
