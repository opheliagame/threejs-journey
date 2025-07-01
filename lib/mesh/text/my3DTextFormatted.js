import * as THREE from "three";
import My3DText from "./my3DText.js";

class My3DTextFormatted extends THREE.Group {
  constructor(message, font, fontSize, x, y, z, camera, material) {
    super();
    console.log("Formatting message ", message, " with font size ", fontSize);

    const ndcCoords = this.convertWorldToNDCCoords(x, y, z, camera);
    const screenCoords = this.convertNDCToScreenCoords(
      ndcCoords.x,
      ndcCoords.y,
      ndcCoords.z,
      camera
    );
    const text = new My3DText(
      message,
      font,
      fontSize,
      screenCoords.x,
      screenCoords.y,
      screenCoords.z,
      material
    );
    console.log(text);
    this.add(text);

    this.mesh = text;
  }

  convertNDCToScreenCoords(ndcX, ndcY, ndcZ, camera) {
    const vector = new THREE.Vector3(ndcX, ndcY, ndcZ);
    vector.unproject(camera);

    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));

    return pos;
  }

  convertWorldToNDCCoords(worldX, worldY, worldZ, camera) {
    const vector = new THREE.Vector3(worldX, worldY, worldZ);
    vector.project(camera);
    vector.y = 1 - vector.y;
    vector.y = vector.y * 2 - 1;

    return vector;
  }
}

export default My3DTextFormatted;
