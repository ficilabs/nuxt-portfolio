<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    link?: string
    external?: boolean
  }>(),
  {
    link: '',
    external: false
  }
)

const hasLink = computed(() => !!props.link)

const isExternal = computed(() => {
  if (!hasLink.value) return false
  if (props.external) return true
  return props.link.startsWith('http')
})
</script>

<template>
  <!-- External -->
  <a
    v-if="hasLink && isExternal"
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
    v-else-if="hasLink && !isExternal"
    :to="link"
    class="link"
  >
    <TextWithArrow>
      <slot />
    </TextWithArrow>
  </NuxtLink>

  <!-- Disabled / No link -->
  <span
    v-else
    class="link link--disabled"
  >
    <TextWithArrow>
      <slot />
    </TextWithArrow>
  </span>
</template>