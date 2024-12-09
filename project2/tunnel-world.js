import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Tunnel from './src/world/tunnel';

class TunnelWorld {

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
    this.camera.position.set(0, 0, 500)
    this.scene.add(this.camera)

    this.uniforms = {
      time: { value: 1.0 }
    }

    const loader = new THREE.CubeTextureLoader()
    loader.setPath('https://threejs.org/examples/textures/cube/Bridge2/')
    const textureCube = loader.load([ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ])

    // this.scene.background = textureCube
    this.scene.background = new THREE.Color( 'skyblue' )

    // LIGHTS
    const softWhiteAmbientLight = new THREE.AmbientLight( 0xffffff );
    this.scene.add(softWhiteAmbientLight)

    // const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    // const targetObject = new THREE.Vector3(-2, 0, 0)
    // this.scene.add(targetObject)
    // directionalLight.target = targetObject
   
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    // directionalLight.color.setHSL( 0.1, 1, 0.95 );
    directionalLight.position.set( 0, 0, 500 );
    // directionalLight.position.multiplyScalar( 30 );

    const targetObject = new THREE.Object3D(0, 0, 400); 
    this.scene.add(targetObject);
    directionalLight.target = targetObject
    this.scene.add( directionalLight );
    this.scene.add(directionalLight.target)
    // directionalLight.castShadow = true;

    this.lights = {
      ambient: softWhiteAmbientLight,
      directional: directionalLight,
    }

    this.addObjects()

    this.renderer = new THREE.WebGLRenderer({
      canvas: container, 
      antialias: true,
      alpha: true,
    })
    this.renderer.setSize(sizes.width, sizes.height)
    this.renderer.shadowMap.enabled = true
    document.body.appendChild(this.renderer.domElement)

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    // this.raycaster = new Raycaster(this.scene, this.camera)

    this.setupGsap()

  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))

    const t = this.clock.getElapsedTime() * 2
    this.uniforms.time.value = t
    // this.controls.update()

    this.scene.traverse((obj) => {
      if (obj.render) obj.render(t)
    })

    this.render()
  }

  setupGsap() {
    // GSAP ScrollTrigger setup
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(this.camera.position, {
      z: 0,
      // ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: false,
        // onUpdate: self => {
        //   // this.lights.directional.target = this.camera.position.z
        //   console.log("z")
        //   console.log(this.camera.position.z)
  
        //   const points = this.tunnel.points
        //   // // Ensure the camera looks forward along the tunnel
        //   // // console.log(Math.floor(this.camera.position.z / 10000000))
        //   this.camera.lookAt(points[Math.floor(this.camera.position.z / 5) % points.length]);
        // }
        onUpdate: (self) => {
          // const progress = 1
          // console.log(e)
          const progress = self.progress;
          const currentPoint = this.tunnel.path.getPointAt(progress);
          const nextPoint = this.tunnel.path.getPointAt((progress + 0.001) % 1); // Small increment for next point
          console.log(nextPoint)
          
          this.camera.position.copy(currentPoint);
          this.camera.lookAt(nextPoint);
          console.log(this.camera.rotation.y)
        },
      },
      
      
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  addObjects() {
    const tunnel = new Tunnel()
    this.scene.add(tunnel)

    this.tunnel = tunnel
  }



}

export default TunnelWorld