import * as THREE from 'three'

class LineBasicMesh extends THREE.Mesh {
  constructor(path) {
    super()

    // Extrude the line into a mesh
    // const extrudeSettings = {
    //   steps: 1,
    //   depth: 0.02,
    //   bevelEnabled: true,
    // };

    // const shape = new THREE.Shape();
    // shape.moveTo(points[0].x, points[0].y);
    // for (let i = 1; i < points.length; i++) {
    //   shape.lineTo(points[i].x, points[i].y);
    // }

    // this.geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // this.material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    // this.castShadow = true;


    this.geometry = new THREE.TubeGeometry( path, 20, 2, 8, false );
    this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  }

}

export default LineBasicMesh