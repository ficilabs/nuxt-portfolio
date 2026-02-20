<script setup lang="ts">
defineProps<{
  blok: Object
}>()
</script>

<template>
  <section
    v-editable="blok"
    class="page"
  >
    <h1
      v-if="blok.title"
      class="page__title"
    >
      {{ blok.title }}<span class="dot">.</span>
    </h1>

    <pre>{{ blok }}</pre>

    <div class="page__group">
      <StoryblokComponent
        v-for="currentBlok in blok.body"
        :key="currentBlok._uid"
        :blok="currentBlok"
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