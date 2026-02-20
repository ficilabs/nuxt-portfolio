<script setup lang="ts">
import { computed, ref } from 'vue'

type MyButton = {
  text: string
  isRound: boolean
  isLink: boolean
  link?: {
    linktype?: string
    cached_url?: string
    url?: string
  }
}

const props = defineProps<{
  blok: MyButton
}>()

const isSelected = ref(false)

const onClick = () => {
  isSelected.value = !isSelected.value
}

const resolvedPath = computed(() => {
  if (!props.blok?.link) return '/'

  if (props.blok.link.linktype === 'story') {
    return `/${props.blok.link.cached_url || ''}`
  }

  if (props.blok.link.linktype === 'url') {
    return props.blok.link.url || '#'
  }

  return '/'
})
</script>

<template>
  <div
    v-if="blok"
    v-editable="blok"
    :class="['button-container', { 'button-container--round': blok.isRound }]"
  >
    <button
      v-if="!blok.isLink"
      :class="[
        'button',
        { 'button--selected': isSelected },
        { 'button--round': blok.isRound },
      ]"
      type="button"
      :aria-pressed="isSelected"
      @click="onClick"
    >
      {{ blok.text }}
    </button>

    <NuxtLink
      v-else
      class="button"
      :to="resolvedPath"
    >
      {{ blok.text }}
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/variables' as *;
@use 'sass:color' as color;

/* CSS TIDAK DIUBAH */
.button-container {
  position: relative;
  margin: var(--space-2xs);
  width: max-content;
  height: max-content;
  border-radius: var(--border-radius);
  background-color: var(--primary);
  transition: background-color 0.15s linear;

  &--round {
    margin: 7px;
    border-radius: 50px;
  }
}

.button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--border);
  border-radius: inherit;
  padding: 10px 21px;
  color: var(--primary-dark);
  background-color: var(--tertiary);
  font-size: 16px;
  font-family: var(--font-family-secondary);
  font-weight: 700;
  text-decoration: none;
  will-change: transform;
  transform: translate3d(-10px, -10px, 0);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.15s linear;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translate3d(-3px, -3px, 0);
      cursor: pointer;
    }

    &:active {
      transform: translate3d(0, 0, 0);
    }
  }

  &--round {
    background-color: var(--secondary);
    color: var(--primary-dark);
    border-radius: 50px;
    padding: 5px 11px;
    font-size: 14px;
    transform: translate3d(-7px, -7px, 0);
  }

  &--selected {
    transform: translate3d(0, 0, 0);
    background-color: color.scale($tertiary-dark, $lightness: -10%);

    &:hover {
      transform: translate3d(0, 0, 0);
    }
  }

  &--round.button--selected {
    background-color: var(--primary-light);
  }
}

.dark-scheme {
  .button-container {
    background-color: var(--stroke);
  }
}
</style>