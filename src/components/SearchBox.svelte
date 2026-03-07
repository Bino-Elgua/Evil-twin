<script lang="ts">
  import { isLoading, searchResults } from '$lib/store';
  import * as api from '$lib/api';

  let query = '';
  let error = '';

  async function handleSearch() {
    if (!query.trim()) return;

    $isLoading = true;
    error = '';
    searchResults.set([]);

    const result = await api.search(query);

    $isLoading = false;

    if (!result.success) {
      error = result.error || 'Search failed';
      return;
    }

    if (result.data) {
      searchResults.set(result.data);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }
</script>

<div class="search-container">
  <div class="search-box">
    <input
      type="text"
      placeholder="Ask ÀṣẹMirror... (e.g., 'What is the 7-layer stack?')"
      bind:value={query}
      on:keydown={handleKeydown}
      disabled={$isLoading}
    />
    <button on:click={handleSearch} disabled={$isLoading || !query.trim()}>
      {#if $isLoading}
        ⏳ Searching...
      {:else}
        🔍 Search
      {/if}
    </button>
  </div>

  {#if error}
    <div class="error">❌ {error}</div>
  {/if}

  {#if Object.keys($searchResults).length > 0}
    <div class="results">
      <h3>Answer</h3>
      <div class="answer">
        {$searchResults.answer || 'No answer generated'}
      </div>

      <h3>Sources ({($searchResults.sources || []).length})</h3>
      <div class="sources">
        {#each $searchResults.sources || [] as source}
          <div class="source">
            <div class="source-header">
              <span class="repo">{source.repo}</span>
              <span class="relevance">{(source.relevance * 100).toFixed(0)}%</span>
            </div>
            <div class="file">{source.file}</div>
            <div class="content">{source.content.substring(0, 150)}...</div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .search-container {
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .search-box {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  input {
    flex: 1;
    padding: 1rem;
    background: #1f2937;
    border: 2px solid #dc2626;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    font-family: inherit;
  }

  input:focus {
    outline: none;
    box-shadow: 0 0 12px rgba(220, 38, 38, 0.5);
  }

  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button {
    padding: 1rem 2rem;
    background: #dc2626;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  button:hover:not(:disabled) {
    background: #b91c1c;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error {
    padding: 1rem;
    background: #7f1d1d;
    border-left: 4px solid #dc2626;
    border-radius: 4px;
    color: #fca5a5;
    margin-bottom: 1rem;
  }

  .results {
    background: #111;
    border: 1px solid #374151;
    border-radius: 8px;
    padding: 1.5rem;
  }

  h3 {
    color: #ff0000;
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
  }

  .answer {
    background: #1f2937;
    padding: 1rem;
    border-radius: 6px;
    color: #fff;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .sources {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .source {
    background: #0a0a0a;
    border: 1px solid #4b5563;
    border-radius: 6px;
    padding: 1rem;
  }

  .source-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .repo {
    color: #ffaa00;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .relevance {
    color: #4ade80;
    font-size: 0.85rem;
  }

  .file {
    color: #999;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
    font-family: 'Courier New', monospace;
  }

  .content {
    color: #ccc;
    font-size: 0.9rem;
    line-height: 1.4;
  }
</style>
