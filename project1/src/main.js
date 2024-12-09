import World from "./ccsante-loading/world"
import { getPalette, loadColors } from "./utils/color"


async function main() {
  await getPalette()

  const container = document.querySelector('canvas.webgl')

  const world = new World(container)

  world.animate()
}

main()