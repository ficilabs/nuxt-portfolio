<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import type { SbBlokData } from '@storyblok/vue'

type PageBlok = {
  title?: string
  body?: SbBlokData[]
}

const props = defineProps<{
  blok: PageBlok
}>()

const pageRef = ref<HTMLElement | null>(null)
const pageTitleRef = ref<HTMLElement | null>(null)
const pageGroupRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()

  if (pageRef.value) {
    pageRef.value.style.visibility = 'visible'
  }

  if (pageTitleRef.value) {
    pageTitleRef.value.style.visibility = 'visible'
  }

  if (pageGroupRef.value) {
    pageGroupRef.value.style.visibility = 'visible'
  }
})
</script>

<template>
  <section
    v-editable="blok"
    ref="pageRef"
    class="page"
  >
    <h1
      v-if="blok.title"
      ref="pageTitleRef"
      class="page__title"
    >
      {{ blok.title }}<span class="dot">.</span>
    </h1>

    <div
      ref="pageGroupRef"
      class="page__group"
    >
      <StoryblokComponent
        v-for="blokComponent in blok.body"
        :key="blokComponent._uid"
        :blok="blokComponent as SbBlokData"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;
@use "sass:math";

.page {
  position: relative;
  padding-bottom: var(--nav-height);
  height: 100%;
  color: var(--primary);
  visibility: hidden;

  @media screen and (min-width: $max-width) {
    padding-top: 50px;
  }

  &__title {
    display: none;
    pointer-events: none;

    @media screen and (min-width: $max-width) {
      display: block;
      position: relative;
      padding: 0 25px;
      font-size: var(--font-6xl);
      font-weight: 700;
      font-family: var(--font-family-secondary);
      text-transform: capitalize;
      z-index: 2;
      visibility: hidden;
    }
  }

  &__group {
    height: 100%;
    margin-top: var(--space-l);
    visibility: hidden;
  }

  &__component {
    margin-top: 25px;
  }
}
</style>