import { CGFobject, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyWaterDrop extends CGFobject {
  /**
   * @param {CGFscene} scene
   * @param {vec3} startPos
   * @param {vec3} initVel 
   * @param {Number} scale
   * @param {Function} onHitFireCallback 
   * @param {Number} fireHeight
   * @param {Number} startDelay 
   */
  constructor(scene, startPos, initVel, scale, onHitFireCallback, fireHeight, startDelay) {
    super(scene);

    this.position = [...startPos];
    this.velocity = [...initVel];
    this.scale    = scale;

    this.startDelay = startDelay; 

    this.gravity  = -9.8; 

    this.fireHeight = fireHeight;
    this.onHitFire  = onHitFireCallback;
    this.hasHitFire = false;

    this.groundY = fireHeight - 1.0;
    this.done    = false;

    this.sphere = new MySphere(scene, 16, 16, true);
    this.appearance = new CGFappearance(scene);
    this.appearance.setAmbient(1, 1, 1, 1.0);
    this.appearance.setDiffuse(0, 0, 0, 1.0);
    this.appearance.setSpecular(0.8, 0.8, 0.9, 1.0);
    this.appearance.setEmission(1, 1, 1, 1);
    this.appearance.setShininess(50);
    this.appearance.setTexture(this.scene.dropsTex);
  }

  update(dt) {
    if (this.done) return;

    if (this.startDelay > 0) {
      this.startDelay -= dt;
      return;
    }

    this.velocity[1] += this.gravity * dt * 5;

    this.position[0] += this.velocity[0] * dt;
    this.position[1] += this.velocity[1] * dt;
    this.position[2] += this.velocity[2] * dt;

    if (!this.hasHitFire && this.position[1] <= this.fireHeight) {
      this.hasHitFire = true;
      if (this.onHitFire) this.onHitFire();
    }

    if (this.position[1] <= this.groundY) {
      this.done = true;
    }
  }

  display() {
    if (this.done) return;

    this.scene.pushMatrix();
      this.scene.translate(
        this.position[0],
        this.position[1],
        this.position[2]
      );
      this.scene.scale(this.scale, this.scale, this.scale);
      this.appearance.apply();
      this.sphere.display();
    this.scene.popMatrix();
  }
}