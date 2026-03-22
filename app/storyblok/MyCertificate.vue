<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { MyCertificate } from '~/types/components'
import { elevateAnimationObserver } from '~/utils/gsap-animations'

const props = defineProps<{
  blok: MyCertificate
}>()

const cardRef = ref<Element | null>(null)
const cardObserver = ref<IntersectionObserver>()

const image = computed(() => props.blok.image?.[0] ?? null)

onMounted(() => {
  if (cardRef.value) {
    cardObserver.value = elevateAnimationObserver(cardRef.value, -6)
  }
})

onBeforeUnmount(() => {
  cardObserver.value?.disconnect()
})
</script>

<template>
  <div v-editable="blok" class="cert-wrapper">
    <article ref="cardRef" class="cert-card">

      <!-- Header: window chrome + title -->
      <div class="cert-card__header">
        <svg class="cert-card__buttons">
          <circle stroke-width="2" stroke="currentColor" cx="12" cy="12" r="4" />
          <circle stroke-width="2" stroke="currentColor" cx="28" cy="12" r="4" />
          <circle stroke-width="2" stroke="currentColor" cx="44" cy="12" r="4" />
        </svg>
        <span class="cert-card__title">
          {{ blok.title }}<span class="dot">.</span>
        </span>
      </div>

      <!-- Body: image fills the rest -->
      <a
        class="cert-card__body"
        :href="blok.link"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="blok.title"
      >
        <MyImage
          v-if="image"
          :blok="image"
          :auto-size="true"
          class="cert-card__image"
        />
        <div v-else class="cert-card__placeholder">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" stroke-width="2" stroke="currentColor" fill="none" />
            <path d="M20 10 L23.5 17 L31 18.2 L25.5 23.5 L26.9 31 L20 27.3 L13.1 31 L14.5 23.5 L9 18.2 L16.5 17 Z" fill="currentColor" />
          </svg>
        </div>
      </a>

    </article>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/variables' as *;

.cert-wrapper {
  position: relative;
  border-radius: var(--border-radius);
  background-color: var(--primary);
  transition: background-color 0.15s linear;
  width: 100%;
}

.dark-scheme .cert-wrapper {
  background-color: var(--stroke);
}

.cert-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: var(--secondary);
  overflow: hidden;
  will-change: transform;
  transform: translate3d(-10px, -10px, 0);
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.15s linear;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translate3d(-4px, -4px, 0);

      .cert-card__image {
        :deep(.image) {
          transform: scale(1.04);
        }
      }
    }

    &:active {
      transform: translate3d(0, 0, 0);
    }
  }

  /* ── Header: mirrors .window__header ── */
  &__header {
    display: flex;
    align-items: center;
    position: relative;
    border-bottom: var(--border);
    padding: var(--space-2xs) var(--space-xs);
    min-height: 32px;
    flex-shrink: 0;
  }

  &__buttons {
    width: 64px;
    height: 24px;
    position: absolute;
    flex-shrink: 0;

    circle {
      fill: var(--tertiary);
      color: var(--stroke);
    }
  }

  &__title {
    width: 100%;
    text-align: center;
    font-family: var(--font-family-secondary);
    font-size: var(--font-xs);
    font-weight: 700;
    color: #232946;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 var(--space-xl);
  }

  /* ── Body: image fills the area ── */
  &__body {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
  }

  &__image {
    width: 100%;
    height: 100%;

    :deep(.image) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }
  }

  /* ── Placeholder when no image ── */
  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--tertiary);
    color: $primary-dark;

    svg {
      width: 48px;
      height: 48px;
      opacity: 0.4;
    }
  }
}
</style>