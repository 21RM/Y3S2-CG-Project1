#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vGrassUV;
varying vec2 vMaskUV;
uniform float uRepeats;

void main() {
    vGrassUV = aTextureCoord;
    vMaskUV  = aTextureCoord / uRepeats;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}