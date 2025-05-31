#ifdef GL_ES
precision mediump float;
#endif

attribute vec3  aVertexPosition;
attribute vec3  aVertexNormal; 
attribute vec2  aTextureCoord;

attribute vec3  aOffset;
attribute vec3  aAxis;
attribute float aAngle;
attribute vec3  aScale;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uTime;

varying vec2  vTexCoord;


float instanceSeed() {
    float h = dot(aOffset.xy, vec2(12.9898, 78.233));
    return fract(sin(h) * 43758.5453123);
}

void main() {
    vec3 pos = aVertexPosition * aScale;

    float s = sin(aAngle);
    float c = cos(aAngle);
    vec3 ax = normalize(aAxis);
    vec3 crossPart = cross(ax, pos);
    float dotPart  = dot(ax, pos);
    vec3 rotated  = pos * c  + crossPart * s + ax * (dotPart * (1.0 - c));

    vec3 worldPos = rotated + aOffset;

    float seed  = instanceSeed();
    float phase = pos.y * 5.0 + seed * 6.283; // pos.y*5 + seed*(2π)
    float freq  = 10.0;                      // how fast the sine oscillates
    float amp   = 0.5;                     // max displacement (in world‐units)

    float ripple = sin(uTime * freq + phase) * amp;

    // Displace worldPos along its *normal*:
    worldPos += aVertexNormal * ripple;

    // 4) Pass UV to fragment:
    vTexCoord = aTextureCoord;

    // 5) Final MVP transform:
    gl_Position = uPMatrix * uMVMatrix * vec4(worldPos, 1.0);
}