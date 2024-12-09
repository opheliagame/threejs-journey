import * as THREE from 'three'
import fragmentShader from '../glsl/main.frag'
import vertexShader from '../glsl/main.vert'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { gsap } from 'gsap';
import Card from './card';
import Raycaster from './raycaster';

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

    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    this.camera.position.set(0, 0, 2)
    this.scene.add(this.camera)

    this.uniforms = {
      time: { value: 1.0 }
    }

    const loader = new THREE.CubeTextureLoader()
    loader.setPath('https://threejs.org/examples/textures/cube/Bridge2/')
    const textureCube = loader.load([ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ])

    this.scene.background = textureCube

    this.addObjects()

    this.renderer = new THREE.WebGLRenderer({
      canvas: container
    })
    this.renderer.setSize(sizes.width, sizes.height)


    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.raycaster = new Raycaster(this.scene, this.camera)
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))

    const t = this.clock.getElapsedTime() * 2
    this.uniforms.time.value = t
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

    let xres = 4
    let yres = 2

    let xedge = 2/xres
    let yedge = 2/yres

    for (let i = 0; i < xres; i++) {
      for (let j = 0; j < yres; j++) {
        let x = (i / xres * 2 - 1) * 2 + xedge 
        let y = (j / yres * 2 - 1) * 2 + yedge

        console.log(`x pos: ${x}, y pos: ${y}`)

        const plane = new Card({
          x: x, y: y, envMap: this.scene.background,
        })
        this.scene.add(plane)

      }
    }


  }

}

export default World