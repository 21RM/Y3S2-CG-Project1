attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;

varying vec2 vTextureCoord;


void main() {
    vTextureCoord = aTextureCoord;
    vec2 origin = vec2(0.5, 0.5);

    vec2 pos2d = aVertexPosition.xy;
    float dist = length(pos2d - origin);
    float wavelength = 1.0;
    float speed = 0.2;
    float amplitude = 1.0;
    float growthSpeed = 0.2;
    float falloff = 0.05;

    float phase = (dist / wavelength) - (timeFactor * speed);
    float wave  = sin( phase * 2.0 * 3.1415926 );

    float maxR = timeFactor * growthSpeed;
    float mask = 1.0 - smoothstep(maxR, maxR + falloff, dist);

    float disp = wave * amplitude * mask;
    vec3 displaced = aVertexPosition + aVertexNormal * disp;

    float speedU = 0.02 * wave;
    float speedV = 0.02 * wave;
    vTextureCoord += vec2(speedU, speedV);
    
    gl_Position = uPMatrix * uMVMatrix * vec4(displaced, 1.0);
}
