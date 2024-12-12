import * as THREE from "three";
import fragmentShader from "../glsl/main.frag";
import vertexShader from "../glsl/main.vert";
import {
  FontLoader,
  OrbitControls,
  TextGeometry,
} from "three/examples/jsm/Addons.js";
import {
  FileLoader,
  MeshBasicNodeMaterial,
  MeshPhysicalNodeMaterial,
  MeshStandardNodeMaterial,
} from "three/webgpu";
import { Text } from "troika-three-text";

import { Color } from "three";
import { WebGPURenderer } from "three/webgpu";
import { convertHexToVec3 } from "../utils/colors";
import palette from "../colors/palette";
import My3DText from "./my3DText";
import My2DText from "./my2DText";
import MyScript from "./myScript";
import FeltMaterial from "./feltMaterial";

class World {
  constructor(container) {
    this.clock = new THREE.Clock();
    // Scene
    this.scene = new THREE.Scene();

    // sizes
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    // this.camera.position.set(0, 0, 10);
    // this.scene.add(this.camera);
    this.camera = new THREE.OrthographicCamera(
      this.sizes.width / -2,
      this.sizes.width / 2,
      this.sizes.height / 2,
      this.sizes.height / -2,
      0.1,
      10
    );
    this.camera.position.set(0, 0, 2);
    this.scene.add(this.camera);

    this.uniforms = {
      time: { value: 1.0 },
    };

    this.scene.background = new THREE.Color("black");

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Strong directional light
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // this.addBackground();

    this.script = new MyScript("script.txt");

    this.renderer = new WebGPURenderer({
      canvas: container,
      antialias: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.shadowMap.enabled = true;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // this.raycaster = new Raycaster(this.scene, this.camera)
  }

  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });

    if (this.script.lines.length > 0 && this.script.running == false) {
      console.log("Running script");
      this.script.run(this.scene, this.sizes);
    }

    const t = this.clock.getElapsedTime() * 2;
    this.uniforms.time.value = t;
    this.controls.update();

    this.scene.traverse((obj) => {
      if (obj.render) obj.render(t);
    });

    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  addBackground() {
    const randomIndex = Math.floor(Math.random() * palette.length);
    const greenColor = convertHexToVec3(palette[randomIndex]);
    const geometry1 = new THREE.PlaneGeometry(40, 40);
    const plane = new THREE.Mesh(geometry1, new FeltMaterial(greenColor, 50));
    plane.position.z = -1;
    this.scene.add(plane);
  }

  addObjectsWithTroika() {
    // Create:
    const myText = new Text();
    this.scene.add(myText);

    // Set properties to configure:
    myText.text = "Anushka Trivedi";
    myText.fontSize = 0.4;
    myText.position.y = 0;
    myText.position.x = 0;
    myText.position.z = 0;
    myText.textAlign = "center";
    // myText.color = 0x9966FF

    let wood = this.makeShader();
    // setting material
    myText.material = new MeshStandardNodeMaterial({
      colorNode: wood({
        scale: 2.5,
        rings: 4.5,
        length: 1,
        angle: 0,
        fibers: 0.3,
        fibersDensity: 10,
        color: new THREE.Color(15182336),
        background: new THREE.Color(11163904),
        seed: 0,
      }),
    });

    // Update the rendering:
    myText.sync();
  }

  makeShader() {
    var wood = Fn((params) => {
      var angle = radians(params.angle).toVar();
      var posLocal = vec3(
        sub(positionLocal.x.mul(cos(angle)), positionLocal.y.mul(sin(angle))),
        add(positionLocal.x.mul(sin(angle)), positionLocal.y.mul(cos(angle))),
        positionLocal.z
      ).toVar();

      // main pattern with rings
      var pos = posLocal
        .mul(
          exp(params.scale.sub(3)).mul(
            vec3(reciprocal(params.length), 4, reciprocal(params.length))
          )
        )
        .add(params.seed)
        .toVar();
      var k = pos.x.add(1).mul(10).mul(params.rings);
      k = k.add(k.cos()).cos().add(1).div(2);

      var kk = float(0).toVar(),
        sum = float(0).toVar(),
        scale = exp(params.scale.sub(2))
          .mul(vec3(1, params.fibersDensity, 1))
          .toVar(),
        power = float(2).toVar();

      Loop(10, () => {
        // kk.addAssign( mul( power, noise( posLocal.mul( scale ).add( params.seed ) ) ) );
        sum.addAssign(power);
        scale.mulAssign(1.8);
        power.mulAssign(0.6);
      });

      kk.assign(mul(kk, 5).div(sum).mul(10).sin().add(1).div(2));

      return mix(params.color, params.background, mix(k, kk, params.fibers));
    });

    wood.defaults = {
      $name: "Wood",
      scale: 2.5,
      rings: 4.5,
      length: 1,
      angle: 0,
      fibers: 0.3,
      fibersDensity: 10,
      color: new Color(0.8, 0.4, 0),
      background: new Color(0.4, 0.1, 0),
      seed: 0,
    };

    return wood;
  }
}

export default World;
