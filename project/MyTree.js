// MyTree.js
import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';

/**
 * MyTree
 * Pine tree with cylindrical trunk and stacked, faceted foliage cylinders.
 * Each foliage layer is a tapered cylinder (top radius < bottom radius),
 * layers overlap and radii strictly decrease upward.
 */
export class MyTree extends CGFobject {
  /**
   * @param scene
   * @param options:
   *  - inclinationDeg: tilt angle in degrees (0 = vertical)
   *  - inclineAxis: 'X' or 'Z'
   *  - trunkRadius: base radius of trunk
   *  - treeHeight: total height of tree
   *  - foliageColor: [r,g,b]
   *  - trunkSlices, trunkStacks: detail segments for trunk
   *  - crownLayers: number of foliage tiers (min 3)
   *  - crownSlices, crownStacks: detail for foliage cylinders
   */
  constructor(scene, {
    inclinationDeg = 0,
    inclineAxis    = 'X',
    trunkRadius    = 0.5,
    treeHeight     = 10,
    foliageColor   = [0,1,0],
    trunkSlices    = 16,
    trunkStacks    = 1,
    crownLayers    = 3,
    crownSlices    = 12,
    crownStacks    = 1,
  } = {}) {
    super(scene);
    // at least 3 foliage tiers
    this.layers = Math.max(3, crownLayers);

    // tilt parameters
    this.inclRad = inclinationDeg * Math.PI/180;
    this.tiltX   = (inclineAxis === 'X');

    // height split: 20% trunk, 80% foliage
    this.trunkHeight = treeHeight * 0.2;
    this.crownHeight = treeHeight * 0.8;

    // trunk material (brown)
    this.trunkMat = new CGFappearance(scene);
    this.trunkMat.setAmbient(0.2,0.1,0,1);
    this.trunkMat.setDiffuse(0.6,0.3,0,1);
    this.trunkMat.setSpecular(0.1,0.1,0.1,1);
    this.trunkMat.setShininess(10);

    // foliage material (green)
    const [r,g,b] = foliageColor;
    this.foliageMat = new CGFappearance(scene);
    this.foliageMat.setAmbient(r*0.2,g*0.2,b*0.2,1);
    this.foliageMat.setDiffuse(r*0.8,g*0.8,b*0.8,1);
    this.foliageMat.setSpecular(0.1,0.1,0.1,1);
    this.foliageMat.setShininess(10);

    // trunk geometry: tapered cylinder
    this.trunk = new MyCylinder(
      scene,
      this.trunkHeight,
      trunkRadius,
      trunkRadius * 0.9,
      trunkSlices,
      trunkStacks
    );

    // compute strictly decreasing radii for foliage layers
    this.radii = [];
    const minScale = 2;
    const maxScale = 3.5;
    for (let i = 0; i < this.layers; i++) {
      const t = i / (this.layers - 1);
      const scale = maxScale - (maxScale - minScale) * t;
      this.radii.push(trunkRadius * scale);
    }

    // build foliage cylinders (tapered) with overlap
    this.crowns = [];
    const layerH = this.crownHeight / this.layers;
    for (let i = 0; i < this.layers; i++) {
      const bottomR = this.radii[i];
      // top radius slightly smaller than next bottom, or 0 at top layer
      let rawTopR = (i < this.layers - 1)
        ? this.radii[i +1] - 1.8  // small overlap at intersection
        : 0;
      let topR = Math.max(rawTopR, 0);
      if (topR >= bottomR) topR = bottomR * 0.9;

      const cyl = new MyCylinder(
        scene,
        layerH,
        bottomR,
        topR,
        crownSlices,
        crownStacks
      );
      cyl.height = layerH;
      this.crowns.push(cyl);
    }
  }

  display() {
    this.scene.pushMatrix();
    // apply tilt
    if (this.tiltX) this.scene.rotate(this.inclRad, 1, 0, 0);
    else            this.scene.rotate(this.inclRad, 0, 0, 1);

    // draw trunk
    this.trunkMat.apply();
    this.trunk.display();

    // draw foliage with overlap
    this.scene.translate(0, this.trunkHeight, 0);
    this.foliageMat.apply();
    for (const cyl of this.crowns) {
      cyl.display();
      // overlap 30% of height
      this.scene.translate(0, cyl.height * 0.7, 0);
    }

    this.scene.popMatrix();
  }
}
