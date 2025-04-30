precision mediump float;

uniform sampler2D glassSampler;
uniform float alpha;

varying vec2 vTextureCoord;

void main(void) {
    vec4 texColor = texture2D(glassSampler, vTextureCoord);
    gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
}