#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTexCoord;
varying vec3 vNormal;

uniform sampler2D uSampler;            /* grass texture */
uniform vec3      uLightDirection;
uniform vec3      uLightColor;
uniform vec3      uAmbientColor;

void main() {
    vec3 tex = texture2D(uSampler, vTexCoord).rgb;

    vec3  N   = normalize(vNormal);
    vec3  L   = normalize(uLightDirection);
    float diff = max(dot(N, L), 0.0);

    vec3 color = tex * (uAmbientColor + diff * uLightColor);

    gl_FragColor = vec4(color, 1.0);
}