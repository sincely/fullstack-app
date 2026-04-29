import rawColorNames from '../json/color-name.json'

export const colorNames = rawColorNames.map(([hex, name]) => [`#${String(hex).toLowerCase()}`, name])
