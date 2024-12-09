import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Flyer, Plane, PlaneObject } from './cell'
import { getRandomPaletteColor } from '../utils/color';

class World {

  constructor(container) {
    this.clock = new THREE.Clock()
    // Scene
    this.scene = new THREE.Scene()

    // sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    // this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    let res = 4
    this.camera = new THREE.OrthographicCamera(-res, res, -res, res, 1, 10)
    this.camera.position.set(0, 0, 1)
    // this.camera.rotation.set(Math.PI/2, Math.PI, 1)

    // this.camera.position.set(-1, 0, 10)
    // this.camera.lookAt(0, 0, 0)

    this.scene.add(this.camera)


    // this.scene.background = new THREE.Color( getRandomPaletteColor() )
    this.scene.background = new THREE.Color( 0x000000 )

    this.addObjects()

    this.renderer = new THREE.WebGLRenderer({
      canvas: container
    })
    this.renderer.setSize(sizes.width, sizes.height)


    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))

    const t = this.clock.getElapsedTime() * 2
    this.controls.update()

    this.scene.traverse((obj) => {
      if (obj.render) obj.render(t)
    })

    this.render()
  }

  render() {
    this.renderer.render(this.scene, this.camera)

  }

  addObjects() {
    // let leftWingMesh = new Plane()
    // let rightWingMesh = new Plane()

    // let leftWing = new PlaneObject({x: -0.25, y: 0, offx: 0.25, offy: 0, mesh: leftWingMesh})
    // let rightWing = new PlaneObject({x: 0.25, y: 0, offx: -0.25, offy: 0, mesh: rightWingMesh})

    let data = "1.6,-0.6000000000000001;1.5,-0.5;-1.8,-0.30000000000000004;-1.7,-0.30000000000000004;-1.6,-0.30000000000000004;-1.2,-0.30000000000000004;-1.1,-0.30000000000000004;-0.6000000000000001,-0.30000000000000004;-0.5,-0.30000000000000004;-0.3999999999999999,-0.30000000000000004;-0.10000000000000009,-0.30000000000000004;0,-0.30000000000000004;0.10000000000000009,-0.30000000000000004;0.3999999999999999,-0.30000000000000004;0.7000000000000002,-0.30000000000000004;0.8999999999999999,-0.30000000000000004;1,-0.30000000000000004;1.1,-0.30000000000000004;1.2000000000000002,-0.30000000000000004;1.4,-0.30000000000000004;1.5,-0.30000000000000004;1.6,-0.30000000000000004;1.7000000000000002,-0.30000000000000004;-1.9,-0.19999999999999996;-1.5,-0.19999999999999996;-1.3,-0.19999999999999996;-1,-0.19999999999999996;-0.7,-0.19999999999999996;-0.19999999999999996,-0.19999999999999996;0.20000000000000018,-0.19999999999999996;0.3999999999999999,-0.19999999999999996;0.5,-0.19999999999999996;0.7000000000000002,-0.19999999999999996;1.1,-0.19999999999999996;1.4,-0.19999999999999996;-1.9,-0.10000000000000009;-1.5,-0.10000000000000009;-1.3,-0.10000000000000009;-1,-0.10000000000000009;-0.7,-0.10000000000000009;-0.19999999999999996,-0.10000000000000009;0.20000000000000018,-0.10000000000000009;0.3999999999999999,-0.10000000000000009;0.5,-0.10000000000000009;0.7000000000000002,-0.10000000000000009;1.1,-0.10000000000000009;1.4,-0.10000000000000009;-1.9,0;-1.3,0;-0.6000000000000001,0;-0.5,0;-0.19999999999999996,0;-0.10000000000000009,0;0,0;0.10000000000000009,0;0.20000000000000018,0;0.3999999999999999,0;0.6000000000000001,0;0.7000000000000002,0;1.1,0;1.4,0;1.5,0;1.6,0;-1.9,0.10000000000000009;-1.5,0.10000000000000009;-1.3,0.10000000000000009;-1,0.10000000000000009;-0.3999999999999999,0.10000000000000009;-0.19999999999999996,0.10000000000000009;0.20000000000000018,0.10000000000000009;0.3999999999999999,0.10000000000000009;0.7000000000000002,0.10000000000000009;1.1,0.10000000000000009;1.4,0.10000000000000009;-1.8,0.20000000000000018;-1.7,0.20000000000000018;-1.6,0.20000000000000018;-1.2,0.20000000000000018;-1.1,0.20000000000000018;-0.7,0.20000000000000018;-0.6000000000000001,0.20000000000000018;-0.5,0.20000000000000018;-0.19999999999999996,0.20000000000000018;0.20000000000000018,0.20000000000000018;0.3999999999999999,0.20000000000000018;0.7000000000000002,0.20000000000000018;1.1,0.20000000000000018;1.4,0.20000000000000018;1.5,0.20000000000000018;1.6,0.20000000000000018;1.7000000000000002,0.20000000000000018;"
    let items = data.split(";")
    let nItems = items.length
    for(let i = 0; i < nItems; i++) {
      let d = items[i].split(',')
      let destx = d[0] * 6
      let desty = d[1] * 6

      let rVector = new THREE.Vector2(Math.random()*2-1, Math.random()*2-1).multiplyScalar(2)
      let dirVector = new THREE.Vector2(destx, desty).normalize().multiplyScalar(12).add(rVector)
      
      let startx = dirVector.x
      let starty = dirVector.y

      
      // let mesh = new Flyer({startx: startx, starty: -starty, destx: destx, desty: -desty})
      let mesh = new Flyer({startx: destx, starty: -desty, destx: destx, desty: -desty})
      // mesh.addWing({pos: "left", mesh: leftWing.clone()})
      // mesh.addWing({pos: "right", mesh: rightWing.clone()})

      // console.log(mesh)

      this.scene.add(mesh)
    }
  }

}

export default World