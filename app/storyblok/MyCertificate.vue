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

      <!-- Icon + text column -->
      <div class="cert-card__body">
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

        <div class="cert-card__content">
          <h3 class="cert-card__title">
            {{ blok.title }}<span class="dot">.</span>
          </h3>
          <MyLink v-if="blok.link" :link="blok.link" external class="cert-card__link">
            View
          </MyLink>
        </div>
      </div>

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
  width: 100%;
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: var(--background);
  overflow: hidden;
  will-change: transform;
  transform: translate3d(-10px, -10px, 0);
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.15s linear;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translate3d(-4px, -4px, 0);
    }
    &:active {
      transform: translate3d(0, 0, 0);
    }
  }

  /* Body: icon left, text column right */
  &__body {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    padding: var(--space-s);
  }

  /* Icon — fixed square */
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
    color: var(--primary);
    opacity: 0.4;
  }

  /* Text column: title on top, link below */
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-3xs);
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-family: var(--font-family-secondary);
    font-size: var(--font-sm);
    font-weight: 700;
    color: var(--primary);
    line-height: 1.3;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__link {
    font-size: var(--font-xs);
    width: fit-content;
  }
}
</style>