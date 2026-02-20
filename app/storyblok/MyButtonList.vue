<script setup lang="ts">
import { ref } from 'vue'
import MyButton from './MyButton.vue'

type MyButtonBlok = {
  _uid: string
  text: string
  isRound: boolean
  isLink: boolean
  link?: {
    linktype?: string
    cached_url?: string
    url?: string
  }
}

type MyButtonListBlok = {
  buttons: MyButtonBlok[]
}

defineProps<{
  blok: MyButtonListBlok
}>()

const el = ref<HTMLElement | null>(null)
</script>

<template>
  <ul
    v-editable="blok"
    class="button-list"
    ref="el"
  >
    <li
      v-for="button in blok.buttons"
      :key="button._uid"
      class="button-list__elem"
    >
      <MyButton :blok="button" />
    </li>
  </ul>
</template>

<style scoped lang="scss">
@use '~/assets/styles/variables' as *;

.button-list {
  display: none;
  margin-top: var(--space-s-m);

  @media screen and (min-width: $max-width) {
    display: flex;
  }
}
</style>