<script setup lang="ts">
import type { MyProjectList } from '~/types/components'

const props = defineProps<{
  blok: MyProjectList
}>()
</script>

<template>
  <section
    v-editable="blok"
    class="projects page__component"
  >
    <ul
      v-if="blok.body?.length"
      class="projects__list"
    >
      <li
        v-for="project in blok.body"
        :key="project._uid"
        class="projects__project"
      >
        <MyProject :blok="project" />
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.projects {
  width: 100%;
  height: auto;
  padding: 0 25px var(--nav-height);

  &__list-wrapper {
    visibility: hidden;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fit,
        minmax(max(250px, calc((100% - 50px) / 2)), 1fr));
    justify-content: center;
    gap: 50px;
    margin-top: 50px;

    @media screen and (min-width: 1024px) {
      grid-template-columns: repeat(auto-fit, minmax(370px, 1fr));
      justify-content: flex-start;
      gap: 100px;
      margin-top: 100px;
    }
  }
}

.list-complete {
  will-change: transform;

  &-item {
    transition-property: opacity, transform;
    transition-duration: 0.75s;
    transition-timing-function: ease-in-out;
  }

  &-enter {
    opacity: 0;
    transform: translate3d(0, 100%, 0);

    &-item {
      transition-delay: 0.5s;
    }
  }

  &-leave-active {
    position: absolute;
    visibility: hidden;
  }
}
</style>