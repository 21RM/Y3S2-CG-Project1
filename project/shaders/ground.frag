#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vGrassUV;
varying vec2 vMaskUV;

uniform sampler2D uGrassSampler; 
uniform sampler2D uMaskSampler;

void main() {
    float m = texture2D(uMaskSampler, vMaskUV).r;
    if (m < 0.5) {
        discard;
    }
    vec4 grassColor = texture2D(uGrassSampler, vGrassUV);
    gl_FragColor = grassColor;
}