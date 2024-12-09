import *  as THREE from 'three';

function ProfiledContourGeometry(profileShape, contour, contourClosed = true, openEnded = false) {
  // Correct the openEnded setting based on contourClosed
  openEnded = contourClosed ? false : openEnded;

  console.log(contour)

  // Create the profile geometry
  let profileGeometry = new THREE.ShapeGeometry(profileShape);
  let flipProfileGeometry = flipShapeGeometry(profileGeometry);
  profileGeometry.rotateX(Math.PI * 0.5);
  let profile = profileGeometry.attributes.position;

  // Determine the number of additional end profiles needed
  let addEnds = openEnded ? 0 : 2;
  let profilePoints = new Float32Array(profile.count * (contour.length + addEnds) * 3);

  let endProfiles = [];

  for (let i = 0; i < contour.length; i++) {
    let prevIndex = i - 1 < 0 ? contour.length - 1 : i - 1;
    let nextIndex = i + 1 == contour.length ? 0 : i + 1;

    let v1 = new THREE.Vector3().subVectors(contour[prevIndex], contour[i]);
    let v2 = new THREE.Vector3().subVectors(contour[nextIndex], contour[i]);
    
    // let angle = Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);
    // Normalize the vectors
    let v1Normalized = v1.clone().normalize();
    let v2Normalized = v2.clone().normalize();
    
    // Calculate the dot product
    let dotProduct = v1Normalized.dot(v2Normalized);
    
    // Calculate the angle in radians
    let angle = Math.acos(dotProduct);
    let halfAngle = angle * 0.5;

    let hA = halfAngle;
    let tA = Math.atan2(v2.y, v2.x) + Math.PI * 0.5;

    if (!contourClosed) {
      if (i == 0 || i == contour.length - 1) hA = Math.PI * 0.5;
      if (i == contour.length - 1) tA = Math.atan2(v1.y, v1.x) - Math.PI * 0.5;
    }

    let shift = Math.tan(hA - Math.PI * 0.5);
    let shiftMatrix = new THREE.Matrix4().set(
      1, 0, 0, 0,
      -shift, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );

    let tempAngle = tA;
    let rotationMatrix = new THREE.Matrix4().set(
      Math.cos(tempAngle), -Math.sin(tempAngle), 0, 0,
      Math.sin(tempAngle), Math.cos(tempAngle), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );

    let translationMatrix = new THREE.Matrix4().set(
      1, 0, 0, contour[i].x,
      0, 1, 0, contour[i].y,
      0, 0, 1, contour[i].z,
      0, 0, 0, 1
    );

    let cloneProfile = profile.clone();
    cloneProfile.applyMatrix4(shiftMatrix);
    cloneProfile.applyMatrix4(rotationMatrix);
    cloneProfile.applyMatrix4(translationMatrix);

    // console.log("profile")
    // console.log(profile)
    // console.log("clone profile")
    // console.log(cloneProfile)

    profilePoints.set(cloneProfile.array, cloneProfile.count * i * 3);

    if (!openEnded && (i === 0 || i === contour.length - 1)) {
      endProfiles.push(cloneProfile);
    }
  }

  endProfiles.forEach((ep, idx) => {
    profilePoints.set(ep.array, ep.count * (contour.length + idx) * 3);
  });

  console.log("profile points ")
  console.log(profilePoints)

  let fullProfileGeometry = new THREE.BufferGeometry();
  fullProfileGeometry.setAttribute("position", new THREE.BufferAttribute(profilePoints, 3));

  let index = [];
  let lastCorner = contourClosed ? contour.length : contour.length - 1;

  for (let i = 0; i < lastCorner; i++) {
    for (let j = 0; j < profile.count; j++) {
      let currCorner = i;
      let nextCorner = i + 1 == contour.length ? 0 : i + 1;
      let currPoint = j;
      let nextPoint = j + 1 == profile.count ? 0 : j + 1;

      let a = nextPoint + profile.count * currCorner;
      let b = currPoint + profile.count * currCorner;
      let c = currPoint + profile.count * nextCorner;
      let d = nextPoint + profile.count * nextCorner;

      index.push(a, b, d);
      index.push(b, c, d);
    }
  }

  if (!openEnded) {
    // Add indices from profile geometries
    flipProfileGeometry.index.array.forEach(i => index.push(i + profile.count * contour.length));
    profileGeometry.index.array.forEach(i => index.push(i + profile.count * (contour.length + 1)));
  }

  fullProfileGeometry.setIndex(index);
  fullProfileGeometry.computeVertexNormals();

  return fullProfileGeometry;
}

function flipShapeGeometry(shapeGeometry) {
  let flipGeom = shapeGeometry.clone();

  for (let i = 0; i < flipGeom.attributes.position.count; i++) {
    flipGeom.attributes.position.array[i * 3] *= -1;
  }
  flipGeom.attributes.position.needsUpdate = true;

  let index = flipGeom.index.array;
  for (let i = 0; i < index.length; i += 3) {
    let tmp = index[i + 1];
    index[i + 1] = index[i + 2];
    index[i + 2] = tmp;
  }

  flipGeom.computeVertexNormals();
  return flipGeom;
}


class CurveSpline3DMesh extends THREE.Mesh {
  constructor(points) {
    super()
    // this.geometry = new THREE.TubeGeometry( curve, 20, 0.2, 8, false );

    const circleRadius = 0.1;
    const circleShape = new THREE.Shape()
      .moveTo( 0, circleRadius )
      .quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 )
      .quadraticCurveTo( circleRadius, - circleRadius, 0, - circleRadius )
      .quadraticCurveTo( - circleRadius, - circleRadius, - circleRadius, 0 )
      .quadraticCurveTo( - circleRadius, circleRadius, 0, circleRadius );

    // important - without this mesh cannot be made
    points = points.map(p => new THREE.Vector3(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z)))

    console.log("curve points")
    console.log(points)
    const curve = new THREE.CatmullRomCurve3(points, false)
    // console.log(curve.getPoints(64))
    const curvePoints = curve.getPoints(12 * points.length)
    
    this.geometry = ProfiledContourGeometry(circleShape, curvePoints, false, false)

    // this.material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
    this.material = new THREE.MeshNormalMaterial();

  }
}

export default CurveSpline3DMesh