export function createProgressGuard(router) {
  router.beforeEach((_to, _from, next) => {
    window.NProgress?.start?.()
    next()
  })
  router.afterEach((_to) => {
    window.NProgress?.done?.()
  })
}
