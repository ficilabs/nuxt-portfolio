<script setup lang="ts">
import { computed } from 'vue'
import type { MyImage } from '~/types/components'

const props = defineProps<{
  blok: MyImage | null | undefined
}>()

const imageUrl = computed(() => {
  if (!props.blok?.image) return ''
  return props.blok.image.startsWith('//')
    ? `https:${props.blok.image}`
    : props.blok.image
})
</script>

<template>
  <div v-if="imageUrl" class="image-wrapper">
    <NuxtImg
      :src="imageUrl"
      :width="props.blok?.width"
      :height="props.blok?.height"
      format="webp"
      loading="lazy"
      placeholder
      class="image"
    />
  </div>
</template>

<style scoped>
.image-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: rgba(0, 0, 0, 0.1);
}

.image {
  width: 100%;
  height: auto;
  display: block;
  max-height: 400px;
  object-fit: contain;
}
</style>