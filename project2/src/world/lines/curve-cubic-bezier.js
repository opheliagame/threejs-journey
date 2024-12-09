import * as THREE from 'three'
import { smoothContinuous } from '../../utils/smooth'
import { GeometryUtils, Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js'

class CurveCubicBezier extends Line2 {
  constructor(points) {

    const smoothContinuousPoints = smoothContinuous(points)

    // console.log(smoothContinuousPoints)

    const curvePath = new THREE.CurvePath()
    let firstStartPoint = smoothContinuousPoints[0][0]
    for(let index = 1; index < smoothContinuousPoints.length; index++) {
      // console.log(`curve ${index}`)

      let isFirst = index - 1 == 0
      let isLast = index == smoothContinuousPoints.length - 1
      let p1Index = index - 1
      let p2Index = index

      let p1 = points[p1Index] // y: smoothContinuousPoints[p1Index][1] }
      let p2 = points[p2Index] //, y: smoothContinuousPoints[p2Index][1] }
      let h1 = smoothContinuousPoints[p1Index][0]
      let h2 = isLast ? smoothContinuousPoints[p2Index][0] : smoothContinuousPoints[p2Index][1]

      // console.log(h1)
      // console.log(h2)

      let cp1 = { x: p1.x + h1.x, y: p1.y + h1.y, z: p1.z + h1.z }
      let cp2 = { x: p2.x + h2.x, y: p2.y + h2.y, z: p2.z + h2.z }

      // console.log("cp1 cp2")
      // console.log(cp1)
      // console.log(cp2)

      // base class THREE.Curve
      // const curve = new THREE.CubicBezierCurve(isFirst ? firstStartPoint : p1, cp1, cp2, p2)
      const curve = new THREE.CubicBezierCurve3(isFirst ? firstStartPoint : p1, cp1, cp2, p2)
      curvePath.add(curve)

      // console.log(curve)
    
    }
   

    console.log(`Curve Path: ${curvePath}`)
    console.log(curvePath)

    const curvePoints = curvePath.getPoints(2 * points.length)
    // const curvePoints = curvePath.getSpacedPoints(20)
    // this.geometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
    // this.material = new THREE.LineBasicMaterial( { color: 0xffff00 } );

    const positions = [];
    const colors = [];
    const divisions = Math.round( 32 * smoothContinuousPoints.length );
    const point = new THREE.Vector3();
    const color = new THREE.Color();

    for ( let i = 0, l = divisions; i < l; i ++ ) {

      const t = i / l;

      curvePath.getPoint( t, point );
      positions.push( point.x, point.y, point.z );

      color.setHSL( t, 1.0, 0.5, THREE.SRGBColorSpace );
      colors.push( color.r, color.g, color.b );

    }

    const geometry = new LineGeometry();
    geometry.setPositions( positions );
    // geometry.setColors( colors );

    const material = new LineMaterial( {

      color: 0xff0000,
      linewidth: 8, // in world units with size attenuation, pixels otherwise
      vertexColors: false,

      //resolution:  // to be set by renderer, eventually
      dashed: false,
      alphaToCoverage: true,

    } );
    material.resolution.set(window.innerWidth, window.innerHeight)

    super(geometry, material)
  }

  render() {

  }

}

export default CurveCubicBezier