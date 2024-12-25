import * as THREE from 'three'

class Floor extends THREE.Mesh {
  constructor() {
    super()
    this.geometry = new THREE.PlaneGeometry(3, 3)
    this.geometry.rotateX(-Math.PI / 2)
    
    this.material = new THREE.MeshLambertMaterial({ color: 0xffffff })
    this.material.color.setHSL( 0.095, 1, 0.75 );

    this.receiveShadow = true
  }

}

export default Floor