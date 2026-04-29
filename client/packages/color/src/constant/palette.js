import defaultPalettes from '../json/palette.json'

export const colorPalettes = defaultPalettes.map((family) => ({
  name: family.key,
  palettes: family.palettes.map((palette) => ({
    hex: palette.hexcode,
    number: palette.number
  }))
}))
