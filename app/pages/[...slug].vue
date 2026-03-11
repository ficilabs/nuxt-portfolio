<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const slug = route.params.slug
  ? route.params.slug.join('/')
  : 'home'

const { story } = await useAsyncStoryblok(slug, {
  api: {
    version: 'draft'
  }
})
</script>

<template>
  <StoryblokComponent
    v-if="story"
    :blok="story.content"
  />
</template>