import * as THREE from 'three'

class Tunnel extends THREE.Mesh {
  constructor() {
    super()
    // create points
    const points = [];
    for (let i = 0; i < 100; i++) {
      // Math.cos(i * 0.1) * 10
        points.push(new THREE.Vector3(Math.sin(i * 0.1) * 10, Math.cos(i * 0.1) * 10, i * 5));
        // points.push(new THREE.Vector3(0, 0, i * 5));
    }
    this.points = points
    const path = new THREE.CatmullRomCurve3(points);
    this.path = path
    this.geometry = new THREE.TubeGeometry(path, 100, 10, 64, false);
    this.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide, wireframe: false });

  }

}

export default Tunnel