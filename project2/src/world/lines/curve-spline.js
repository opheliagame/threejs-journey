import * as THREE from 'three'
import { Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js'

class CurveSpline extends Line2 {

  constructor(points) {
    // super()
    // this.geometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
    // this.material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    
    const curve = new THREE.SplineCurve(points)
    const curvePoints = curve.getPoints(12 * points.length)
    let positions = []
    for(let i = 0; i < curvePoints.length; i++) {
      let p = curvePoints[i]
      positions.push(p.x, p.y, 0)
    }

    const geometry = new LineGeometry()
    geometry.setPositions(positions)

    const material = new LineMaterial({
      color: 0xffff00,
      linewidth: 8, // in world units with size attenuation, pixels otherwise
      vertexColors: false,

      //resolution:  // to be set by renderer, eventually
      dashed: false,
      alphaToCoverage: true,
    })
    material.resolution.set(window.innerWidth, window.innerHeight)

    super(geometry, material)

  }

  render() {

  }
}

export default CurveSpline