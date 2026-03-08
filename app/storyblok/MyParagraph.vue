<script lang="ts" setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { computed, onMounted, ref } from 'vue'
import type { MyParagraph } from '~/types/components'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

const props = defineProps<{ blok: MyParagraph }>()

/*
|--------------------------------------------------------------------------
| Refs
|--------------------------------------------------------------------------
*/

const figureRef = ref<Element | null>(null)
const paragraphRef = ref<Element | null>(null)

/*
|--------------------------------------------------------------------------
| Storyblok helpers
|--------------------------------------------------------------------------
*/

const figure = computed(() => props.blok.figure?.[0] || null)

/*
|--------------------------------------------------------------------------
| Animation
|--------------------------------------------------------------------------
*/

function createScrollTriggerTl(target: Element) {
  gsap.set(target, { autoAlpha: 0 })

  return gsap.timeline({
    scrollTrigger: {
      trigger: target,
      end: 'center center',
      scrub: true
    }
  }).to(target, {
    autoAlpha: 1,
    ease: 'power2.out',
    duration: 0.5
  })
}

onMounted(() => {
  if (!process.client) return

  if (figureRef.value && figure.value) {
    createScrollTriggerTl(figureRef.value)
  }

  if (paragraphRef.value) {
    createScrollTriggerTl(paragraphRef.value)
  }
})
</script>

<template>
  <section
    v-editable="blok"
    :class="[
      'paragraph',
      { 'paragraph--reversed': blok.isReversed },
      { 'paragraph--scroll': blok.showScroll }
    ]"
  >

    <!-- TEXT -->
    <div ref="paragraphRef" class="paragraph__text">

      

    </div>

    <!-- FIGURE -->
    <div
      v-if="figure"
      ref="figureRef"
      class="paragraph__figure"
    >
      <component
        :is="figure.component"
        :key="figure._uid"
        :blok="figure"
        :auto-size="false"
      />
    </div>

  </section>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.paragraph {
  display: flex;
  align-items: center;
  flex-direction: column-reverse;
  padding: 0 25px 25vh;

  &--scroll {
    padding-bottom: 0;
    margin-bottom: 50vh;
    position: relative;

    &::before {
      content: 'SCROLL';
      position: absolute;
      top: 105%;
      color: var(--secondary);
      font-size: 12px;
      font-family: var(--font-family-secondary);
      opacity: 0.75;
      animation: bounce 1.5s infinite alternate-reverse ease-in-out;
    }

    &::after {
      content: '';
      position: absolute;
      top: 112%;
      width: 1px;
      height: 40vh;
      background-color: var(--secondary);
      opacity: 0.75;

      @media screen and (min-width: $max-width) {
        left: 4%;
      }
    }

    .paragraph__text {
      flex-basis: 70%;

      @media screen and (min-width: $max-width) {
        text-align: left;
      }
    }

    .paragraph__figure {
      padding-left: 0;
    }
  }

  &:last-child {
    padding-bottom: var(--nav-height);

    @media screen and (min-width: $max-width) {
      padding-bottom: 25vh;
    }
  }

  @media screen and (min-width: $max-width) {
    flex-direction: row;
  }

  &--reversed {
    @media screen and (min-width: $max-width) {
      flex-direction: row-reverse;

      .paragraph__figure {
        padding-left: 0;
        padding-right: 20%;
      }
    }
  }

  &__text {
    min-width: 100%;
    margin-top: 25px;
    visibility: hidden;

    @media screen and (min-width: $max-width) {
      min-width: auto;
      flex-basis: 50%;
      margin-top: 0;
    }
  }

  &__figure {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70%;
    width: 70%;
    transform-box: fill-box;
    padding: 0 5vw;

    @media screen and (min-width: $max-width) {
      flex-basis: 50%;
      padding-right: 0;
      padding-left: 20%;
    }
  }
}

@keyframes bounce {
  from {
    transform: translate3d(0, -5px, 0);
  }

  to {
    transform: translate3d(0, 5px, 0);
  }
}
</style>