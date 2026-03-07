<script lang="ts">
  import { isLoading } from '$lib/store';
  import * as api from '$lib/api';

  interface Message {
    role: 'user' | 'assistant';
    content: string;
  }

  let messages: Message[] = [
    {
      role: 'assistant',
      content: 'Greetings. I am ÀṣẹMirror, keeper of Technosis. How may I illuminate your path?',
    },
  ];
  let input = '';
  let error = '';
  let chatContainer: HTMLDivElement;

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    messages = [...messages, userMessage];
    input = '';
    error = '';

    $isLoading = true;

    const result = await api.chat(messages.filter(m => m.role !== 'assistant' || m !== messages[messages.length - 1]));

    $isLoading = false;

    if (!result.success) {
      error = result.error || 'Chat failed';
      return;
    }

    if (result.data) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.data.response,
      };
      messages = [...messages, assistantMessage];
    }

    // Scroll to bottom
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
</script>

<div class="chat-container">
  <div class="messages" bind:this={chatContainer}>
    {#each messages as message}
      <div class={`message ${message.role}`}>
        <div class="avatar">
          {message.role === 'user' ? '👤' : '🔮'}
        </div>
        <div class="content">
          {message.content}
        </div>
      </div>
    {/each}

    {#if $isLoading}
      <div class="message assistant loading">
        <div class="avatar">🔮</div>
        <div class="content">
          <span class="typing">●●●</span>
        </div>
      </div>
    {/if}
  </div>

  {#if error}
    <div class="error">❌ {error}</div>
  {/if}

  <div class="input-area">
    <textarea
      placeholder="Ask ÀṣẹMirror anything... (Shift+Enter for new line)"
      bind:value={input}
      on:keydown={handleKeydown}
      disabled={$isLoading}
      rows="3"
    />
    <button on:click={sendMessage} disabled={$isLoading || !input.trim()}>
      {#if $isLoading}
        ⏳ Responding...
      {:else}
        📤 Send
      {/if}
    </button>
  </div>
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #000;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .message {
    display: flex;
    gap: 1rem;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message.user {
    justify-content: flex-end;
  }

  .message.user .content {
    background: #dc2626;
    color: #fff;
  }

  .message.assistant .content {
    background: #1f2937;
    color: #fff;
  }

  .avatar {
    font-size: 1.5rem;
    min-width: 2rem;
    text-align: center;
  }

  .content {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    max-width: 70%;
    word-wrap: break-word;
    line-height: 1.5;
  }

  .message.user .content {
    text-align: right;
  }

  .typing {
    display: inline-block;
    animation: blink 1.4s infinite;
  }

  @keyframes blink {
    0%, 20%, 50%, 80%, 100% {
      opacity: 1;
    }
    40% {
      opacity: 0.5;
    }
    60% {
      opacity: 0.7;
    }
  }

  .error {
    padding: 0.75rem 1.5rem;
    background: #7f1d1d;
    border-left: 4px solid #dc2626;
    color: #fca5a5;
    font-size: 0.9rem;
  }

  .input-area {
    padding: 1.5rem;
    border-top: 1px solid #374151;
    display: flex;
    gap: 0.75rem;
  }

  textarea {
    flex: 1;
    padding: 0.75rem;
    background: #1f2937;
    border: 1px solid #4b5563;
    border-radius: 6px;
    color: #fff;
    font-family: inherit;
    font-size: 0.9rem;
    resize: none;
  }

  textarea:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 8px rgba(220, 38, 38, 0.3);
  }

  textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button {
    padding: 0.75rem 1.5rem;
    background: #dc2626;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  button:hover:not(:disabled) {
    background: #b91c1c;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
