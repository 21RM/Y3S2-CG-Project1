#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform sampler2D uSampler;

void main() {
    vec4 ft = texture2D(uSampler, vTexCoord);
    if (ft.a < 0.05)
        discard;
    gl_FragColor = ft;
}