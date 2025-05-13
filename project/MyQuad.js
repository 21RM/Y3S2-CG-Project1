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
  constructor(scene, texture, material = null) {
    super(scene);

    if (material) {
      this.material = material;
    } else {
      this.material = new CGFappearance(scene);
      this.material.setAmbient(0.5, 0.5, 0.5, 1);
      this.material.setDiffuse(0.5, 0.5, 0.5, 1);
      this.material.setSpecular(0.5, 0.5, 0.5, 1);
      this.material.setShininess(10);
      this.material.setEmission(1, 1, 1, 1);
      this.material.setTexture(texture);
    }

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      -0.5, -0.5, 0,  // bottom-left
       0.5, -0.5, 0,  // bottom-right
       0.5,  0.5, 0,  // top-right
      -0.5,  0.5, 0   // top-left
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];

    this.texCoords = [
      0, 0,
      1, 0,
      1, 1,
      0, 1
    ];

    this.indices = [
      0, 1, 2,
      0, 2, 3
    ];

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