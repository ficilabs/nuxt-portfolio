<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { elasticAnimation } from '~/utils/gsap-animations'

interface Props {
  currentPage: number
  totalPages: number
  maxVisible?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 5,
})

const emit = defineEmits<{
  pageChange: [page: number]
}>()

const navRef = ref<HTMLElement | null>(null)

/*
|--------------------------------------------------------------------------
| Page Range Logic
|--------------------------------------------------------------------------
*/

const pages = computed<(number | '...')[]>(() => {
  const total = props.totalPages
  const current = props.currentPage
  const max = props.maxVisible

  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const half = Math.floor(max / 2)
  let start = Math.max(2, current - half)
  let end = Math.min(total - 1, current + half)

  if (current - half <= 2) end = Math.min(total - 1, max - 1)
  if (current + half >= total - 1) start = Math.max(2, total - max + 2)

  const result: (number | '...')[] = [1]
  if (start > 2) result.push('...')
  for (let i = start; i <= end; i++) result.push(i)
  if (end < total - 1) result.push('...')
  result.push(total)
  return result
})

const canPrev = computed(() => props.currentPage > 1)
const canNext = computed(() => props.currentPage < props.totalPages)

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

function goTo(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('pageChange', page)
}

/*
|--------------------------------------------------------------------------
| Animation — same pattern as MyProjectFilter
|--------------------------------------------------------------------------
*/

onMounted(() => {
  if (!navRef.value) return
  const buttons = navRef.value.querySelectorAll('[data-animation="true"]')
  if (!buttons.length) return

  if (window.innerWidth < 1024) {
    elasticAnimation(buttons, -7, -7, 1, 0.25, 0.05)
  } else {
    elasticAnimation(buttons, -7, -7, 1, 0.45, 0.05)
  }
})
</script>

<template>
  <div class="pagination">
  <nav
    ref="navRef"
    class="pagination__container"
    aria-label="Pagination"
  >

    <!-- Prev -->
    <div :class="['pagination__wrapper', { 'pagination__wrapper--disabled': !canPrev }]">
      <button
        class="pagination__btn"
        type="button"
        :disabled="!canPrev"
        :data-animation="canPrev"
        aria-label="Previous page"
        @click="goTo(currentPage - 1)"
      >
        <svg viewBox="0 0 24 24" class="pagination__svg" aria-hidden="true">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
        </svg>
      </button>
    </div>

    <!-- Pages -->
    <template v-for="(page, index) in pages" :key="`${page}-${index}`">

      <!-- Ellipsis -->
      <span
        v-if="page === '...'"
        class="pagination__ellipsis"
        aria-hidden="true"
      >···</span>

      <!-- Page number -->
      <div class="pagination__wrapper">
        <button
          :class="['pagination__btn', { 'pagination__btn--selected': page === currentPage }]"
          type="button"
          :aria-label="`Page ${page}`"
          :aria-current="page === currentPage ? 'page' : undefined"
          :data-animation="page !== currentPage"
          @click="goTo(page as number)"
        >
          {{ page }}
        </button>
      </div>

    </template>

    <!-- Next -->
    <div :class="['pagination__wrapper', { 'pagination__wrapper--disabled': !canNext }]">
      <button
        class="pagination__btn"
        type="button"
        :disabled="!canNext"
        :data-animation="canNext"
        aria-label="Next page"
        @click="goTo(currentPage + 1)"
      >
        <svg viewBox="0 0 24 24" class="pagination__svg" aria-hidden="true">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor" />
        </svg>
      </button>
    </div>

  </nav>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/variables' as *;

// Shadow "floor" — mirrors .button-container--round from MyButton.vue
.pagination__wrapper {
  position: relative;
  margin: 7px;
  width: max-content;
  height: max-content;
  border-radius: 50px;
  background-color: var(--primary);
  transition: background-color 0.15s linear;

  &--disabled {
    opacity: 0.3;
    pointer-events: none;
  }
}

// Pill button — mirrors .button.button--round from MyButton.vue
.pagination__btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  border: var(--border);
  border-radius: 50px;
  padding: 5px 11px;
  color: var(--primary-dark);
  background-color: var(--secondary);
  font-size: 14px;
  font-family: var(--font-family-secondary);
  font-weight: 700;
  will-change: transform;
  transform: translate3d(-7px, -7px, 0);
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.15s linear;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled) {
      transform: translate3d(-3px, -3px, 0);
      cursor: pointer;
    }

    &:active:not(:disabled) {
      transform: translate3d(0, 0, 0);
    }
  }

  // Active page — mirrors .button--round.button--selected from MyButton.vue
  &--selected {
    background-color: var(--primary-light);
    transform: translate3d(0, 0, 0);

    &:hover {
      transform: translate3d(0, 0, 0);
    }
  }
}

// Arrow icon
.pagination__svg {
  width: 16px;
  height: 16px;
  display: block;
  pointer-events: none;
}

// Ellipsis between page groups
.pagination__ellipsis {
  font-family: var(--font-family-secondary);
  font-size: 10px;
  font-weight: 700;
  color: var(--primary);
  opacity: 0.4;
  letter-spacing: 2px;
  // align baseline with pills (pills sit -7px above their wrapper)
  align-self: flex-end;
  margin-bottom: 14px;
}

.pagination {
  display: flex;
  align-items: stretch;
  justify-content: center;
  position: relative;

  // Outer box — mirrors .filter__container from MyProjectFilter.vue
  &__container {
    display: flex;
    align-items: center;
    position: relative;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    overflow: hidden;
    border: var(--border);
    background-color: var(--tertiary);
    padding: 10px 10px 5px;
  }
}

// Dark scheme — mirrors dark-scheme .button-container from MyButton.vue
.dark-scheme {
  .pagination__wrapper {
    background-color: var(--stroke);
  }
}
</style>