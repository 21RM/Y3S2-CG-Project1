import { CGFobject } from '../lib/CGF.js';
import { CGFappearance } from '../lib/CGF.js';

/**
 * MyQuad
 * @constructor
 * @param scene - Reference to MyScene object
 * @param texture - CGFtexture or image for the quad
 * @param material - (Optional) CGFappearance. If provided, used directly; otherwise a new appearance is created with the given texture.
 */
export class MyQuad extends CGFobject {
  constructor(scene, subdivisions = 1, texture = null, material = null) {
    super(scene);
    this.subdivisions = subdivisions;


    if (material) {
      this.material = material;
    } else {
      this.material = new CGFappearance(scene);
      this.material.setAmbient(0.5, 0.5, 0.5, 1);
      this.material.setDiffuse(0.5, 0.5, 0.5, 1);
      this.material.setSpecular(0.5, 0.5, 0.5, 1);
      this.material.setShininess(10);
      this.material.setEmission(1, 1, 1, 1);
    }
    if (texture != null){
      this.material.setTexture(texture);
    }

    this.initBuffers();
  }

  initBuffers() {
    const divs = this.subdivisions;
    const step = 1.0 / divs;

    this.vertices = [];
    this.normals  = [];
    this.texCoords = [];
    this.indices  = [];

    // Generate vertices, normals, and texture coordinates
    for (let i = 0; i <= divs; i++) {
      const y = -0.5 + step * i;
      for (let j = 0; j <= divs; j++) {
        const x = -0.5 + step * j;
        this.vertices.push(x, y, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(j / divs, i / divs);
      }
    }

    // Generate indices (two triangles per cell)
    for (let i = 0; i < divs; i++) {
      for (let j = 0; j < divs; j++) {
        const idx = i * (divs + 1) + j;
        const idxRight = idx + 1;
        const idxBelow = idx + (divs + 1);
        const idxBelowRight = idxBelow + 1;
        this.indices.push(idx, idxRight, idxBelowRight);
        this.indices.push(idx, idxBelowRight, idxBelow);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  display() {
    const gl = this.scene.gl;
    // Enable blending for alpha transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Draw both sides by disabling face culling temporarily
    gl.disable(gl.CULL_FACE);

    // Apply the material/texture (with alpha channel)
    this.material.apply();

    // Draw the quad geometry
    super.display();

    // Restore default culling and blending
    gl.enable(gl.CULL_FACE);
    gl.disable(gl.BLEND);
  }
}