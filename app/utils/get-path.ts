export function getPath(slug: string) {
  return slug === 'home' ? '/' : `/${slug}`
}