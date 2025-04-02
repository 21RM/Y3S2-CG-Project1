
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float normScale;

void main() {
    vTextureCoord = aTextureCoord;

    float offsetX = normScale * sin(timeFactor);

    vec4 newPosition = vec4(aVertexPosition.x + offsetX, aVertexPosition.y, aVertexPosition.z, 1.0);

    gl_Position = uPMatrix * uMVMatrix * newPosition;
}

