// // main.frag
// // #version 300 es

// #ifndef GL_FRAGMENT_PRECISION_HIGH
// 	precision mediump float;
// #else
// 	precision highp float;
// #endif

// // out vec4 fragColor;

// void main (void) {
//   fragColor = vec4(1.0, 0.0, 0.0, 1.0);
// }

precision mediump float;
precision mediump int;

uniform float time;

varying vec3 vPosition;
varying vec4 vColor;

void main()	{

  vec4 color = vec4( vColor );
  color.r += sin( vPosition.x * 10.0 + time ) * 0.5;

  gl_FragColor = color;

}