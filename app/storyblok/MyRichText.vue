<script setup lang="ts">
import { computed } from 'vue'
import { renderRichText } from '@storyblok/vue'

type MyRichTextBlok = {
  text: any
}

const props = defineProps<{ blok: MyRichTextBlok }>()

const text = computed(() => {
  return props.blok.text ? renderRichText(props.blok.text) : ''
})
</script>

<template>
  <article class="rich-text" v-html="text"></article>
</template>

<style lang="scss" scoped>
@use 'sass:list';

</style>