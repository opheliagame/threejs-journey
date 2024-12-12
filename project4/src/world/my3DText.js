import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import palette from "../colors/palette";
import { convertHexToVec3 } from "../utils/colors";
import FeltMaterial from "./feltMaterial";

class My3DText extends THREE.Mesh {
  constructor(font, message, x, y, z) {
    super();

    // NOTE small b in message causes error
    this.geometry = new TextGeometry(message.replaceAll("b", "B"), {
      font: font,
      size: 100,
      depth: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    this.geometry.computeBoundingBox();
    // const xMid =
    //   -0.5 *
    //   (this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x);
    // this.geometry.translate(xMid, 0, 0);
    this.geometry.computeVertexNormals();

    const randomIndex = Math.floor(Math.random() * palette.length);
    const greenColor = convertHexToVec3(palette[randomIndex]);
    this.material = new FeltMaterial(greenColor, 1);

    this.position.x = x ?? 0;
    this.position.y = y ?? 0;
    this.position.z = z ?? 0;
  }
}

export default My3DText;
