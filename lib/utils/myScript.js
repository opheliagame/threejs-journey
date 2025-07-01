import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import My3DTextFormatted from "./lib/mesh/text/my3DTextFormatted.js";
import MyTextFormatter from "./myTextFormatter.js";
import { random } from "./lib/utils/math.js";
import { websiteLandingMoviePalette as palette } from "./lib/utils/color.js";
import FeltMaterial from "./lib/material/feltMaterial.js";
import { convertHexToVec3 } from "./lib/utils/color.js";

class MyScript {
  constructor(filePath) {
    this.lines = [];
    this.currentIndex = 0;
    this.filePath = filePath;
    this.running = false;
    this.isLoaded = false;
  }

  loadJson() {
    return new Promise((resolve, reject) => {
      const fontLoader = new FontLoader();
      fontLoader.load("/assets/fonts/Barriecito_Regular.json", (font) => {
        this.font = font;

        const loader = new THREE.FileLoader();
        loader.load(
          this.filePath,
          function (text) {
            this.lines = JSON.parse(text);

            console.log("loaded script: ", this.lines);

            console.log("script has ", this.lines.length, " lines");
            this.isLoaded = true;

            resolve();
          }.bind(this)
        );
      });
    });
  }

  loadText() {
    return new Promise((resolve, reject) => {
      const fontLoader = new FontLoader();
      fontLoader.load("/assets/fonts/Barriecito_Regular.json", (font) => {
        this.font = font;

        const loader = new THREE.FileLoader();
        loader.load(
          this.filePath,
          function (text) {
            this.lines = text
              .split("\n")
              .map((line) => line.trim())
              .map((line) => (line.length > 0 ? line : ""))
              .map((line) => parseLine(line));
            console.log("loaded script: ", this.lines);

            console.log("script has ", this.lines.length, " lines");
            this.isLoaded = true;

            resolve();
          }.bind(this)
        );
      });
    });
  }

  parseLine(line) {
    let parts = line.split(":");
    if (parts.length <= 1) {
      return { content: line, duration: 1 };
    } else {
      let part1 = parts[0];
      let part2 = parts[1];
      let part3 = parts.length > 2 ? parts[2] : null;
    }
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
        await this.loadJson();
      }
      this.runScript(threeScene, sizes, camera).then(() => {
        resolve();
      });
    });
  }

  runScript(threeScene, sizes, camera) {
    return new Promise((resolve, reject) => {
      if (this.currentIndex >= this.lines.length) {
        resolve();
      }

      console.log("Running script");
      this.running = true;
      console.log("Current line: ", this.getCurrentLine());

      const currentLine = this.getCurrentLine();

      this.animate(currentLine, threeScene, sizes, camera).then(() => {
        document.body.style.backgroundColor = random(palette);
        this.nextLine();

        this.runScript(threeScene, sizes, camera).then(() => {
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

      let randomColor = random(palette);

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

      const sceneDuration = line.duration ?? 1;
      // pan the camera to a random point
      let endx = (Math.random() * 2 - 1) * 100 + 40;
      let endy = 0;
      let endz = Math.random() * 2;
      const panTo = new THREE.Vector3(endx, endy, endz);
      // camera.pan(panTo, sceneDuration);

      this.drawMedia(line.media ?? []);

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

  async drawMedia(media) {
    const parentContainer = document.querySelector(".media-container");
    parentContainer.innerHTML = "";

    media
      .sort((a, b) => Math.random())
      .forEach((fileName) => {
        console.log(fileName);

        if (
          fileName.endsWith("jpg") ||
          fileName.endsWith("jpeg") ||
          fileName.endsWith("png")
        ) {
          let image = document.createElement("img");
          image.src = `/assets/images/${fileName}`;
          parentContainer.appendChild(image);
        }

        if (fileName.endsWith("mp4")) {
          let video = document.createElement("video");
          // TODO change folder name to more general "media"
          video.src = `/assets/images/${fileName}`;
          video.autoplay = true;
          video.volume = 0;
          video.loop = true;
          parentContainer.appendChild(video);
        }
      });
  }
}

export default MyScript;
