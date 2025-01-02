import * as THREE from "three";
import AssetMaterial from "../material/assetMaterial";

class MyPlane extends THREE.Mesh {
  constructor(assetPath) {
    super();
    this.geometry = new THREE.PlaneGeometry(600, 600);
    this.material = new AssetMaterial(assetPath ?? "./images/rgb-256x256.png");
  }
}

export default MyPlane;
