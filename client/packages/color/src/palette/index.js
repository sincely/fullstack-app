import { getHex } from '../shared/index.js'
import { getAntDColorPalette } from './antd.js'
import { getRecommendedColorPalette } from './recommend.js'

export function getColorPalette(color, recommended = false) {
  const colorMap = new Map()

  if (recommended) {
    const colorPalette = getRecommendedColorPalette(getHex(color))
    colorPalette.palettes.forEach((palette) => {
      colorMap.set(palette.number, palette.hex)
    })
  } else {
    const colors = getAntDColorPalette(color)
    const colorNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

    colorNumbers.forEach((number, index) => {
      colorMap.set(number, colors[index])
    })
  }

  return colorMap
}

export function getPaletteColorByNumber(color, number, recommended = false) {
  const colorMap = getColorPalette(color, recommended)
  return colorMap.get(number)
}
