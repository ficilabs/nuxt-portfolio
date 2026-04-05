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
const url = computed(() => props.blok.link?.url || null)

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
      <div class="cert-card__body">

        <!-- Icon -->
        <div class="cert-card__icon">
          <MyImage
            v-if="image"
            :blok="image"
            :auto-size="false"
            class="cert-card__image"
          />
          <svg v-else viewBox="0 0 40 40" class="cert-card__fallback" aria-hidden="true">
            <circle cx="20" cy="20" r="18" stroke-width="2" stroke="currentColor" fill="none" />
            <path d="M20 10 L23.5 17 L31 18.2 L25.5 23.5 L26.9 31 L20 27.3 L13.1 31 L14.5 23.5 L9 18.2 L16.5 17 Z" fill="currentColor" />
          </svg>
        </div>

        <!-- Text -->
        <div class="cert-card__content">
          <p class="cert-card__title">
            <span class="cert-card__title-text">{{ blok.title }}</span><span class="dot">.</span>
          </p>
          <a
            v-if="url"
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="cert-card__link"
          >
            View credential
            <svg class="cert-card__link-arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.29 5.71a1 1 0 00-1.41 1.41L18.17 11H3a1 1 0 000 2h15.18l-3.88 3.88a1 1 0 001.41 1.41l5.59-5.59a1 1 0 000-1.41l-5.59-5.59z"/>
            </svg>
          </a>
        </div>

      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/variables' as *;

/* Shadow backing */
.cert-wrapper {
  position: relative;
  border-radius: var(--border-radius);
  background-color: $primary-dark;
  transition: background-color 0.15s linear;
  width: 100%;
  min-width: 0;
}

.dark-scheme .cert-wrapper {
  background-color: $stroke;
}

/* Card surface — white in light, dark navy in dark */
.cert-card {
  position: relative;
  width: 100%;
  min-width: 0;
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: $secondary-light;
  overflow: hidden;
  will-change: transform;
  transform: translate3d(-10px, -10px, 0);
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.15s linear;

  @media (hover: hover) and (pointer: fine) {
    &:hover { transform: translate3d(-4px, -4px, 0); }
    &:active { transform: translate3d(0, 0, 0); }
  }

  &__body {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    padding: var(--space-s);
  }

  /* Icon */
  &__icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: var(--border-radius);
    border: var(--border);
    background-color: var(--secondary);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s linear;
  }

  &__image {
    width: 40px;
    height: 40px;

    :deep(.image) {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }
  }

  &__fallback {
    width: 22px;
    height: 22px;
    color: $primary-dark;
    opacity: 0.4;
  }

  /* Text column */
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-3xs);
    flex: 1;
    min-width: 0; /* critical for ellipsis in flex child */
  }

  /* Title: truncated span + dot always visible */
  &__title {
    display: flex;
    align-items: baseline;
    font-family: var(--font-family-secondary);
    font-size: var(--font-sm);
    font-weight: 700;
    color: $primary-dark;
    line-height: 1.3;
    min-width: 0;
  }

  &__title-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    width: fit-content;
    font-family: var(--font-family-secondary);
    font-size: var(--font-xs);
    font-weight: 700;
    color: var(--tertiary-dark);
    text-decoration: underline;
    text-decoration-color: transparent;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
    transition: text-decoration-color 0.15s ease-out;

    &:hover {
      text-decoration-color: var(--tertiary-dark);

      .cert-card__link-arrow {
        animation: cert-arrow 0.75s linear forwards;
      }
    }
  }

  &__link-arrow {
    width: 14px;
    height: 14px;
    fill: var(--tertiary-dark);
    flex-shrink: 0;
  }
}

@keyframes cert-arrow {
  0%   { transform: translate3d(0, 0, 0); }
  16%  { transform: translate3d(4px, 0, 0); }
  28%  { transform: translate3d(1px, 0, 0); }
  44%  { transform: translate3d(3px, 0, 0); }
  59%  { transform: translate3d(2px, 0, 0); }
  73%  { transform: translate3d(2.5px, 0, 0); }
  88%  { transform: translate3d(2px, 0, 0); }
  100% { transform: translate3d(2.5px, 0, 0); }
}

/* Dark mode overrides */
.dark-scheme {
  .cert-wrapper {
    background-color: $stroke;
  }

  .cert-card {
    // Lighter than $primary-dark (#232946) background so card is visible
    background-color: #ccc5b9;
    border-color: rgba($primary-light, 0.15);
  }

  .cert-card__title {
    color: $primary-dark;
  }

  .cert-card__icon {
    background-color: rgba($primary-light, 0.08);
    border-color: rgba($primary-light, 0.15);
  }

  .cert-card__fallback {
    color: $primary-light;
  }
}
</style>