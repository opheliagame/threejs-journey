import * as THREE from 'three'

class CurveSplineMesh extends THREE.Mesh {
  constructor(points) {
    super()
    
    // important - without this mesh cannot be made
    points = points.map(p => new THREE.Vector3(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z)))

    console.log("curve points")
    console.log(points)
    const curve = new THREE.CatmullRomCurve3(points, false)
    console.log(curve)
    const curvePoints = curve.getPoints(12 * points.length)
    
    this.geometry = new THREE.TubeGeometry(curve, 128, 0.1, 8, false)

    // this.material = new THREE.MeshStandardMaterial( { color: 0x00ff00, wireframe: true } );
    this.material = new THREE.MeshNormalMaterial();

  }

}

export default CurveSplineMesh