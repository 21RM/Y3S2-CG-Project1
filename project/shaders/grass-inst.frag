#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
varying vec3 vNormal;
varying float vHeight;

uniform vec3      uLightDirection;
uniform vec3      uLightColor;
uniform vec3      uAmbientColor;

uniform vec3 uGrassColor;

void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(uLightDirection);
    float diff = max(dot(N, L), 0.0);

    float shade = mix(0.6, 1.0, vHeight);

    vec3 color = uGrassColor * shade *  (uAmbientColor + diff * uLightColor);

    gl_FragColor = vec4(color, 1.0);
}