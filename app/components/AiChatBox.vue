<script lang="ts" setup>
import { ref, nextTick, computed } from 'vue'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
  typing?: boolean
}

const DUMMY_RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['stack', 'tech', 'technology', 'tools', 'use'],
    reply: "I primarily work with Vue.js & Nuxt for frontend, TypeScript for type safety, GSAP for animations, and Storyblok as a headless CMS. Styling is done with SCSS using a custom design system."
  },
  {
    keywords: ['project', 'projects', 'work', 'portfolio', 'built'],
    reply: "I've built several frontend projects — from interactive portfolio sites to component-driven apps. Each one focuses on clean architecture, smooth animations, and responsive design."
  },
  {
    keywords: ['strength', 'strengths', 'good', 'skill', 'skills', 'best'],
    reply: "My biggest strengths are UI/UX attention to detail, animation with GSAP, and building reusable component systems. I care deeply about both the code quality and the visual polish."
  },
  {
    keywords: ['experience', 'years', 'long', 'background', 'career'],
    reply: "I've been working in frontend development for several years, starting with vanilla JS and progressively moving into modern frameworks like Vue and Nuxt."
  },
  {
    keywords: ['available', 'hire', 'freelance', 'job', 'work together', 'contact'],
    reply: "I'm open to interesting projects and collaborations! Feel free to reach out via the contact links on this page."
  },
  {
    keywords: ['nuxt', 'vue', 'angular', 'react'],
    reply: "Vue and Nuxt are my go-to stack. I love the composition API, the ecosystem, and how naturally it pairs with TypeScript and SCSS."
  },
  {
    keywords: ['gsap', 'animation', 'animate', 'motion'],
    reply: "GSAP is my animation library of choice — it's incredibly powerful for timeline-based sequences, scroll triggers, and micro-interactions that make interfaces feel alive."
  },
  {
    keywords: ['hello', 'hi', 'hey', 'howdy', 'hola', 'sup'],
    reply: "Hey there! 👋 Great to meet you. Feel free to ask me anything about skills, projects, or what I'm up to."
  },
  {
    keywords: ['who', 'about', 'yourself', 'you', 'tell me'],
    reply: "I'm a frontend developer passionate about crafting beautiful, performant web experiences. I specialize in Vue/Nuxt, animations, and design systems."
  },
]

const FALLBACK_REPLIES = [
  "That's a great question! I'm still learning to answer everything — try asking about my tech stack, projects, or skills.",
  "Hmm, I'm not sure about that one. Ask me about Vue, Nuxt, GSAP, or my projects!",
  "I don't have a great answer for that yet. But feel free to ask about my work or experience!"
]

function getReply(input: string): string {
  const lower = input.toLowerCase()
  for (const entry of DUMMY_RESPONSES) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.reply
    }
  }
  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)]
}

const inputRef = ref<HTMLInputElement | null>(null)
const messagesRef = ref<HTMLElement | null>(null)
const inputText = ref('')
const isLoading = ref(false)
const messages = ref<Message[]>([
  {
    id: 0,
    role: 'assistant',
    text: "Hey! I'm an AI trained on info about this person. Ask me anything — skills, projects, background, or just say hi."
  }
])

let nextId = 1

const canSend = computed(() => inputText.value.trim().length > 0 && !isLoading.value)

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({ id: nextId++, role: 'user', text })
  inputText.value = ''
  isLoading.value = true

  const typingId = nextId++
  messages.value.push({ id: typingId, role: 'assistant', text: '', typing: true })
  await scrollToBottom()

  // Simulate network delay
  await new Promise(r => setTimeout(r, 900 + Math.random() * 600))

  const reply = getReply(text)
  const idx = messages.value.findIndex(m => m.id === typingId)
  if (idx !== -1) {
    messages.value[idx] = { id: typingId, role: 'assistant', text: reply, typing: false }
  }

  isLoading.value = false
  await scrollToBottom()
  inputRef.value?.focus()
}

async function scrollToBottom() {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const suggestions = [
  'What tech stack do you use?',
  'Tell me about your projects',
  'What are your strengths?'
]

function useSuggestion(s: string) {
  inputText.value = s
  inputRef.value?.focus()
}
</script>

<template>
  <div class="chat-box">

    <!-- Messages -->
    <div ref="messagesRef" class="chat-box__messages">
      <TransitionGroup name="msg">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['chat-box__msg', `chat-box__msg--${msg.role}`]"
        >
          <template v-if="msg.typing">
            <span class="chat-box__typing">
              <span></span><span></span><span></span>
            </span>
          </template>
          <template v-else>
            {{ msg.text }}
          </template>
        </div>
      </TransitionGroup>
    </div>

    <!-- Quick suggestions -->
    <Transition name="fade">
      <div v-if="messages.length === 1" class="chat-box__suggestions">
        <button
          v-for="s in suggestions"
          :key="s"
          class="chat-box__suggestion"
          type="button"
          @click="useSuggestion(s)"
        >
          {{ s }}
        </button>
      </div>
    </Transition>

    <!-- Input -->
    <div class="chat-box__footer">
      <input
        ref="inputRef"
        v-model="inputText"
        class="chat-box__input"
        type="text"
        placeholder="Type a message..."
        :disabled="isLoading"
        @keydown="onKeydown"
      />
      <button
        class="chat-box__send"
        type="button"
        :disabled="!canSend"
        aria-label="Send message"
        @click="sendMessage"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/variables' as *;

.chat-box {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid var(--stroke);
  border-radius: var(--border-radius);
  background-color: var(--secondary);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  font-family: var(--font-family-secondary);
  transition: background-color 0.15s linear;

  &__messages {
    flex: 1;
    min-height: 200px;
    max-height: 300px;
    overflow-y: auto;
    padding: var(--space-s);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    scroll-behavior: smooth;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb {
      background-color: var(--tertiary);
      border-radius: 4px;
    }
  }

  &__msg {
    max-width: 85%;
    padding: var(--space-2xs) var(--space-xs);
    border-radius: var(--border-radius);
    border: 1px solid var(--stroke);
    font-size: var(--font-sm);
    line-height: 1.5;
    word-break: break-word;

    &--assistant {
      align-self: flex-start;
      background-color: var(--tertiary);
      color: $primary-dark;
      border-bottom-left-radius: 2px;
      transform: translate3d(-4px, -4px, 0);
    }

    &--user {
      align-self: flex-end;
      background-color: $primary-dark;
      color: $secondary-light;
      border-bottom-right-radius: 2px;
      transform: translate3d(-4px, -4px, 0);
    }
  }

  &__typing {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 4px 2px;

    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: $primary-dark;
      animation: typing-bounce 1.2s infinite ease-in-out;

      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
  }

  &__suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3xs);
    padding: 0 var(--space-s) var(--space-xs);
  }

  &__suggestion {
    font-size: 12px;
    font-family: var(--font-family-secondary);
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid var(--stroke);
    background-color: var(--background);
    color: var(--primary);
    cursor: pointer;
    transition: background-color 0.15s ease,
      transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background-color: var(--tertiary);
      transform: translate3d(-2px, -2px, 0);
    }

    &:active {
      transform: translate3d(0, 0, 0);
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-s);
    border-top: 1px solid var(--stroke);
    background-color: var(--secondary);
    transition: background-color 0.15s linear;
  }

  &__input {
    flex: 1;
    font-family: var(--font-family-secondary);
    font-size: var(--font-sm);
    padding: var(--space-2xs) var(--space-xs);
    border: 1px solid var(--stroke);
    border-radius: var(--border-radius);
    background-color: var(--secondary);
    color: var(--primary);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &::placeholder {
      color: var(--primary);
      opacity: 0.4;
    }

    &:focus {
      border-color: var(--tertiary-dark);
      box-shadow: 0 0 0 2px var(--tertiary-light);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__send {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border: 1px solid var(--stroke);
    border-radius: var(--border-radius);
    background-color: var(--tertiary);
    color: var(--primary-dark);
    cursor: pointer;
    transform: translate3d(-3px, -3px, 0);
    transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
      background-color 0.15s linear;
    -webkit-tap-highlight-color: transparent;

    svg {
      width: 16px;
      height: 16px;
      pointer-events: none;
    }

    &:hover:not(:disabled) {
      transform: translate3d(-1px, -1px, 0);
    }

    &:active:not(:disabled) {
      transform: translate3d(0, 0, 0);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: translate3d(0, 0, 0);
    }
  }
}

// Message enter animation
.msg-enter-active {
  transition: opacity 0.25s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.msg-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

// Suggestions fade out
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes typing-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%           { transform: translateY(-5px); opacity: 1; }
}
</style>