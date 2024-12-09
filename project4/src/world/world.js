import * as THREE from 'three'
import fragmentShader from '../glsl/main.frag'
import vertexShader from '../glsl/main.vert'
import { FontLoader, OrbitControls, TextGeometry } from 'three/examples/jsm/Addons.js';
import { MeshBasicNodeMaterial, MeshPhysicalNodeMaterial, MeshStandardNodeMaterial } from 'three/webgpu';
import { Text } from 'troika-three-text';
import { Fn, vec3, sub, cos, sin, exp, mx_noise_float as noise, step, mx_noise_vec3, normalWorld, time, uv, reciprocal, float, Loop, mul, radians, add, mix, positionLocal, texture, color } from 'three/tsl';
import { Color } from 'three';
import { WebGPURenderer } from 'three/webgpu'
import { convertHexToVec3 } from '../utils/colors';
import palette from '../colors/palette';

class World {

  constructor(container) {
    this.clock = new THREE.Clock()
    // Scene
    this.scene = new THREE.Scene()

    // sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    this.camera.position.set(0, 0, 10)
    this.scene.add(this.camera)

    this.uniforms = {
      time: { value: 1.0 }
    }

    this.scene.background = new THREE.Color( 'skyblue' )

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Strong directional light
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    this.addBackground()
    this.addObjects()

    this.renderer = new WebGPURenderer({
      canvas: container, 
      antialias: true,
    })
    this.renderer.setSize(sizes.width, sizes.height)
    this.renderer.shadowMap.enabled = true

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    // this.raycaster = new Raycaster(this.scene, this.camera)
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))

    const t = this.clock.getElapsedTime() * 2
    this.uniforms.time.value = t
    this.controls.update()

    this.scene.traverse((obj) => {
      if (obj.render) obj.render(t)
    })

    this.render()
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  getFeltMaterial(baseColor, scale) {

    const textureLoader = new THREE.TextureLoader();
    const perlinTexture = textureLoader.load( './images/rgb-256x256.png' );
    perlinTexture.wrapS = THREE.RepeatWrapping;
    perlinTexture.wrapT = THREE.RepeatWrapping;

    const feltTexture = textureLoader.load('./images/grey-carpet.jpeg')
    feltTexture.wrapS = THREE.RepeatWrapping;
    feltTexture.wrapT = THREE.RepeatWrapping;


    // const wood = this.makeShader()
    // // const material = new MeshStandardNodeMaterial()
    // // material.colorNode = wood({
    // //   scale: 2.5,
    // //   rings: 4.5,
    // //   length: 1,
    // //   angle: 0,
    // //   fibers: 0.3,
    // //   fibersDensity: 10,
    // //   colors: new THREE.Color(15182336),
    // //   background: new THREE.Color(11163904),
    // //   seed: 0,
    // // })
    // // material.colorNode = wood()
    // const material = new MeshBasicNodeMaterial({ color: new THREE.Color(0xff0000) })

    let feltMaterial = new MeshStandardNodeMaterial();
    // // Add a noise-based texture to simulate the fuzzy texture of felt
    // const noiseTexture = mul(noise(uv()), 0.0001); // Slight variation for texture
    // // Base felt color
    // const baseColor = vec3(0.8, 0.2, 0.2); // Red felt
    // // Mixed color to simulate depth and softness
    // const mixedColor = mix(baseColor, vec3(0.5, 0.1, 0.1), noiseTexture); // Add some dark variation

    // UV coordinates
    const uvNode = uv();

    // Layered Noise for More Texture
    let baseNoise = noise(uvNode); // Base noise
    let accumulatedNoise = baseNoise

    for(let i = 2.0; i > 0.0; i-=1.0) {
      const scaledNoise = noise(mul(uvNode, vec3(scale / i))); // Scaled for finer details
      accumulatedNoise = add(accumulatedNoise, scaledNoise); // Combine base and finer noise
    }
  

    // Strengthen Noise Effect
    const amplifiedNoise = mul(accumulatedNoise, 0.8); // Adjust intensity
    // Apply Noise to Color
    const noisyColor = mix(baseColor, vec3(0.5, 0.1, 0.1), amplifiedNoise);

    let t = texture(feltTexture, mul(uvNode, 0.05))

    feltMaterial.colorNode = mix(t, baseColor, 0.5);
    // Adjust roughness and metalness for a soft, non-reflective surface
    feltMaterial.roughnessNode = 1.0; // Fully rough
    feltMaterial.metalnessNode = 0.0; // No metallic properties

    return feltMaterial
  }

  addBackground() {

    const randomIndex = Math.floor(Math.random()*palette.length)
    const greenColor = convertHexToVec3(palette[randomIndex])
    const geometry1 = new THREE.PlaneGeometry(40, 40);
    const plane = new THREE.Mesh(geometry1, this.getFeltMaterial(greenColor, 50));
    plane.position.z = -1
    this.scene.add(plane);
  }

  addObjects() {
    const fontLoader = new FontLoader()
    fontLoader.load('fonts/Barriecito_Regular.json', (font) => {
      
      // this.addTextAs2DShapes(font)
      this.addTextAs3DShapes(font)

    })

  }

  addTextAs2DShapes(font) {
    const message = 'CREATIVE \ntechnologist';

    const shapes = font.generateShapes( message, 3 );
    const geometry = new THREE.ShapeGeometry( shapes );
    geometry.computeBoundingBox();
    const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    geometry.translate( xMid, 0, 0 );


    // make shape ( N.B. edge view not visible )
    const randomIndex = Math.floor(Math.random()*palette.length)
    const greenColor = convertHexToVec3(palette[randomIndex])
    const text = new THREE.Mesh( geometry, this.getFeltMaterial(greenColor, 10) );
    text.position.z = 0;
    this.scene.add( text );
  }

  addTextAs3DShapes(font) {
    const message = 'CREATIVE \ntechnologist';
    const textGeo = new TextGeometry( message, {
      font: font,
      size: 3,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5
    } );

    textGeo.computeBoundingBox();
    const xMid = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    textGeo.translate( xMid, 0, 0 );
    textGeo.computeVertexNormals();

    const randomIndex = Math.floor(Math.random()*palette.length)
    const greenColor = convertHexToVec3(palette[randomIndex])
    const textMaterial = this.getFeltMaterial(greenColor, 10)

    const textMesh = new THREE.Mesh( textGeo, textMaterial );
    textMesh.position.z = 0;
    this.scene.add( textMesh );
  }

  addObjectsWithTroika() {
    // Create:
    const myText = new Text()
    this.scene.add(myText)

    // Set properties to configure:
    myText.text = 'Anushka Trivedi'
    myText.fontSize = 0.4
    myText.position.y = 0
    myText.position.x = 0
    myText.position.z = 0
    myText.textAlign = 'center'
    // myText.color = 0x9966FF

    let wood = this.makeShader()
    // setting material
    myText.material =  new MeshStandardNodeMaterial({
      colorNode: wood ( {
          scale: 2.5,
          rings: 4.5,
          length: 1,
          angle: 0,
          fibers: 0.3,
          fibersDensity: 10,
          color: new THREE.Color(15182336),
          background: new THREE.Color(11163904),
          seed: 0
        } ),
    })

    // Update the rendering:
    myText.sync()

  }

 

  makeShader() {
    var wood = Fn( ( params ) => {

      var angle = radians( params.angle ).toVar();
      var posLocal = vec3(
        sub( positionLocal.x.mul( cos( angle ) ), positionLocal.y.mul( sin( angle ) ) ),
        add( positionLocal.x.mul( sin( angle ) ), positionLocal.y.mul( cos( angle ) ) ),
        positionLocal.z,
      ).toVar();
    
    
      // main pattern with rings
      var pos = posLocal.mul( exp( params.scale.sub( 3 ) ).mul( vec3( reciprocal( params.length ), 4, reciprocal( params.length ) ) ) ).add( params.seed ).toVar( );
      var k = ( pos.x ).add( 1 ).mul( 10 ).mul( params.rings );
      k = k.add( k.cos() ).cos().add( 1 ).div( 2 );
    
      var kk = float( 0 ).toVar(),
        sum = float( 0 ).toVar(),
        scale = exp( params.scale.sub( 2 ) ).mul( vec3( 1, params.fibersDensity, 1 ) ).toVar(),
        power = float( 2 ).toVar();
    
      Loop( 10, ()=>{
    
        // kk.addAssign( mul( power, noise( posLocal.mul( scale ).add( params.seed ) ) ) );
        sum.addAssign( power );
        scale.mulAssign( 1.8 );
        power.mulAssign( 0.6 );
    
      } );
    
      kk.assign( mul( kk, 5 ).div( sum ).mul( 10 ).sin().add( 1 ).div( 2 ) );
    
      return mix( params.color, params.background, mix( k, kk, params.fibers ) );
    
    } );
    
    
    
    wood.defaults = {
      $name: 'Wood',
      scale: 2.5,
      rings: 4.5,
      length: 1,
      angle: 0,
      fibers: 0.3,
      fibersDensity: 10,
      color: new Color( 0.8, 0.4, 0 ),
      background: new Color( 0.4, 0.1, 0 ),
      seed: 0,
    };

    return wood
  }
}

export default World