import { CGFobject, CGFappearance } from '../lib/CGF.js';

export class MyCircle extends CGFobject {
  /**
   * @param {CGFscene} scene 
   * @param {Number} radius   Outer radius of the circle
   * @param {Number} slices   How many segments around the circumference (default 32)
   */
  constructor(scene, radius = 1.0, slices = 32, texture_path = "") {
    super(scene);
    this.scene = scene;
    this.radius = radius;
    this.slices = slices;

    this.initBuffers();

    this.appearance = new CGFappearance(scene);
    this.appearance.setAmbient(1, 1, 1, 1);
    this.appearance.setDiffuse(1, 1, 1, 1);
    this.appearance.setSpecular(0, 0, 0, 1);
    this.appearance.setShininess(1);
    this.appearance.loadTexture(texture_path);
  }

  initBuffers() {
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    this.indices = [];

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    const angleStep = (2 * Math.PI) / this.slices;
    for (let i = 0; i <= this.slices; i++) {
      const ang = i * angleStep;
      const x = this.radius * Math.cos(ang);
      const y = this.radius * Math.sin(ang);

      this.vertices.push(x, y, 0);
      this.normals.push(0, 0, 1);

      const u = 0.5 + (x / (2 * this.radius));
      const v = 0.5 + (y / (2 * this.radius));
      this.texCoords.push(u, v);
    }

    for (let i = 1; i <= this.slices; i++) {
      this.indices.push(0, i, i + 1);
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
    this.appearance.apply();

    // Draw the quad geometry
    super.display();

    // Restore default culling and blending
    gl.enable(gl.CULL_FACE);
    gl.disable(gl.BLEND);
  }
}