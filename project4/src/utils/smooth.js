function smoothContinuous(points, options) {
  const opts = options || {};
  const segments = points;
  const length = points.length;

  // path will not be closed
  const closed = false;
  const lp = false;
  const from = 0;
  const to = length - 1;

  let amount = to - from + 1;
  let n = amount - 1;
  let padding = 1;
  let paddingLeft = padding;
  let paddingRight = padding;
  let knots = [];

  paddingLeft = Math.min(1, from);
  paddingRight = Math.min(1, length - to - 1);

  let controlPoints = [];

  n += paddingLeft + paddingRight;
  for (let i = 0, j = from - paddingLeft; i <= n; i++, j++) {
    knots[i] = segments[(j < 0 ? j + length : j) % length];
  }

  let x = knots[0].x + 2 * knots[1].x,
    y = knots[0].y + 2 * knots[1].y,
    z = knots[0].z + 2 * knots[1].z,
    f = 2,
    n_1 = n - 1,
    rx = [x],
    ry = [y],
    rz = [z],
    rf = [f],
    px = [],
    py = [],
    pz = [];

  // Solve with the Thomas algorithm
  for (let i = 1; i < n; i++) {
    var internal = i < n_1,
      //  internal--(I)  asymmetric--(R) (R)--continuous
      a = internal ? 1 : 2,
      b = internal ? 4 : 7,
      u = internal ? 4 : 8,
      v = internal ? 2 : 1,
      m = a / f;

    f = rf[i] = b - m;
    x = rx[i] = u * knots[i].x + v * knots[i + 1].x - m * x;
    y = ry[i] = u * knots[i].y + v * knots[i + 1].y - m * y;
    z = rz[i] = u * knots[i].z + v * knots[i + 1].z - m * z;
  }

  px[n_1] = rx[n_1] / rf[n_1];
  py[n_1] = ry[n_1] / rf[n_1];
  pz[n_1] = rz[n_1] / rf[n_1];
  for (let i = n - 2; i >= 0; i--) {
    px[i] = (rx[i] - px[i + 1]) / rf[i];
    py[i] = (ry[i] - py[i + 1]) / rf[i];
    pz[i] = (rz[i] - pz[i + 1]) / rf[i];
  }
  px[n] = (3 * knots[n].x - px[n_1]) / 2;
  py[n] = (3 * knots[n].y - py[n_1]) / 2;
  pz[n] = (3 * knots[n].z - pz[n_1]) / 2;

  // Now update the segments
  for (
    let i = paddingLeft, mx = n - paddingRight, j = from;
    i <= mx;
    i++, j++
  ) {
    let controlPoint = [];
    var segment = segments[j < 0 ? j + length : j],
      pt = segment,
      hx = px[i] - pt.x,
      hy = py[i] - pt.y,
      hz = pz[i] - pt.z;

    if (lp || i < mx) controlPoint.push({ x: hx, y: hy, z: hz });
    if (lp || i > paddingLeft) controlPoint.push({ x: -hx, y: -hy, z: -hz });

    controlPoints.push(controlPoint);
  }

  return controlPoints;
}


// function smoothContinuous(points, options) {
//   const opts = options || {};
//   const segments = points;
//   const length = points.length;

//   // path will not be closed
//   const closed = false;
//   const lp = false;
//   const from = 0;
//   const to = length - 1;

//   let amount = to - from + 1;
//   let n = amount - 1;
//   let padding = 1;
//   let paddingLeft = padding;
//   let paddingRight = padding;
//   let knots = [];

//   paddingLeft = Math.min(1, from);
//   paddingRight = Math.min(1, length - to - 1);

//   let controlPoints = [];

//   n += paddingLeft + paddingRight;
//   for (let i = 0, j = from - paddingLeft; i <= n; i++, j++) {
//     knots[i] = segments[(j < 0 ? j + length : j) % length];
//   }

//   let x = knots[0].x + 2 * knots[1].x,
//     y = knots[0].y + 2 * knots[1].y,
//     f = 2,
//     n_1 = n - 1,
//     rx = [x],
//     ry = [y],
//     rf = [f],
//     px = [],
//     py = [];

//   // Solve with the Thomas algorithm
//   for (let i = 1; i < n; i++) {
//     var internal = i < n_1,
//       //  internal--(I)  asymmetric--(R) (R)--continuous
//       a = internal ? 1 : 2,
//       b = internal ? 4 : 7,
//       u = internal ? 4 : 8,
//       v = internal ? 2 : 1,
//       m = a / f;

//     f = rf[i] = b - m;
//     x = rx[i] = u * knots[i].x + v * knots[i + 1].x - m * x;
//     y = ry[i] = u * knots[i].y + v * knots[i + 1].y - m * y;
//   }

//   px[n_1] = rx[n_1] / rf[n_1];
//   py[n_1] = ry[n_1] / rf[n_1];
//   for (let i = n - 2; i >= 0; i--) {
//     px[i] = (rx[i] - px[i + 1]) / rf[i];
//     py[i] = (ry[i] - py[i + 1]) / rf[i];
//   }
//   px[n] = (3 * knots[n].x - px[n_1]) / 2;
//   py[n] = (3 * knots[n].y - py[n_1]) / 2;

//   // Now update the segments
//   for (
//     let i = paddingLeft, mx = n - paddingRight, j = from;
//     i <= mx;
//     i++, j++
//   ) {
//     let controlPoint = [];
//     var segment = segments[j < 0 ? j + length : j],
//       pt = segment,
//       hx = px[i] - pt.x,
//       hy = py[i] - pt.y;

//     if (lp || i < mx) controlPoint.push({ x: hx, y: hy });
//     if (lp || i > paddingLeft) controlPoint.push({ x: -hx, y: -hy });

//     controlPoints.push(controlPoint);
//   }

//   return controlPoints;
// }

// function smoothContinuous(points, options) {
//   const opts = options || {};
//   const segments = points;
//   const length = points.length;

//   // path will not be closed
//   const closed = false;
//   const lp = false;
//   const from = 0;
//   const to = length - 1;

//   let amount = to - from + 1;
//   let n = amount - 1;
//   let padding = 1;
//   let paddingLeft = padding;
//   let paddingRight = padding;
//   let knots = [];

//   paddingLeft = Math.min(1, from);
//   paddingRight = Math.min(1, length - to - 1);

//   let controlPoints = [];

//   n += paddingLeft + paddingRight;
//   for (let i = 0, j = from - paddingLeft; i <= n; i++, j++) {
//     knots[i] = segments[(j < 0 ? j + length : j) % length];
//   }

//   let x = knots[0][0] + 2 * knots[1][0],
//     y = knots[0][1] + 2 * knots[1][1],
//     f = 2,
//     n_1 = n - 1,
//     rx = [x],
//     ry = [y],
//     rf = [f],
//     px = [],
//     py = [];

//   // Solve with the Thomas algorithm
//   for (let i = 1; i < n; i++) {
//     var internal = i < n_1,
//       //  internal--(I)  asymmetric--(R) (R)--continuous
//       a = internal ? 1 : 2,
//       b = internal ? 4 : 7,
//       u = internal ? 4 : 8,
//       v = internal ? 2 : 1,
//       m = a / f;

//     f = rf[i] = b - m;
//     x = rx[i] = u * knots[i][0] + v * knots[i + 1][0] - m * x;
//     y = ry[i] = u * knots[i][1] + v * knots[i + 1][1] - m * y;
//   }

//   px[n_1] = rx[n_1] / rf[n_1];
//   py[n_1] = ry[n_1] / rf[n_1];
//   for (let i = n - 2; i >= 0; i--) {
//     px[i] = (rx[i] - px[i + 1]) / rf[i];
//     py[i] = (ry[i] - py[i + 1]) / rf[i];
//   }
//   px[n] = (3 * knots[n][0] - px[n_1]) / 2;
//   py[n] = (3 * knots[n][1] - py[n_1]) / 2;

//   // Now update the segments
//   for (
//     let i = paddingLeft, mx = n - paddingRight, j = from;
//     i <= mx;
//     i++, j++
//   ) {
//     let controlPoint = [];
//     var segment = segments[j < 0 ? j + length : j],
//       pt = segment,
//       hx = px[i] - pt[0],
//       hy = py[i] - pt[1];

//     if (lp || i < mx) controlPoint.push([hx, hy]);
//     if (lp || i > paddingLeft) controlPoint.push([-hx, -hy]);

//     controlPoints.push(controlPoint);
//   }

//   return controlPoints;
// }

export {
  smoothContinuous,
}