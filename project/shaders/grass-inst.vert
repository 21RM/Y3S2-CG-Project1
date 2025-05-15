#ifdef GL_ES
precision highp float;
#endif



/* per-vertex attributes coming from CGF */
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

/* per-instance attributes we upload in JS ----------------------- */
attribute vec3  aOffset;        /* world-space translation  */
attribute float aScale;         /* uniform scale            */
attribute float aRotation;      /* rotation around Y (radians) */

/* standard scene uniforms */
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

/* animation / wind */
uniform float time;

/* varyings to fragment shader */
varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vHeight;


/* --------------------------------------------------------------- */
void main() {
    /* 1 – scale */
    vec3 pos = aVertexPosition * aScale;

    /* 2 – rotate around Y (cheap 2×2) */
    float c = cos(aRotation);
    float s = sin(aRotation);
    pos = vec3(c*pos.x + s*pos.z, pos.y, -s*pos.x + c*pos.z);

    /* 3 – wind sway (depends on height so only blade tip moves)  */
    float sway = (sin(time + pos.y * 12.0) * 0.1 )* pos.y;
    pos.x += sway;

    /* 4 – translate to world position */
    pos += aOffset;

    vHeight = clamp(aVertexPosition.y, 0.0, 1.0);

    /* send to pipeline */
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);

    vTexCoord  = aTextureCoord;
    vNormal = normalize((uNMatrix * vec4(aVertexNormal, 0.0)).xyz);
    vWorldPos  = pos;
}