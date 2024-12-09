import * as THREE from 'three';
import fragmentShader from '../glsl/main.frag'
import vertexShader from '../glsl/main.vert'
import { radians } from 'three/examples/jsm/nodes/Nodes.js';
import { gsap } from 'gsap'
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons';


class Card extends THREE.Mesh {
  constructor({x, y, z=0, envMap}) {
    super()
    // this.geometry = new THREE.PlaneGeometry( 2, 2, 35, 25 );
    // this.geometry = new THREE.BoxGeometry(3/4, 0.05, 1)
    this.geometry = new RoundedBoxGeometry(3/4, 0.05, 1)
    this.uniforms = {
      time: { value: 1.0 }
    }
    // this.material = new THREE.RawShaderMaterial( {
    //   uniforms: this.uniforms,
    //   vertexShader: vertexShader,
    //   fragmentShader: fragmentShader,
    //   side: THREE.DoubleSide,
    //   transparent: true
    // } );
    if(envMap) {
      this.material = new THREE.MeshBasicMaterial({ envMap: envMap })
    }
    else {
      this.material = new THREE.MeshBasicMaterial({ color: new THREE.Color('orange') })
    }

    const cx = 0;
    const cy = 0;
    const width = 1;
    const height = 1.2;
    const radius = 0.2;
    // Create 2D card shape
    const shape = new THREE.Shape()
      .moveTo(cx, cy + radius)
      .lineTo(cx, cy + height - radius)
      .quadraticCurveTo(cx, cy + height, cx + radius, cy + height)
      .lineTo(cx + width - radius, cy + height)
      .quadraticCurveTo(cx + width, cy + height, cx + width, cy + height - radius)
      .lineTo(cx + width, cy + radius)
      .quadraticCurveTo(cx + width, cy, cx + width - radius, cy)
      .lineTo(cx + radius, cy)
      .quadraticCurveTo(cx, cy, cx, cy + radius);

    // Create card mesh
    this.geometry = new THREE.ShapeGeometry(shape);
    this.material = new THREE.MeshBasicMaterial({ envMap: envMap, side: THREE.DoubleSide });
    // this.rotation.x = Math.PI/2
    // this.rotation.y = Math.PI/2

    this.active = false

    this.initPosition = { x: x, y: y, z: z }

    this.position.x = x
    this.position.y = y
    this.position.z = z
  
  }


  render() {
    // this.rotation.x = this.rotation.y += 0.01
  }

  onPointerOver(e) {
    this.material.color.set('hotpink')
    // this.material.color.convertSRGBToLinear()
  }

  onPointerOut(e) {
    this.material.color.set('orange')
    // this.material.color.convertSRGBToLinear()

    gsap.to(this.position, { duration: 2, z: this.initPosition.z, x: this.initPosition.x, y: this.initPosition.y })
  }



  onClick(e) {
    // this.active = !this.active
    // this.scale.setScalar(this.cubeSize * (this.cubeActive ? 1.5 : 1))

    gsap.to(this.position, { duration: 2, z: 2, x: 0, y: 0 })
    gsap.to(this.rotation, { duration: 2, z: this.rotation.y + Math.PI })

  }
}

export default Card