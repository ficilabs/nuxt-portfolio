<script lang="ts" setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { computed, onMounted, ref } from 'vue'
import type { MyParagraph } from '~/types/components'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

const props = defineProps<{ blok: MyParagraph }>()

const figureRef = ref<Element | null>(null)
const paragraphRef = ref<Element | null>(null)

const figure = computed(() => props.blok.figure?.[0] || null)

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

    <!-- TEXT / CHAT BOX -->
    <div ref="paragraphRef" class="paragraph__text">
      <AiChatBox />
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
    /*
      On mobile: normal flow, centered horizontally.
      On desktop: flex column so the child (MyProfile) is both
      horizontally AND vertically centered inside this half-width column.
      align-self: stretch makes it take full height of the row,
      then justify-content: center + align-items: center put the
      profile dead-center inside that space.
    */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70%;
    padding: 0 5vw;

    @media screen and (min-width: $max-width) {
      flex-basis: 50%;
      align-self: stretch;  /* fill the full row height */
      width: auto;
      padding-right: 0;
      padding-left: 10%;
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