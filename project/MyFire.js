import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MySphere } from './MySphere.js';
import { MyCylinder } from './MyCylinder.js';

/**
 * MyFire
 * Optimized fire blob: one shared unit-sphere and unit-cone geometry,
 * per-instance transforms & materials for cones, avoids per-cone mesh creation.
 */
export class MyFire extends CGFobject {
  // shared static geometry
  static unitSphere = null;
  static unitCone   = null;

  constructor(scene, position, options = {}) {
    super(scene);
    this.scene     = scene;
    this.position  = [...position];
    this.radius    = options.radius        || 0.5;
    this.count     = options.count         || 30;
    this.maxH      = options.maxHeight     || 2.0;
    this.maxBR     = options.maxBaseRadius || 0.8;
    this.slices    = options.slices        || 8;
    this.fireScale = options.fireScale     || 1.0;

    // build shared cube once
    if (!MyFire.unitSphere) {
      MyFire.unitSphere = new MySphere(scene, this.slices, this.slices,true);
    }
    this.coreSphere = MyFire.unitSphere;

    if (!MyFire.unitCone) {
      // unit cylinder: height=1, bottomR=1, topR=0, for instanced scaling
      MyFire.unitCone = new MyCylinder(scene, 1, 1, 0, this.slices, 1);
    }
    this.unitCone = MyFire.unitCone;

    // sphere material: opaque orange
    this.coreMat = new CGFappearance(scene);
    this.coreMat.setEmission(1.0, 0.8, 0, 1.0);
    this.coreMat.setDiffuse (1.0, 0.5, 0.0, 1.0);
    this.coreMat.setSpecular(0, 0, 0, 1);
    this.coreMat.setShininess(1);

    // precompute per-cone transforms & materials
    this.cones = new Array(this.count);
    const up = [0,1,0];
    for (let i = 0; i < this.count; i++) {
      // random hemisphere direction
      const phi   = Math.acos(1 - Math.random());
      const theta = 2 * Math.PI * Math.random();
      const sinP  = Math.sin(phi);
      const normal = [
        sinP * Math.cos(theta),
        Math.cos(phi),
        sinP * Math.sin(theta)
      ];

      // orientation axis-angle
      const dot = up[0]*normal[0] + up[1]*normal[1] + up[2]*normal[2];
      const angle = Math.acos(Math.min(Math.max(dot, -1), 1));
      const axis  = [ up[1]*normal[2] - up[2]*normal[1],
                      up[2]*normal[0] - up[0]*normal[2],
                      up[0]*normal[1] - up[1]*normal[0] ];

      // random cone dimensions
      const h   = this.maxH    * (0.5 + 0.5*Math.random()) * this.fireScale*2;
      const bR  = this.maxBR   * (0.3 + 0.7*Math.random()) * this.fireScale*2;
      const tR  = bR * 0.1*2;

      // precompute scale vector for unit-cone
      const scaleVec = [ bR, h, bR ];

      // per-cone material
      const flicker = 0.6 + 0.4*Math.random();
      const mat = new CGFappearance(scene);
      mat.setEmission(1.0, flicker, 0, 1.0);
      mat.setDiffuse (1.0, flicker, 0, 1.0);
      mat.setSpecular(0,0,0,1);
      mat.setShininess(1);

      this.cones[i] = { normal, axis, angle, scaleVec, mat };
    }
  }

  display() {
    const gl = this.scene.gl;
    // draw sphere fully opaque
    this.scene.pushMatrix();
      this.scene.translate(...this.position);
      const s = this.radius * this.fireScale*2;
      this.scene.pushMatrix();
        this.scene.scale(s, s, s);
        this.coreMat.apply();
        // disable blending for core
        gl.disable(gl.BLEND);
        this.coreSphere.display();
      this.scene.popMatrix();

      // draw cones with additive blending
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      for (const { normal, axis, angle, scaleVec, mat } of this.cones) {
        this.scene.pushMatrix();
          this.scene.translate(
            normal[0] * s,
            normal[1] * s,
            normal[2] * s
          );
          if (angle !== 0) this.scene.rotate(angle, ...axis);
          this.scene.scale(...scaleVec);
          mat.apply();
          this.unitCone.display();
        this.scene.popMatrix();
      }
      gl.disable(gl.BLEND);
    this.scene.popMatrix();
  }
}
