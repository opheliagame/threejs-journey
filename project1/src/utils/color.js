export let palette = ["#ffffff", "#ff0000"]

export async function getPalette() {
  palette = ["#ffffff", "#ff0000"]
  // let palette = await loadColors()
  return palette
}

// Helper function to convert RGB array to 0xff0000 format
function rgbToHex(rgb) {
  const [r, g, b] = rgb;
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function getRandomPaletteColor() {
  if(palette == null) return "#000"

  let color = palette[Math.floor(Math.random()*palette.length)]
  return color
}


// Function to load a color palette from Colormind.io using async/await
export async function loadColors() {
  const url = "http://colormind.io/api/";
  const data = {
      model: "default" // You can use other models like 'ui' or 'nature'
  };

  try {
      const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(data)
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
      console.log(hexColors)

      // document.body.style.backgroundColor = `rgb(${palette[0].join(",")})`;
      palette = hexColors
      return hexColors

  } catch (error) {
      console.error("Error fetching the color palette:", error);
  }
}


