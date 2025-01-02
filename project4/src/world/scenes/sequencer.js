import MyScript from "../utils/myScript";
import Scene2 from "./scene-2";

class SceneSequencer {
  constructor(threeScene, sizes, camera) {
    this.threeScene = threeScene;
    this.sizes = sizes;
    this.camera = camera;

    this.scenes = [
      new MyScript(
        "script.txt",
        // "https://raw.githubusercontent.com/opheliagame/work-images/refs/heads/main"
        "https://opheliagame.github.io/work-images/"
      ),
      new Scene2(),
    ];
    // this.scenes = [new Scene2()];

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
