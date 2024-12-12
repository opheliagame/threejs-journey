import * as THREE from "three";
import My3DText from "./my3DText";

class My3DTextFormatted extends THREE.Group {
  constructor(font, message, w, h) {
    super();

    this.font = font;
    this.message = message;
    this.boxW = w;
    this.boxH = h;

    let words = this.message.split(" ");
    let xoffset = 0;
    let yoffset = 0;
    let xgap = 20;
    let ygap = 20;
    console.log("Formatting message ", this.message);
    for (let i = 0; i < words.length; i++) {
      let xpos = -w / 2 + xoffset;
      let ypos = yoffset;

      const text = new My3DText(this.font, words[i], xpos, ypos, 1);

      this.add(text);

      text.geometry.computeBoundingBox();
      let xoff =
        text.geometry.boundingBox.max.x -
        text.geometry.boundingBox.min.x +
        xgap;
      let yoff =
        text.geometry.boundingBox.max.y -
        text.geometry.boundingBox.min.y +
        ygap;

      xoffset += xoff;

      if (xoffset > this.boxW) {
        text.position.x = -w / 2;
        xoffset =
          text.geometry.boundingBox.max.x -
          text.geometry.boundingBox.min.x +
          xgap;

        yoffset -= yoff;
        text.position.y = yoffset;
      }
    }
  }
}

export default My3DTextFormatted;
