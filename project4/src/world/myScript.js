import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/Addons";
import My2DText from "./my2DText";
import My3DText from "./my3DText";
import My3DTextFormatted from "./my3DTextFormatted";

class MyScript {
  constructor(filePath) {
    this.lines = [];
    this.currentIndex = 0;

    const fontLoader = new FontLoader();
    fontLoader.load("fonts/Barriecito_Regular.json", (font) => {
      this.font = font;
    });

    const loader = new THREE.FileLoader();
    loader.load(
      filePath,
      function (text) {
        this.lines = text
          .split("\n")
          .map((line) => line.trim())
          .map((line) => (line.length > 0 ? line : ""));
        console.log("loaded script: ", this.lines);

        console.log("script has ", this.lines.length, " lines");
      }.bind(this)
    );

    this.running = false;
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

  run(threeScene, sizes) {
    if (this.currentIndex >= this.lines.length) return;

    console.log("Running script");
    this.running = true;
    console.log("Current line: ", this.getCurrentLine());

    const currentLine = this.getCurrentLine();
    this.animate(currentLine, threeScene, sizes).then(() => {
      this.nextLine();
      this.run(threeScene, sizes);
    });
  }

  async animate(line, threeScene, sizes) {
    return new Promise((resolve, reject) => {
      console.log("Animating line: ", line);

      // const text = new My2DText(this.font, line);
      // threeScene.add(text);

      let meshIds = [];
      console.log("Adding text to scene ", line);
      const text = new My3DTextFormatted(
        this.font,
        line,
        sizes.width,
        sizes.height
      );
      const textId = text.id;
      threeScene.add(text);
      meshIds.push(textId);

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
      }, 1000 * (this.currentIndex == this.lines.length - 1 ? 10 : 3));
    });
  }
}

export default MyScript;
