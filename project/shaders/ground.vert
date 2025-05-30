#version 300 es
precision mediump float;

layout(location = 0) in vec3 aVertexPosition;
layout(location = 2) in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

out vec2 vTexCoord;
out vec2 vPlanePos;

void main() {
    vPlanePos = aVertexPosition.xy;
    vTexCoord = aTextureCoord;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}