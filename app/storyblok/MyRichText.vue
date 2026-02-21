<script setup lang="ts">
import { computed } from 'vue'
import { renderRichText } from '@storyblok/vue'
import type { MyRichText } from '~/types/components';

const props = defineProps<{ blok: MyRichText }>()

const text = computed(() => {
  return props.blok.text ? renderRichText(props.blok.text) : ''
})
</script>

<template>
  <article class="rich-text" v-html="text"></article>
</template>

<style scoped>
/* h2 = 72px */
.rich-text :deep(h2) {
  font-size: 72px;
  line-height: 1.1;
  font-weight: 700;
}

/* p = 18px */
.rich-text :deep(p) {
  font-size: 18px;
  line-height: 1.6;
}
</style>