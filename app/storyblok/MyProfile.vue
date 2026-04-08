<script lang="ts" setup>
import MyImage from '~/storyblok/MyImage.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { MyProfile } from '~/types/components'
import { elevateAnimationObserver } from '~/utils/gsap-animations'

const props = defineProps<{ blok: MyProfile }>()

/*
|--------------------------------------------------------------------------
| Refs
|--------------------------------------------------------------------------
*/

const profileImgRef = ref<{ el: Element }>()
const linksRef = ref<Element>()

const profileImgObserver = ref<IntersectionObserver>()
const linksObserver = ref<IntersectionObserver>()

/*
|--------------------------------------------------------------------------
| Storyblok Image
|--------------------------------------------------------------------------
*/

const profileImage = computed(() => props.blok.profileImg?.[0])

/*
|--------------------------------------------------------------------------
| Social Links
|--------------------------------------------------------------------------
*/
function normalizeLink(id: string, link?: any) {
  return {
    id,
    url: link?.cached_url || link?.url || null
  }
}

const links = computed(() =>
  [
    normalizeLink('linkedin', props.blok.linkedin),
    normalizeLink('github', props.blok.github),
    normalizeLink('instagram', props.blok.instagram)
  ].filter(link => link.url)
)

function getUrl(link: any) {
  return link.cached_url || link.url
}

/*
|--------------------------------------------------------------------------
| Animations
|--------------------------------------------------------------------------
*/

onMounted(() => {
  if (profileImgRef.value?.el) {
    profileImgObserver.value = elevateAnimationObserver(profileImgRef.value.el)
  }

  if (linksRef.value) {
    linksObserver.value = elevateAnimationObserver(linksRef.value)
  }
})

onBeforeUnmount(() => {
  profileImgObserver.value?.disconnect()
  linksObserver.value?.disconnect()
})

/*
|--------------------------------------------------------------------------
| Icons
|--------------------------------------------------------------------------
*/

function iconPath(icon: string) {
  return `/sprite.svg#${icon}`
}
</script>

<template>
  <div v-editable="blok" class="profile">

    <!-- Profile Image
         .profile__img-group  = backing container (like .button-container)
         .profile__img        = floated image (like .button)
    -->
    <div class="profile__img-group">
      <MyImage
        v-if="profileImage"
        ref="profileImgRef"
        class="profile__img"
        :blok="profileImage"
        border-radius="50%"
      />
    </div>

    <!-- Social Links
         .profile__links-group  = backing container
         .profile__links        = floated bar
    -->
    <div class="profile__links-group">
      <ul ref="linksRef" class="profile__links">
        <li
          v-for="link in links"
          :key="link.id"
          class="profile__link"
        >
          <a
            class="profile__a"
            :href="getUrl(link)"
            target="_blank"
            rel="noopener me"
            :aria-label="`Go to ${link.id}`"
          >
            <svg class="profile__svg">
              <use :href="iconPath(link.id)" />
            </svg>
          </a>
        </li>
      </ul>
    </div>

  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/variables' as *;

/* ─── Root ────────────────────────────────────────────────────────────────── */

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-m);

  @media screen and (min-width: $max-width) {
    justify-content: center;
  }
}

/* ─── Image — mirrors .button-container / .button pattern ─────────────────── */

.profile__img-group {
  /*
    The dark backing "floor" — same role as .button-container.
    Its background-color peeks out from behind the translated image
    to create the offset shadow effect cleanly on a circle.
  */
  position: relative;
  width: max-content;
  height: max-content;
  border-radius: 50%;
  background-color: var(--primary);
  transition: background-color 0.15s linear;
}

.profile__img {
  /*
    Floats above the backing with the same offset as .button:
    translate3d(-10px, -10px, 0).
    border + outline replace the old conflicting box-shadow ring.
  */
  display: block;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 10px solid var(--secondary);
  outline: 2px solid var(--stroke);
  outline-offset: -1px;
  transform: translate3d(-10px, -10px, 0);
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.15s linear;
  will-change: transform;

  @media screen and (min-width: $max-width) {
    width: 250px;
    height: 250px;
  }
}

/* ─── Social links — same backing / float pattern ─────────────────────────── */

.profile__links-group {
  position: relative;
  width: 100%;
  max-width: 220px;
  border-radius: var(--border-radius);
  background-color: var(--primary);
  transition: background-color 0.15s linear;

  @media screen and (min-width: $max-width) {
    max-width: 250px;
  }
}

.profile__links {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  background-color: var(--tertiary);
  border-radius: var(--border-radius);
  border: var(--border);
  transform: translate3d(-10px, -10px, 0);
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.15s linear;
}

.profile__a {
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile__link {
  margin: 10px 0;
}

.profile__svg {
  width: 32px;
  height: 32px;
  color: var(--secondary);
  stroke: var(--stroke);
  stroke-width: 10;
  transition: color 0.15s ease-in-out;

  &:hover {
    color: var(--primary-light);
  }
}

/* ─── Dark scheme ─────────────────────────────────────────────────────────── */

.dark-scheme {
  .profile__img-group,
  .profile__links-group {
    background-color: var(--stroke);
  }
}
</style>