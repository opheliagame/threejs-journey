import * as THREE from "three";
import palette from "../../../colors/palette";
import { convertHexToVec3 } from "../../../utils/colors";
import FeltMaterial from "../../material/feltMaterial";

class My2DText extends THREE.Mesh {
  constructor(font, message) {
    super();

    const shapes = font.generateShapes(message, 3);
    this.geometry = new THREE.ShapeGeometry(shapes);

    this.geometry.computeBoundingBox();
    const xMid =
      -0.5 *
      (this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x);
    this.geometry.translate(xMid, 0, 0);

    const randomIndex = Math.floor(Math.random() * palette.length);
    const greenColor = convertHexToVec3(palette[randomIndex]);
    this.material = new FeltMaterial(greenColor, 10);

    this.position.z = 0;
  }
}

export default My2DText;
