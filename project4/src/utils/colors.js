import { vec3 } from "three/tsl";

function convertHexToRgb(hex) {
  const hexValue = hex.replace("#", "0x");
  const r = (hexValue >> 16) & 255;
  const g = (hexValue >> 8) & 255;
  const b = hexValue & 255;
  return [r, g, b];
}

function convertRgbToVec3(rgb) {
  return vec3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
}

function convertHexToVec3(hex) {
  return convertRgbToVec3(convertHexToRgb(hex));
}

function convertArrToVec3(arr) {
  return vec3(arr[0], arr[1], arr[2]);
}

export {
  convertHexToRgb,
  convertRgbToVec3,
  convertHexToVec3,
  convertArrToVec3,
};
