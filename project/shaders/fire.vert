#version 300 es
in vec3 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float time;
void main() {
  // basic wobble along normal
  float wobble = sin(time + aVertexPosition.y*5.0)*0.02;
  vec3 pos = aVertexPosition + wobble * normalize(aVertexPosition);
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(pos, 1.0);
}
