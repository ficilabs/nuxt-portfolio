<script setup lang="ts">
import type { MyHero } from '~/types/components'

defineProps<{ blok: MyHero }>()
</script>

<template>
  <section v-editable="blok" class="hero">
    <div class="hero__group">
      <!-- 🔹 Rich Text Blocks -->
      <MyRichText
        v-for="item in blok.text"
        :key="item._uid"
        :blok="item"
        class="hero__text"
      />

      <!-- 🔹 Button List -->
      <MyButtonList
        v-if="blok.buttonList?.[0]"
        :blok="blok.buttonList[0]"
      />
    </div>
    <MyHeroFigure />
  </section>
</template>

<style scoped lang="scss">
@use '~/assets/styles/variables' as *;

.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  color: var(--primary);

  @media screen and (min-width: $max-width) {
    margin-top: -50px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  &__group {
    position: relative;
    padding: 0 25px;

    @media screen and (min-width: $max-width) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  &__text {
    position: relative;
    z-index: 1;
  }
}
</style>