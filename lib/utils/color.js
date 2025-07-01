import { vec3 } from "three/tsl";

export let palette = ["#ffffff", "#ff0000"];

export let websiteLandingMoviePalette = [
  "#FF66B2", // Brighter Bubblegum Pink
  "#FF99FF", // Brighter Electric Fuchsia
  "#66FFD9", // Brighter Mint Ice
  "#FFB366", // Brighter Tangerine Dream
  "#FF6699", // Brighter Raspberry Pop
  "#99FFFF", // Brighter Aqua Blast
  "#FFD633", // Brighter Sunshine Yellow
  "#B399FF", // Brighter Grape Soda
];

export async function getPalette() {
  palette = ["#ffffff", "#ff0000"];
  // let palette = await loadColors()
  return palette;
}

// Helper function to convert RGB array to 0xff0000 format
function rgbToHex(rgb) {
  const [r, g, b] = rgb;
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function getRandomPaletteColor() {
  if (palette == null) return "#000";

  let color = palette[Math.floor(Math.random() * palette.length)];
  return color;
}

// Function to load a color palette from Colormind.io using async/await
export async function loadColors() {
  const url = "http://colormind.io/api/";
  const data = {
    model: "default", // You can use other models like 'ui' or 'nature'
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("Color palette:", result.result);

    // Use the colors (setting background color as an example)
    // const palette = result.result;
    // Convert RGB to 0xff0000 format
    const hexColors = result.result.map(rgbToHex);
    console.log(hexColors);

    // document.body.style.backgroundColor = `rgb(${palette[0].join(",")})`;
    palette = hexColors;
    return hexColors;
  } catch (error) {
    console.error("Error fetching the color palette:", error);
  }
}

export function convertHexToRgb(hex) {
  const hexValue = hex.replace("#", "0x");
  const r = (hexValue >> 16) & 255;
  const g = (hexValue >> 8) & 255;
  const b = hexValue & 255;
  return [r, g, b];
}

export function convertRgbToVec3(rgb) {
  return vec3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
}

export function convertHexToVec3(hex) {
  return convertRgbToVec3(convertHexToRgb(hex));
}

export function convertArrToVec3(arr) {
  return vec3(arr[0], arr[1], arr[2]);
}
