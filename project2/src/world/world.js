import * as THREE from 'three'
import fragmentShader from '../glsl/main.frag'
import vertexShader from '../glsl/main.vert'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { gsap } from 'gsap';
import Raycaster from './raycaster';
import LineBasic from './lines/line-basic';
import { getCirclePoints, getRandomPoints } from '../utils/points';
import CurveSpline from './lines/curve-spline';
import CurveCubicBezier from './lines/curve-cubic-bezier';
import Floor from './floor';
import Cube from './cube';
import LineBasicMesh from './mesh/line/line-basic-mesh';
import CurveSplineMesh from './mesh/line/curve-spline-mesh';
import CurveSpline3d from './lines/curve-spline-3d';

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
    this.camera.position.set(0, 2, 2)
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
    directionalLight.color.setHSL( 0.1, 1, 0.95 );
    directionalLight.position.set( 2, 4, -1 );
    // directionalLight.position.multiplyScalar( 30 );
    this.scene.add( directionalLight );
    directionalLight.castShadow = true;
    // TODO look into directional light params for casting shadow
    // directionalLight.shadow.mapSize.width = 2048;
    // directionalLight.shadow.mapSize.height = 2048;
    // const d = 50;
    // directionalLight.shadow.camera.left = - d;
    // directionalLight.shadow.camera.right = d;
    // directionalLight.shadow.camera.top = d;
    // directionalLight.shadow.camera.bottom = - d;

    // directionalLight.shadow.camera.far = 3500;
    // directionalLight.shadow.bias = - 0.0001;

    // const pointLight = new THREE.PointLight( 0xffff00, 1, 100 );
    // pointLight.position.set( 1, 1.5, -1 );
    // this.scene.add( pointLight );

    this.addObjects()

    this.renderer = new THREE.WebGLRenderer({
      canvas: container, 
      antialias: true,
    })
    this.renderer.setSize(sizes.width, sizes.height)
    this.renderer.shadowMap.enabled = true

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    // this.raycaster = new Raycaster(this.scene, this.camera)
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
    // floor
    let floor = new Floor()
    this.scene.add(floor)

    // temp cube
    let box = new Cube()
    this.scene.add(box)

    let points = getCirclePoints(1, 7)
    // console.log(points)
    
    // let line1 = new LineBasic(points)
    // line1.computeLineDistances();
    // line1.scale.set( 1, 1, 1 );
    // this.scene.add(line1)
    
    let curvePoints = getRandomPoints(6, -1, 1, -1, 1, -1, 1, false, false, false)
    console.log(curvePoints)

    let line1 = new CurveSpline3d(curvePoints)
    line1.computeLineDistances();
    line1.scale.set( 1, 1, 1 );
    // this.scene.add(line1)

    let tube1 = new CurveSplineMesh(curvePoints)
    this.scene.add(tube1)

  }

  addLines() {
    // let points = getCirclePoints(1, 5)
    let points = getRandomPoints(20, -1, 1, -1, 1, -1, 1, false, false, false)
    console.log(points)

    let line1 = new LineBasic(points)
    line1.computeLineDistances();
    line1.scale.set( 1, 1, 1 );
    this.scene.add(line1)

    let line2 = new CurveSpline(points)
    line2.computeLineDistances();
    line2.scale.set( 1, 1, 1 );
    this.scene.add(line2)

    let line3 = new CurveCubicBezier(points)
    line3.computeLineDistances();
    line3.scale.set( 1, 1, 1 );
    // this.scene.add(line3)
  }

}

export default World