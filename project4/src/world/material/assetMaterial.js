import * as THREE from "three";
import { MeshBasicMaterial } from "three/webgpu";

class AssetMaterial extends MeshBasicMaterial {
  constructor(assetPath) {
    super();
    this.assetPath = assetPath;
    const texture = new THREE.TextureLoader().load(assetPath);
    texture.colorSpace = THREE.sRGBEncoding;
    this.map = texture;
  }
}

export default AssetMaterial;
