import * as THREE from 'three'

class CurveQuadraticBezier extends THREE.Line {

  constructor(points) {

    // TODO find algorithm
    // const curvePath = 

    // const curvePoints = curvePath.getPoints(40)
    const curvePoints = points
    this.geometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
    this.material = new THREE.LineBasicMaterial( { color: 0xff00ff } );

  }

}