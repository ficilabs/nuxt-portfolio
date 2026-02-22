<script setup lang="ts">
import type { MyProject } from '~/types/components'

const props = defineProps<{
  blok: MyProject
}>()
</script>

<template>
  <section
    v-if="blok"
    v-editable="blok"
    class="project"
  >
    <div class="project__group">
      <h2 class="project__title">
        <span class="dot">> </span>
        {{ blok.title }}
      </h2>

      <p class="project__description">
        {{ blok.description }}
      </p>

      <!-- Links -->

    </div>

    <div class="project__media">
      <div class="window">
        <div class="window__header">
          <svg class="window__buttons">
            <circle stroke-width="2" stroke="currentColor" cx="12" cy="12" r="4" />
            <circle stroke-width="2" stroke="currentColor" cx="28" cy="12" r="4" />
            <circle stroke-width="2" stroke="currentColor" cx="44" cy="12" r="4" />
          </svg>

          <span class="window__title">
            {{ blok.title }}
          </span>
        </div>
        <!-- Image -->
        <MyImage 
          v-if="blok.media" 
          :blok="blok.media"
          class="window__image" 
        />

      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.project {
  display: grid;
  grid-template-areas: 'media' 'group';
  grid-template-rows: max-content 1fr;
  row-gap: 20px;
  align-content: flex-start;
  height: 100%;

  &__title {
    font-size: var(--font-3xl);
    font-weight: 700;
    font-family: var(--font-family-secondary);
    margin-bottom: var(--space-xs);
  }

  &__group {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    padding: 0;
    grid-area: group;
  }

  &__description,
  &__links {
    padding-left: 25px;
  }

  &__links {
    display: flex;
    align-items: center;
    margin-top: auto;
    padding-top: 10px;
  }

  &__link {
    margin-right: var(--space-s);
  }

  &__media {
    grid-area: media;
    border-radius: var(--border-radius);
    background-color: var(--shadow);
    margin-left: 10px;
  }
}

.window {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  border: 2px solid var(--stroke);
  border-radius: var(--border-radius);
  color: var(--shadow);
  background-color: var(--secondary);
  overflow: hidden;

  &__header {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    position: relative;
    border-bottom: 2px solid var(--stroke);
    padding: 5px;
  }

  &__buttons {
    width: 64px;
    height: 24px;
    position: absolute;

    circle {
      fill: var(--tertiary);
      color: var(--stroke);
    }
  }

  &__title {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: left;
    font-family: var(--font-family-secondary);
    font-size: 14px;
  }

  &__image {
    display: flex;
  }
}

.dot {
  color: var(--tertiary);
}
</style>