import * as THREE from "three";
import {
  TextGeometry,
  LineSegments2,
  LineMaterial,
} from "three/examples/jsm/Addons.js";
import palette from "../../../colors/palette";
import { convertHexToVec3 } from "../../../utils/colors";
import FeltMaterial from "../../material/feltMaterial";

class My3DText extends THREE.Mesh {
  constructor(message, font, size, x, y, z, material) {
    super();

    this.text = message;
    this.font = font;
    this.size = size;

    // NOTE small b in message causes error
    this.geometry = new TextGeometry(message.replaceAll("b", "B"), {
      font: font,
      size: size,
      depth: 10,
      curveSegments: 50,
      bevelEnabled: false,
      // bevelThickness: 0.1,
      // bevelSize: 0.01,
      // bevelOffset: 0,
      // bevelSegments: 5,
    });

    this.geometry.computeBoundingBox();
    const xMid =
      -0.5 *
      (this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x);
    this.geometry.translate(xMid, 0, 0);
    this.geometry.computeVertexNormals();

    const randomIndex = Math.floor(Math.random() * palette.length);
    const randomColor = palette[randomIndex];
    console.log(randomColor);
    this.material =
      material ??
      new THREE.MeshStandardMaterial({
        color: `${randomColor}`,
      });

    this.position.x = x ?? 0;
    this.position.y = y ?? 0;
    this.position.z = z ?? 0;
  }

  getEdgesGeometry(color) {
    const edges = new THREE.EdgesGeometry(this.geometry);
    // const line = new LineSegments2(
    //   // this.geometry,
    //   edges,
    //   new LineMaterial({ color: color ?? 0xffffff, linewidth: 10 })
    // );

    const line = new THREE.LineSegments(
      // this.geometry,
      edges,
      new THREE.LineBasicMaterial({ color: color ?? 0xffffff, linewidth: 10 })
    );

    line.position.x = this.position.x;
    line.position.y = this.position.y;
    line.position.z = this.position.z;

    return line;
  }
}

export default My3DText;
