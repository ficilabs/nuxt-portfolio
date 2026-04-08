<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { MyCertificateList } from '~/types/components'
import { elasticAnimation } from '~/utils/gsap-animations'
import MyCertificateGrid from './MyCertificateGrid.vue'

const props = defineProps<{
  blok: MyCertificateList
}>()

const gridRef = ref<Element | null>(null)

onMounted(() => {
  if (!gridRef.value) return
  const cards = gridRef.value.querySelectorAll('.cert-wrapper')
  if (window.innerWidth < 1024) {
    elasticAnimation(cards, -7, -7, 1, 0.25, 0.3)
  } else {
    elasticAnimation(cards, -7, -7, 1, 0.45, 0.3)
  }
})
</script>

<template>
  <section
    v-editable="blok"
    class="certificates page__component"
  >
    <div ref="gridRef">
      <MyCertificateGrid
        v-if="blok.certificates?.length"
        :certificates="blok.certificates"
      />
      <p v-else class="certificates__empty">
        No certificates found.
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '~/assets/styles/variables' as *;

.certificates {
  width: 100%;
  padding: 0 0 var(--nav-height);

  &__empty {
    padding: 0 25px;
    font-family: var(--font-family);
    color: var(--primary);
    opacity: 0.5;
  }
}
</style>