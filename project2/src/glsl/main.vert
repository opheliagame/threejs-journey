precision mediump float;
precision mediump int;

uniform mat4 modelViewMatrix; // optional
uniform mat4 projectionMatrix; // optional
uniform float time;

attribute vec3 position;
attribute vec4 color;

varying vec3 vPosition;
varying vec4 vColor;

void main(){

  // vec3 uv = position;
  // uv.z += sin(position.x*0.0001)*5.0;
  
  vPosition = position;
  vColor = color;

  float r = length(vec2(position.x, position.y));
  float calc = 0.1 * sin(r * 10.0 + time);   
  vec3 newPosition = position;
  newPosition.z = newPosition.z + calc;

  vec4 pos = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.);
  // pos.y += sin(pos.x * 10.0) * 2.0;

  gl_Position = pos; 
  
}