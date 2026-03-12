<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStoryblokApi } from '@storyblok/vue'

const route = useRoute()
const storyblokApi = useStoryblokApi()
const story = ref(null)

const slug = computed(() => {
  if (!route.params.slug || route.params.slug.length === 0) return 'home'
  return Array.isArray(route.params.slug)
    ? route.params.slug.join('/')
    : route.params.slug
})

async function fetchStory() {
  const { data } = await storyblokApi.get(`cdn/stories/${slug.value}`, {
    version: 'draft'
  })
  story.value = data.story
}

await fetchStory()

watch(slug, () => fetchStory())
</script>

<template>
  <StoryblokComponent
    v-if="story"
    :blok="story.content"
    :key="slug"
  />
</template>