import MyScript from "../utils/myScript.js";
import Scene2 from "./scene-2.js";

class SceneSequencer {
  constructor(threeScene, sizes, camera) {
    this.threeScene = threeScene;
    this.sizes = sizes;
    this.camera = camera;

    if (window.isVisited == true) {
      this.scenes = [new Scene2()];
    } else {
      this.scenes = [
        new MyScript(
          "./assets/script.json",
          "https://opheliagame.github.io/work-images/"
        ),
        new Scene2(),
      ];
    }

    this.currentSceneIndex = 0;
  }

  playLinear() {
    console.log(this.scenes.length);
    console.log(this.currentSceneIndex);
    if (this.currentSceneIndex >= this.scenes.length) return;

    console.log("playing scene ", this.currentSceneIndex);

    this.scenes[this.currentSceneIndex]
      .run(this.threeScene, this.sizes, this.camera)
      .then(() => {
        console.log("next scene");
        this.nextSceneLinear();
        this.playLinear();
      });
  }

  nextSceneLinear() {
    this.currentSceneIndex += 1;
  }
}

export default SceneSequencer;
