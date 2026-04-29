import { createProgressGuard } from './progress'
import { createRouteGuard } from './route'
import { createDocumentTitleGuard } from './title'

/**
 * Router guard
 *
 * @param router - Router instance
 */
export function createRouterGuard(router) {
  createProgressGuard(router)
  createRouteGuard(router)
  createDocumentTitleGuard(router)
}
