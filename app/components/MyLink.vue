<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    link: string
    external?: boolean
  }>(),
  {
    link: '',
    external: false
  }
)

const isExternal = computed(() => {
  if (props.external) return true
  return props.link.startsWith('http')
})
</script>

<template>
  <!-- External -->
  <a
    v-if="isExternal"
    :href="link"
    class="link"
    target="_blank"
    rel="noopener noreferrer"
  >
    <TextWithArrow>
      <slot />
    </TextWithArrow>
  </a>

  <!-- Internal -->
  <NuxtLink
    v-else
    :to="link"
    class="link"
  >
    <TextWithArrow>
      <slot />
    </TextWithArrow>
  </NuxtLink>
</template>