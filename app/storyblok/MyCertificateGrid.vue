<script lang="ts" setup>
import type { MyCertificate } from '~/types/components'
import MyCertificateCard from './MyCertificate.vue'

defineProps<{
  certificates: MyCertificate[]
}>()
</script>

<template>
  <ul class="cert-grid">
    <li
      v-for="cert in certificates"
      :key="cert._uid"
      class="cert-grid__item"
    >
      <MyCertificateCard :blok="cert" />
    </li>
  </ul>
</template>

<style scoped lang="scss">
@use '~/assets/styles/variables' as *;

.cert-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 40px;
  padding: 0 25px;

  @media screen and (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  @media screen and (min-width: $max-width) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }

  &__item {
    display: flex;
    min-width: 0;
  }
}
</style>