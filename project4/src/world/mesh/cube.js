import * as THREE from 'three'

class Cube extends THREE.Mesh {
  constructor() {
    super()

    this.geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    this.geometry.translate(0, 0.5, 0)
    this.material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  
    this.castShadow = true
  }

}

export default Cube