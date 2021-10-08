
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.14159265358979;
uniform float distanceFromCenter;



void main() {

  vUv = (uv - vec2(0.5))*(0.8 - 0.2 * distanceFromCenter*(2. - distanceFromCenter)) + vec2(0.5);
  vec3 pos = position;

  pos.y += sin(PI*uv.x)*0.02; 
  pos.z += sin(PI*uv.x)*0.04; 

  
  pos.y += sin(time*0.5)*0.02;
  vUv.y -= sin(time*0.5)*0.02;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}