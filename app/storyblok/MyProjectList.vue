<script setup lang="ts">
import type { MyProjectList } from '~/types/components'

const props = defineProps<{
  blok: MyProjectList
}>()

const ITEMS_PER_PAGE = 6

const activeFilter = ref<string>('show-all')
const currentPage = ref(1)

const filteredProjects = computed(() => {
  if (activeFilter.value === 'show-all') return props.blok.body
  return props.blok.body?.filter(project =>
    project.tags?.includes(activeFilter.value as any)
  ) ?? []
})

// Reset to page 1 whenever filter changes
function onFilterSelected(tag: string) {
  activeFilter.value = tag
  currentPage.value = 1
}

// Total pages based on filtered results
const totalPages = computed(() =>
  Math.ceil((filteredProjects.value?.length ?? 0) / ITEMS_PER_PAGE)
)

// Slice the filtered list for the current page
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredProjects.value?.slice(start, start + ITEMS_PER_PAGE) ?? []
})

function onPageChange(page: number) {
  currentPage.value = page
}
</script>

<template>
  <section
    v-editable="blok"
    class="projects page__component"
  >
    <MyProjectFilter
      v-if="blok.filter?.[0]"
      :blok="blok.filter[0]"
      @filterSelected="onFilterSelected"
    />

    <ul
      v-if="paginatedProjects.length"
      class="projects__list"
    >
      <li
        v-for="project in paginatedProjects"
        :key="project._uid"
        class="projects__project"
      >
        <MyProject :blok="project" />
      </li>
    </ul>

    <p v-else class="projects__empty">No projects found.</p>

    <!-- Pagination — only shown when there is more than one page -->
    <div v-if="totalPages > 1" class="projects__pagination">
      <MyPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :max-visible="5"
        @page-change="onPageChange"
      />
    </div>

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

  &__pagination {
    display: flex;
    justify-content: center;
    margin-top: 50px;

    @media screen and (min-width: 1024px) {
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