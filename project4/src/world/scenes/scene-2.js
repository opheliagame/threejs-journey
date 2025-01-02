import * as THREE from "three";
import My3DText from "../mesh/text/my3DText";
import { FontLoader } from "three/examples/jsm/Addons.js";
import FeltMaterial from "../material/feltMaterial";
import { random } from "../../utils/math";
import palette from "../../colors/palette";
import { convertHexToVec3 } from "../../utils/colors";

class Scene2 extends THREE.Group {
  constructor() {
    super();
    this.isLoaded = false;
    this.words = [
      "code",
      "poems",
      "tools",
      "community",
      "performance",
      "archives",
      "software",
    ];
  }

  async load() {
    console.log("Loading scene 2");
    return new Promise((resolve, reject) => {
      const fontLoader = new FontLoader();
      fontLoader.load("fonts/Barriecito_Regular.json", (font) => {
        this.font = font;
        this.isLoaded = true;

        console.log("making words");
        for (let word of this.words) {
          const randomColor = random(palette);
          const material = new FeltMaterial(convertHexToVec3(randomColor), 1);

          const text = new My3DText(word, font, 100, 0, 0, 0, material);
          text.position.x = (Math.random() * 2 - 1) * 500;
          text.position.y = (Math.random() * 2 - 1) * 500;
          text.position.z = (Math.random() * 2 - 1) * 500;

          this.add(text);

          const textEdge = text.getEdgesGeometry();
          this.add(textEdge);
        }

        resolve();
      });
    });
  }

  async run(threeScene, sizes, camera) {
    await this.load();

    return new Promise((resolve, reject) => {
      console.log("Running scene 2");
      threeScene.add(this);
      resolve();
    });
  }
}

export default Scene2;
