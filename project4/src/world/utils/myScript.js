import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/Addons";
import My2DText from "../mesh/text/my2DText";
import My3DText from "../mesh/text/my3DText";
import My3DTextFormatted from "../mesh/text/my3DTextFormatted";
import MyTextFormatter from "./myTextFormatter";
import { random } from "../../utils/math";
import palette from "../../colors/palette";
import FeltMaterial from "../material/feltMaterial";
import { convertHexToVec3 } from "../../utils/colors";

class MyScript {
  constructor(filePath) {
    this.lines = [];
    this.currentIndex = 0;
    this.filePath = filePath;
    this.running = false;
    this.isLoaded = false;
  }

  load() {
    return new Promise((resolve, reject) => {
      const fontLoader = new FontLoader();
      fontLoader.load("fonts/Barriecito_Regular.json", (font) => {
        this.font = font;

        const loader = new THREE.FileLoader();
        loader.load(
          this.filePath,
          function (text) {
            this.lines = text
              .split("\n")
              .map((line) => line.trim())
              .map((line) => (line.length > 0 ? line : ""))
              .map((line) =>
                line.split(":").length > 1
                  ? {
                      content: line.split(":")[1],
                      duration: line.split(":")[0],
                    }
                  : { content: line, duration: 1 }
              );
            console.log("loaded script: ", this.lines);

            console.log("script has ", this.lines.length, " lines");
            this.isLoaded = true;

            resolve();
          }.bind(this)
        );
      });
    });
  }

  getLines() {
    return this.lines;
  }

  getCurrentLine() {
    return this.lines[this.currentIndex];
  }

  nextLine() {
    this.currentIndex += 1;
  }

  run(threeScene, sizes, camera) {
    return new Promise(async (resolve, reject) => {
      if (this.isLoaded == false) {
        await this.load();
      }
      this.run1(threeScene, sizes, camera).then(() => {
        resolve();
      });
    });
  }

  run1(threeScene, sizes, camera) {
    return new Promise((resolve, reject) => {
      if (this.currentIndex >= this.lines.length) {
        resolve();
        return;
      }

      console.log("Running script");
      this.running = true;
      console.log("Current line: ", this.getCurrentLine());

      const currentLine = this.getCurrentLine();
      // threeScene.background = new THREE.Color(random(palette));

      this.animate(currentLine, threeScene, sizes, camera).then(() => {
        threeScene.background = new THREE.Color(random(palette));
        this.nextLine();

        this.run(threeScene, sizes, camera).then(() => {
          resolve();
        });
      });
    });
  }

  async animate(line, threeScene, sizes, camera) {
    return new Promise((resolve, reject) => {
      console.log("Animating line: ", line);

      let meshIds = [];
      console.log("Adding text to scene ", line);

      const formatter = new MyTextFormatter(
        line.content,
        (sizes.width * 1) / 2,
        (sizes.height * 1) / 2
      );
      const { lines, fontSize, screenCoords } = formatter.formatText(
        this.font,
        300
      );
      console.log("Formatted lines: font size", fontSize);
      console.log("Formatted lines: ", lines);
      console.log("Formatted lines: ", screenCoords);

      let paletteWithoutBackground = palette.filter(
        (color) =>
          color.replaceAll("#", "") !== threeScene.background.getHexString()
      );
      let randomColor = random(paletteWithoutBackground);

      let material = new FeltMaterial(convertHexToVec3(randomColor), 100);

      lines.forEach((formattedLine, index) => {
        console.log("Adding line ", index, formattedLine);

        // Convert screen coordinates to NDC
        const coords = screenCoords[index];

        let text = new My3DTextFormatted(
          formattedLine,
          this.font,
          fontSize,
          coords.x,
          coords.y,
          0,
          camera,
          material
        );
        const textId = text.id;
        threeScene.add(text);
        meshIds.push(textId);

        const textEdge = text.mesh.getEdgesGeometry();

        threeScene.add(textEdge);
        meshIds.push(textEdge.id);
      });

      const sceneDuration = line.duration;
      // pan the camera to a random point
      const panTo = new THREE.Vector3(
        (Math.random() * 2 - 1) * 100,
        (Math.random() * 2 - 1) * 100,
        Math.random() * 2
      );
      camera.pan(panTo, sceneDuration);

      setTimeout(() => {
        for (let i = 0; i < meshIds.length; i++) {
          const object = threeScene.getObjectById(meshIds[i]);
          threeScene.remove(object);
          object.children.forEach((child) => {
            threeScene.remove(child);
            child.geometry.dispose();
            child.material.dispose();
          });
        }

        resolve();
      }, 1000 * sceneDuration);
    });
  }
}

export default MyScript;
