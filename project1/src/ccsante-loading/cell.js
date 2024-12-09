import * as THREE from "three";
import { getPalette, getRandomPaletteColor, palette } from "../utils/color";

export class Plane extends THREE.Mesh {
  constructor() {
    super();

    this.geometry = new THREE.PlaneGeometry(0.5/2, 1/2, 10, 10);

    // if(Math.random() < 0.5) {
      let color = new THREE.Color(getRandomPaletteColor());
      this.material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
      });
    // }

   
    // this.material = new THREE.MeshBasicMaterial({ color: 0xf5e996, side: THREE.DoubleSide })

    // this.position.set(x, y, 0);
  }

  render(t) {}
}

export class Flyer extends THREE.Group {
  static leftWing = new Plane();
  static rightWing = new Plane()

  constructor({ startx: startx, starty: starty, destx: destx, desty: desty }) {
    super();

    this.right = new PlaneObject({
      x: 0.25,
      y: 0,
      offx: -0.25,
      offy: 0,
      mesh: Flyer.rightWing.clone(),
    });
    this.left = new PlaneObject({
      x: -0.25,
      y: 0,
      offx: 0.25,
      offy: 0,
      mesh: Flyer.leftWing.clone(),
    });

    // let c = new THREE.SphereGeometry(0.1)
    let c = new THREE.CircleGeometry(0.1)
    let cm = new THREE.Mesh(c, new THREE.MeshBasicMaterial({ color: "#ffff00" }))
    // cm.position.set(0, 0, 1)

    // this.geometry = new THREE.Group()
    // this.add(this.right);
    // this.add(this.left);
    this.add(cm)
    
    this.position.set(startx, starty, 0);

    this.start = new THREE.Vector2(startx, starty);
    this.dest = new THREE.Vector2(destx, desty);

    this.r = Math.random();
  }

  addWing({pos, mesh}) {
    if(pos == "left") {
      this.left = mesh
      this.add(this.left)
    }
    else if(pos == "right") {
      this.right = mesh
      this.add(this.right)
    }
    
  }

  getCurrentPos(t) {
    return this.start.lerp(this.dest, t);
  }

  update(t) {
    this.position.x = this.getCurrentPos(t).x;
    this.position.y = this.getCurrentPos(t).y;
  }

  render(t) {
    this.update(Math.abs(Math.sin(t * 0.01)));

    // this.left.rotation.y = -Math.PI/3
    // this.right.rotation.y = Math.PI/3
    // this.left.rotation.y = Math.PI/3
    if (this.r < 1.5) {
      // this.right.rotation.y = Math.abs(Math.sin(t*0.001)) * Math.PI/3
      // this.right.rotation.x = Math.abs(Math.sin(t*0.001)) * Math.PI/3
      // this.right.rotation.z = Math.abs(Math.sin(t)) * Math.PI/2
    }

    // this.left.rotation.y = Math.abs(Math.sin(t*0.1 + Math.PI/2)) * 10
  }
}

export class PlaneObject extends THREE.Object3D {
  constructor({ x: x, y: y, offx: offx, offy: offy, mesh: mesh }) {
    super();
    // console.log(mesh)
    // console.log(mesh.clone())
    this.add(mesh.clone());

    this.children[0].position.set(offx, offy, 0)

    this.position.set(x, y, 0);
  }

  
}
