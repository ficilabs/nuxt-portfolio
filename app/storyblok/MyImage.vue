<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import type { MyImage } from '~/types/components'
import { responsiveImg } from '~/utils/responsive-image'

interface Props {
  blok: MyImage

  alt?: string
  autoSize?: boolean
  borderRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  autoSize: true,
  borderRadius: '0'
})

const pictureRef = ref<HTMLPictureElement | null>(null)
const isLoading = ref(true)

/*
|--------------------------------------------------------------------------
| Normalize Storyblok Data
|--------------------------------------------------------------------------
*/

const src = computed(() => {
  if (!props.blok?.image) return ''
  return props.blok.image.startsWith('//')
    ? `https:${props.blok.image}`
    : props.blok.image
})

const width = computed(() =>
  props.blok?.width ? Number(props.blok.width) : undefined
)

const height = computed(() =>
  props.blok?.height ? Number(props.blok.height) : undefined
)

/*
|--------------------------------------------------------------------------
| Responsive Images
|--------------------------------------------------------------------------
*/

const sizes = [480, 768, 1024, 1280]

const srcsetWebp = computed(() =>
  responsiveImg.createSrcset(src.value, 'filters:format(webp)', sizes)
)

const srcsetPng = computed(() =>
  responsiveImg.createSrcset(src.value, 'filters:format(png)', sizes)
)

/*
|--------------------------------------------------------------------------
| Lazy Loading (SSR safe)
|--------------------------------------------------------------------------
*/

function loadImage(picture: HTMLPictureElement) {
  const sources = picture.querySelectorAll('source')

  sources.forEach((source) => {
    const ds = source.dataset.srcset
    if (ds) source.srcset = ds
  })

  const img = picture.querySelector('img')

  if (!img) return

  const ds = picture.dataset.src
  if (ds) img.src = ds

  img.onload = () => {
    isLoading.value = false
    img.classList.add('loaded')
  }
}

onMounted(() => {
  if (!process.client || !pictureRef.value) return

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage(entry.target as HTMLPictureElement)
          obs.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2 }
  )

  observer.observe(pictureRef.value)
})
</script>

<template>
  <picture
    ref="pictureRef"
    class="picture"
    :data-src="src"
  >
    <!-- Loader -->
    <div v-if="isLoading" class="loading">
      <div class="circle"/>
      <div class="circle"/>
      <div class="circle"/>
    </div>

    <!-- WEBP -->
    <source
      v-for="(s,i) in srcsetWebp"
      :key="'webp'+i"
      :data-srcset="s"
      type="image/webp"
    />

    <!-- PNG fallback -->
    <source
      v-for="(s,i) in srcsetPng"
      :key="'png'+i"
      :data-srcset="s"
      type="image/png"
    />

    <img
      class="image"
      :class="{ 'image--auto-size': autoSize }"
      :alt="alt"
      :width="width"
      :height="height"
      :data-src="src"
      src="~/assets/placeholder.svg"
      :style="{ borderRadius }"
    />
  </picture>
</template>

<style scoped>
.picture {
  position: relative;
}

.image {
  opacity: 0;
  transition: opacity .3s;
}

.image--auto-size {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loaded {
  opacity: 1;
}

.loading {
  position: absolute;
  inset: 0;
  display:flex;
  justify-content:center;
  align-items:center;
}

.circle {
  width:8px;
  height:8px;
  margin:2px;
  border-radius:50%;
  background:var(--tertiary);
  animation:bounce .5s infinite alternate;
}

.circle:nth-child(2){animation-delay:.15s}
.circle:nth-child(3){animation-delay:.3s}

@keyframes bounce{
  from{opacity:1}
  to{opacity:.5}
}
</style>