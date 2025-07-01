import * as THREE from "three";

class MyCamera extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.lookAtPos = new THREE.Vector3(0, 0, 0);
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z);
  }

  lerp(startPos, endPos, t) {
    // console.log(
    //   "Lerping from ",
    //   startPos,
    //   " to ",
    //   endPos,
    //   " in ",
    //   t,
    //   " seconds"
    // );

    const lookAtPos = startPos.lerp(endPos, t);
    this.lookAt(lookAtPos.x, lookAtPos.y, lookAtPos.z);
  }

  pan(to, t) {
    let interval = 0;
    let count = 0;
    let startPos = this.lookAtPos.clone();
    let intervalId = setInterval(() => {
      // console.log("Panning to ", to, " in ", interval, " seconds");

      this.lerp(startPos, to, interval);
      interval += 1 / (60 * t);
      count++;

      if (interval >= 1) {
        clearInterval(intervalId);
        // console.log("Finished panning in ", count, " frames");

        this.lookAtPos = to;
      }
    }, (1000 * t) / 60);
  }
}

export default MyCamera;
