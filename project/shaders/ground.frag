#version 300 es
precision mediump float;

in vec2  vTexCoord;
in vec2  vPlanePos;

uniform sampler2D uSampler;
uniform vec2 uLakeCenter;
uniform float uLakeRadius;

out vec4 fragColor;

void main() {
    vec2 d = vPlanePos - uLakeCenter;
    float rSq = uLakeRadius * uLakeRadius;
    if (dot(d, d) < rSq)
        discard;
    fragColor = texture(uSampler, vTexCoord);
}