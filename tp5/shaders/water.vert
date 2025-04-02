attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;
uniform sampler2D uSampler2;

  

varying vec2 vTextureCoord;


void main() {
  
    vTextureCoord = aTextureCoord;
    
    vec2 animatedTexCoord = vTextureCoord + vec2(0.1 * timeFactor, 0.1 * timeFactor);    

    float height = texture2D(uSampler2, animatedTexCoord).b;
  
    vec3 displacement = aVertexNormal * 0.05 * height;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + displacement, 1.0);
}
