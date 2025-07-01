class MyTextFormatter {
  constructor(text, w, h) {
    this.text = text;
    this.width = w;
    this.height = h;
  }

  formatText(font, maxFontSize) {
    let low = 1;
    let high = maxFontSize;
    let bestFit = { lines: [], fontSize: 0, screenCoords: [] };

    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      let { lines, totalHeight, screenCoords } = this.getLinesForFontSize(
        font,
        mid
      );

      if (totalHeight <= this.height) {
        bestFit = { lines, fontSize: mid, screenCoords };
        low = mid + 1;
      } else {
        high = mid - 1;
      }
      // console.log("Total height for font: ", mid, totalHeight, this.height);
    }

    return bestFit;
  }

  getLinesForFontSize(font, fontSize) {
    let lines = [];
    let screenCoords = [];
    let words = this.text.split(" ");
    let currentLine = "";
    let yOffset =
      fontSize + this.getLineHeightAdjustment(currentLine, font, fontSize);

    for (let word of words) {
      let testLine = currentLine + word + " ";
      // console.log("Processing line: ", testLine);

      let metrics = this.measureText(testLine, font, fontSize);
      // console.log("Metrics: ", metrics.width, this.width);
      if (metrics.width > this.width && currentLine !== "") {
        lines.push(currentLine.trim());
        screenCoords.push({ x: 0, y: yOffset });
        currentLine = word + " ";
        yOffset +=
          fontSize + this.getLineHeightAdjustment(testLine, font, fontSize);

        // console.log("Current line: ", currentLine);
        // console.log("Y offset: ", yOffset);
      } else {
        currentLine = testLine;
        // currentLine += word;
      }
    }
    lines.push(currentLine.trim());
    screenCoords.push({ x: 0, y: yOffset });

    let totalHeight =
      lines.length *
      (fontSize + this.getLineHeightAdjustment(currentLine, font, fontSize));

    return { lines, totalHeight, screenCoords };
  }

  measureText(text, font, fontSize) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = `${fontSize}px ${"Barriecito"}`;
    const metrics = context.measureText(text);
    return metrics;
  }

  getLineHeightAdjustment(text, font, fontSize) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = `${fontSize}px ${"Barriecito"}`;
    const metrics = context.measureText(text);
    const textAscent = metrics.actualBoundingBoxAscent || fontSize * 0.8;
    const textDescent = metrics.actualBoundingBoxDescent || fontSize * 0.2;
    return textAscent + textDescent - fontSize;
  }
}

export default MyTextFormatter;
