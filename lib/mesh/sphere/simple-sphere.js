import { mapLinear } from "three/src/math/MathUtils.js";
import * as THREE from "three/webgpu";

class SimpleSphereDecomposed extends THREE.Group {
  constructor({ radius = 50, textures = [] }) {
    super();

    this.radius = radius;
    const segmentsX = 20; // Number of horizontal quads (longitude divisions)
    const segmentsY = 6; // Number of vertical quads (latitude divisions, from pole to pole)

    // default material
    const defaultMaterial = new THREE.MeshStandardNodeMaterial({
      color: 0xff0000,
    });

    let textureIndex = 0;
    for (let i = 0; i < segmentsY; i++) {
      const lat1 = mapLinear(i, 0, segmentsY, -Math.PI / 2, Math.PI / 2);
      const lat2 = mapLinear(i + 1, 0, segmentsY, -Math.PI / 2, Math.PI / 2);

      for (let j = 0; j < segmentsX; j++) {
        const lon1 = mapLinear(j, 0, segmentsX, 0, Math.PI * 2);
        const lon2 = mapLinear(j + 1, 0, segmentsX, 0, Math.PI * 2);

        const v0 = this.sphericalToCartesian(lat1, lon1);
        const v1 = this.sphericalToCartesian(lat1, lon2);
        const v2 = this.sphericalToCartesian(lat2, lon1);
        const v3 = this.sphericalToCartesian(lat2, lon2);

        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array([
          v0.x,
          v0.y,
          v0.z, // Vertex 0
          v1.x,
          v1.y,
          v1.z, // Vertex 1
          v2.x,
          v2.y,
          v2.z, // Vertex 2
          v3.x,
          v3.y,
          v3.z, // Vertex 3
        ]);
        const indices = new Uint16Array([
          0,
          2,
          1, // First triangle: v0, v2, v1
          1,
          2,
          3, // Second triangle: v1, v2, v3
        ]);
        const uvs = new Float32Array([
          0,
          1, // v0 maps to (U=0, V=1) - top-left of texture
          1,
          1, // v1 maps to (U=1, V=1) - top-right of texture
          0,
          0, // v2 maps to (U=0, V=0) - bottom-left of texture
          1,
          0, // v3 maps to (U=1, V=0) - bottom-right of texture
        ]);

        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
        geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.computeVertexNormals();

        let material;
        if (textures.length == 0) {
          material = defaultMaterial;
        } else {
          const randomIndex = Math.floor(Math.random() * textures.length);
          const linearIndex = textureIndex % textures.length;
          material = textures[linearIndex];

          textureIndex++;
        }

        const mesh = new THREE.Mesh(geometry, material);

        this.add(mesh);
      }
    }
  }

  sphericalToCartesian(lat, lon) {
    return new THREE.Vector3(
      this.radius * Math.cos(lat) * Math.cos(lon),
      this.radius * Math.sin(lat),
      this.radius * Math.cos(lat) * Math.sin(lon)
    );
  }
}

export default SimpleSphereDecomposed;
