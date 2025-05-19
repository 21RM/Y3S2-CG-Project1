// MyForest.js
import { CGFobject } from '../lib/CGF.js';
import { MyTree }     from './MyTree.js';

export class MyForest extends CGFobject {
  /**
   * scene
   * rows, cols    – integer grid dimensions
   * width, depth  – total footprint size
   */
  constructor(scene, rows, cols, width, depth) {
    super(scene);
    this.rows  = rows;
    this.cols  = cols;
    this.width = width;
    this.depth = depth;
    this.trees = [];
    this.generate();
  }

  generate() {
    this.trees = [];
    const xStep = this.width  / (this.cols + 1);
    const zStep = this.depth  / (this.rows + 1);
    for (let r=0; r<this.rows; r++) {
      for (let c=0; c<this.cols; c++) {
        // grid centre + 30% random offset
        const x = -this.width/2  + xStep*(c+1) + (Math.random()-0.5)*xStep*0.3;
        const z = -this.depth/2  + zStep*(r+1) + (Math.random()-0.5)*zStep*0.3;
        // random tree params
        const h  = 8  + Math.random()*12;    // 8–20 height
        const trunkFactor = 0.03 + Math.random() * 0.02; 
        const r0 = h * trunkFactor;  
        const g  = 0.3+ Math.random()*0.4;   // green shade
        const tree = new MyTree(this.scene, {
          inclinationDeg: (Math.random()-0.5)*10,
          inclineAxis:    Math.random()<0.5?'X':'Z',
          trunkRadius:    r0,
          treeHeight:     h,
          foliageColor:   [0, g, 0],
        });
        this.trees.push({tree,x,z});
      }
    }
  }

  display() {
    for (const {tree,x,z} of this.trees) {
      this.scene.pushMatrix();
        this.scene.translate(x,0,z);
        tree.display();
      this.scene.popMatrix();
    }
  }
}
