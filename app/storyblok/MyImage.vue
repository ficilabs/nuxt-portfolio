<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { MyImage } from '~/types/components'

const props = defineProps<{
  blok: MyImage
}>()

const imgRef = ref<HTMLImageElement | null>(null)
const isLoading = ref(true)

/**
 * Normalize image
 * Support both:
 * - string
 * - Storyblok asset object
 */
const imageSrc = computed(() => {
  if (!props.blok.image) return ''

  if (typeof props.blok.image === 'string') {
    return props.blok.image
  }

  // fallback if Storyblok still returns asset object
  return (props.blok.image as any).filename || ''
})

onMounted(() => {
  if (!imgRef.value) return

  const img = imgRef.value
  const src = img.dataset.src
  if (!src) return

  img.onload = () => {
    img.classList.add('loaded')
    isLoading.value = false
  }

  img.src = src
})
</script>

<template>
  <div v-if="blok" v-editable="blok">
    <picture class="picture">
      <div v-if="isLoading" class="loading">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>

      <img
        ref="imgRef"
        class="image"
        :width="blok.width"
        :height="blok.height"
        :alt="blok.alt || ''"
        :data-src="imageSrc"
        src="~/assets/placeholder.svg"
      />
    </picture>

    <svg style="width: 0; height: 0">
      <filter id="darken">
        <feColorMatrix
          type="matrix"
          values="0.75 0 0 0 0
                  0 0.75 0 0 0
                  0 0 0.75 0 0
                  0 0 0 1 0"
        />
      </filter>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.image {
  opacity: 0;
  transition: opacity 0.2s 0.15s ease-out;
}

.picture {
  position: relative;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  inset: 0;

  .circle {
    width: 8px;
    height: 8px;
    margin: 2px;
    border-radius: 50%;
    background-color: var(--tertiary);
    animation: bounce 0.5s infinite alternate cubic-bezier(0.77, 0, 0.18, 1);
  }

  .circle:nth-child(2) {
    animation-delay: 0.15s;
  }

  .circle:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes bounce {
    0% { opacity: 1; }
    100% { opacity: 0.5; }
  }
}

.loaded {
  opacity: 1;
}

.dark-scheme {
  .image {
    filter: url(#darken);
  }
}
</style>