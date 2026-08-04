import { useContext } from '@sa/hooks'

import { useMenu, useMixMenu } from '../hooks'

export const { setupStore: setupMixMenuContext, useStore: useMixMenuContext } = useContext('mix-menu', useMixMenu)

export { useMenu }
