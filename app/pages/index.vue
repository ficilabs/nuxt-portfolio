<script setup>
  const { story } = await useAsyncStoryblok('project', {
    api: {
      version: 'draft', // or 'published'
    },
  });
</script>

<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
</template>