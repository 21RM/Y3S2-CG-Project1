import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { MyQuad } from './MyQuad.js';


export class MyTree extends CGFobject {
  
  constructor(scene, {
    inclinationDeg    = 0,
    inclineAxis       = 'X',
    inclinationScale  = 1,
    trunkRadius       = 0.5,
    treeHeight        = 40,
    foliageColor      = [0,1,0],
    trunkSlices       = 16,
    trunkStacks       = 1,
    crownStacks       = 1,
    crownSlicesMin    = 5,
    crownSlicesMax    = 14,
    topShrinkFactor   = 0.8,
    textureIndex = Math.floor(Math.random()*3), 
  } = {}) {
    super(scene);

    // Tree parameters
    this.trunkRadius  = trunkRadius;
    this.treeHeight   = treeHeight;
    this.foliageColor = foliageColor;
    
    // determine foliage tier count by height
    const SMALL_THRESHOLD  = 30;
    const MEDIUM_THRESHOLD = 45;
    if (this.treeHeight <= SMALL_THRESHOLD)       this.layers = 3;
    else if (this.treeHeight <= MEDIUM_THRESHOLD) this.layers = 4;
    else                                          this.layers = 5;

    // inclination parameters
    this.inclRad          = inclinationDeg * Math.PI/180;
    this.tiltX            = (inclineAxis === 'X');
    this.inclinationScale = inclinationScale;
    this.inclinationDeg   = inclinationDeg;
    this.inclineAxis      = inclineAxis;
  

    // split heights
    this.trunkHeight      = this.treeHeight * 0.5;
    this.crownHeight      = this.treeHeight * 0.8;

    // trunk appearance
    this.trunkMat = scene.trunkAppearance;

    this.textureIndex = textureIndex;

    // foliage appearance
    this.foliageMat = scene.leafAppearance;
    this.topfoliageMat = scene.leafTopAppearance;
    this.foliage2Mat = scene.leaf2Appearance;
    this.topfoliage2Mat = scene.leaf2TopAppearance;
    this.foliage3Mat = scene.leaf3Appearance;
    this.topfoliage3Mat = scene.leaf3TopAppearance;
    
    
    // trunk geometry
    this.trunk = new MyCylinder(
      scene,
      this.trunkHeight,
      trunkRadius,
      0,
      trunkSlices,
      trunkStacks
    );

    this.shadowPlane = new MyQuad(scene, 1, this.scene.treeShadowTex, this.scene.treeShadowAppr);

    // compute radii for each foliage layer
    this.radii = [];
    const minScale = 2;
    const maxScale = 3.5;
    for (let i = 0; i < this.layers; i++) {
      const t = i / (this.layers - 1);
      this.radii.push(trunkRadius * (maxScale - (maxScale - minScale) * t));
    }

    // build crown cylinders
    let foliageTotalH = 0;
    this.crowns = [];
    const layerH = this.crownHeight / this.layers;
    for (let i = 0; i < this.layers; i++) {
      const bottomR = this.radii[i];
      let rawTopR = (i < this.layers - 1) ? this.radii[i+1] - 1.8 : 0;
      let topR    = Math.max(rawTopR, 0);
      if (topR >= bottomR) topR = bottomR * 0.9;
      topR *= topShrinkFactor;
      const slices = Math.floor(
        Math.random() * (crownSlicesMax - crownSlicesMin + 1)
      ) + crownSlicesMin;
      const cyl = new MyCylinder(scene, layerH, bottomR, topR, slices, crownStacks);
      cyl.height = layerH;
      this.crowns.push(cyl);
      foliageTotalH += layerH;
    }
    
    this.totalHeight = this.trunkHeight + foliageTotalH;
    this.canopyRadius = this.radii[this.radii.length - 1];

  }

  display() {
    this.scene.pushMatrix();
      this.scene.translate(0, 0.01, 0);
      const baseCupR = this.radii[0];
      this.scene.scale(baseCupR * 1.5, 1,baseCupR * 1.5);
      this.scene.rotate(Math.PI/2, 1, 0, 0);
      this.scene.treeShadowAppr.apply();
      this.shadowPlane.display();
    this.scene.popMatrix();


    this.scene.pushMatrix();

    const factor0 = Math.sqrt(1 / this.layers);
    const angle0 = this.inclRad * factor0 * this.inclinationScale;
    if (this.tiltX) this.scene.rotate(angle0, 1, 0, 0);
    else this.scene.rotate(angle0, 0, 0, 1);

    this.trunkMat.apply();
    this.trunk.display();

    // move to start foliage
    this.scene.translate(0, this.trunkHeight*0.2, 0);
    const overlap = 0.7;
    const ti = this.textureIndex;

    for (let i = 0; i < this.crowns.length; i++) {
      const cyl   = this.crowns[i];
      const norm  = (i+1) / this.layers;
      const fact  = Math.sqrt(norm);
      const angle = this.inclRad * fact * this.inclinationScale;
      if(i==this.crowns.length-1) {
        if(ti == 0) {
          this.topfoliageMat.apply();
        }
        else if(ti == 1) {
          this.topfoliage2Mat.apply();
        }
        else {
          this.topfoliage3Mat.apply();
        }
      }
      else {
        if(ti== 0) {
          this.foliageMat.apply();
        }
        else if(ti == 1) {
          this.foliage2Mat.apply();
        }
        else {
          this.foliage3Mat.apply();
        }
      }

      // draw tilted cup
      this.scene.pushMatrix();
        if (this.tiltX) this.scene.rotate(angle, 1, 0, 0);
        else this.scene.rotate(angle, 0, 0, 1);
        cyl.display();
      this.scene.popMatrix();

      // compensate translation for next cup, using rotated axis
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const dy        = cyl.height * overlap * cosA;
      const horizDist = cyl.height * overlap * sinA;
      if (this.tiltX) {
        this.scene.translate(0, dy, horizDist);
      } else {
        this.scene.translate(-horizDist, dy, 0);
      }
    }

    this.scene.popMatrix();
  }
}