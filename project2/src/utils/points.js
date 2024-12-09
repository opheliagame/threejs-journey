import { mapLinear } from "three/src/math/MathUtils.js"

function getRandomValues(n, vmin, vmax, sorted=false) {
  let values = []
  for(let i = 0; i < n; i++) {
    values.push(Math.random() * (vmax-vmin) + vmin)
  }
  
  console.log(values)
  return (sorted ? values.sort() : values)
}

function getRandomPoints(n, xmin, xmax, ymin, ymax, zmin, zmax, xsorted=false, ysorted=false, zsorted=false) {
  let xvalues = getRandomValues(n, xmin, xmax, xsorted) 
  let yvalues = getRandomValues(n, ymin, ymax, ysorted)
  let zvalues = getRandomValues(n, zmin, zmax, zsorted)
  
  let points = []
  for(let i = 0; i < n; i++) {
    let x = xvalues[i]
    let y = yvalues[i]
    let z = zvalues[i]
    points.push({x: x, y: y, z: z})
  }
  return points
}

function getCirclePoints(radius, res) {
  let points = []
  for(let i = 0; i < res; i++) {
    let angle = mapLinear(i, 0, res-1, 0, Math.PI*2)
    let x = Math.cos(angle) * radius
    let y = Math.sin(angle) * radius
    points.push({x: x, y: y, z: 0})
  }
  
  // add first point again  - this looks weird
  // let angle = 0
  // let x = Math.cos(angle) * radius
  // let y = Math.sin(angle) * radius
  // points.push({x: x, y: y, z: 0})
  
  return points
}


export {
  getRandomPoints,
  getCirclePoints,
}
