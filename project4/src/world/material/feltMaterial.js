import * as THREE from "three";
import { MeshStandardNodeMaterial } from "three/webgpu";
import {
  Fn,
  vec3,
  sub,
  cos,
  sin,
  exp,
  mx_noise_float as noise,
  step,
  mx_noise_vec3,
  normalWorld,
  time,
  uv,
  reciprocal,
  float,
  Loop,
  mul,
  radians,
  add,
  mix,
  positionLocal,
  texture,
  color,
  thickness,
  div,
} from "three/tsl";

class FeltMaterial extends MeshStandardNodeMaterial {
  constructor(baseColor, scale) {
    super();

    const textureLoader = new THREE.TextureLoader();
    // const perlinTexture = textureLoader.load("./images/rgb-256x256.png");
    // perlinTexture.wrapS = THREE.RepeatWrapping;
    // perlinTexture.wrapT = THREE.RepeatWrapping;

    const feltTexture = textureLoader.load("./images/noise.png");
    feltTexture.wrapS = THREE.RepeatWrapping;
    feltTexture.wrapT = THREE.RepeatWrapping;
    feltTexture.encoding = THREE.sRGBEncoding;

    // const wood = this.makeShader()
    // // const material = new MeshStandardNodeMaterial()
    // // material.colorNode = wood({
    // //   scale: 2.5,
    // //   rings: 4.5,
    // //   length: 1,
    // //   angle: 0,
    // //   fibers: 0.3,
    // //   fibersDensity: 10,
    // //   colors: new THREE.Color(15182336),
    // //   background: new THREE.Color(11163904),
    // //   seed: 0,
    // // })
    // // material.colorNode = wood()
    // const material = new MeshBasicNodeMaterial({ color: new THREE.Color(0xff0000) })

    // // Add a noise-based texture to simulate the fuzzy texture of felt
    // const noiseTexture = mul(noise(uv()), 0.0001); // Slight variation for texture
    // // Base felt color
    // const baseColor = vec3(0.8, 0.2, 0.2); // Red felt
    // // Mixed color to simulate depth and softness
    // const mixedColor = mix(baseColor, vec3(0.5, 0.1, 0.1), noiseTexture); // Add some dark variation

    // UV coordinates
    const uvNode = uv();

    // Layered Noise for More Texture
    let baseNoise = noise(uvNode); // Base noise
    let accumulatedNoise = baseNoise;

    for (let i = scale; i > 0.0; i -= 1.0) {
      const scaledNoise = noise(mul(uvNode, vec3(scale / i))); // Scaled for finer details
      accumulatedNoise = add(accumulatedNoise, scaledNoise); // Combine base and finer noise
    }

    // Strengthen Noise Effect
    const amplifiedNoise = mul(accumulatedNoise, 0.8); // Adjust intensity
    // Apply Noise to Color
    const noisyColor = mix(baseColor, vec3(0.5, 0.1, 0.1), amplifiedNoise);

    let t = texture(feltTexture, div(uvNode, 1));

    // this.colorNode = mix(t, noisyColor, 0.5);
    this.colorNode = noisyColor;
    // Adjust roughness and metalness for a soft, non-reflective surface
    this.roughnessNode = 1.0; // Fully rough
    this.metalnessNode = 0.0; // No metallic properties
  }
}

export default FeltMaterial;
