import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

class CurveSpline3d extends Line2 {
  constructor(points) {
    points = points.map(
      (p) =>
        new THREE.Vector3(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z))
    );

    const curve = new THREE.CatmullRomCurve3(points, false);
    const curvePoints = curve.getPoints(24 * points.length);
    let positions = [];
    for (let i = 0; i < curvePoints.length; i++) {
      let p = curvePoints[i];
      positions.push(p.x, p.y, p.z);
    }

    const geometry = new LineGeometry();
    geometry.setPositions(positions);

    const material = new LineMaterial({
      color: 0xffff00,
      linewidth: 20, // in world units with size attenuation, pixels otherwise
      vertexColors: false,

      //resolution:  // to be set by renderer, eventually
      dashed: false,
      alphaToCoverage: true,
    });
    material.resolution.set(window.innerWidth, window.innerHeight);

    super(geometry, material);
  }

  render() {}
}

export default CurveSpline3d;
