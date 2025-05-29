#version 300 es
precision mediump float;
uniform float time;
out vec4 fragColor;
void main() {
  // flicker the orange
  float f = 0.5 + 0.5*sin(time*10.0 + gl_FragCoord.y*0.1);
  fragColor = vec4(1.0, f, 0.0, 1.0);
}

