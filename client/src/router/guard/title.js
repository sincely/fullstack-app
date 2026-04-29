import { useTitle } from '@vueuse/core'

export function createDocumentTitleGuard(router) {
  router.afterEach((to) => {
    const { title } = to.meta
    useTitle(title)
  })
}
