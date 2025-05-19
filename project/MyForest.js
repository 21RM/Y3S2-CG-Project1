import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';

export class MyForest extends CGFobject {
  /**
   * scene
   * rows, cols       – grid dims (rows × cols = max tree count)
   * width, depth     – footprint size (ignored in semicircle mode)
   * options:
   *   useSemiCircle        – boolean, spawn inside a semicircle
   *   semiRadius           – radius of the semicircle
   *   semiCenter           – [x,z] center of the flat side
   *   semiRotationDeg      – direction of flat side (degrees)
   *   position             – [x,y,z] offset for the entire forest (world coords)
   *   treeScale            – global height multiplier for trees
   *   collisionSpacing     – factor for min distance = (r1+r2)*collisionSpacing
   *   maxPlacementAttempts – tries per tree before skipping
   */
  constructor(scene, rows, cols, width, depth, options = {}) {
    super(scene);
    this.rows = rows;
    this.cols = cols;
    this.width = width;
    this.depth = depth;

    // semicircle configuration
    this.useSemiCircle = options.useSemiCircle || false;
    this.semiRadius = options.semiRadius ?? Math.min(width, depth) / 2;
    this.semiCenter = options.semiCenter || [0, 0];
    this.semiRotationRad = ((options.semiRotationDeg ?? 0) * Math.PI) / 180;

    // overall position & scale
    this.position = options.position || [0, 0, 0];  // world offset
    this.treeScale = options.treeScale || 2.8;

    // spacing and retry config
    this.collisionSpacing = options.collisionSpacing || 2;
    this.maxPlacementAttempts = options.maxPlacementAttempts || 10;

    this.trees = [];
    this.generate();
  }

  generate() {
    this.trees = [];
    const count = this.rows * this.cols;

    for (let i = 0; i < count; i++) {
      let attempt = 0;
      let x, z, h, trunkR, green;

      for (; attempt < this.maxPlacementAttempts; attempt++) {
        // Choose position in local coords
        if (this.useSemiCircle) {
          const r = Math.sqrt(Math.random()) * this.semiRadius;
          const theta = this.semiRotationRad + Math.random() * Math.PI;
          x = this.semiCenter[0] + r * Math.cos(theta);
          z = this.semiCenter[1] + r * Math.sin(theta);
        } else {
          const xStep = this.width / (this.cols + 1);
          const zStep = this.depth / (this.rows + 1);
          const row = Math.floor(i / this.cols);
          const col = i % this.cols;
          x = -this.width/2 + xStep*(col+1) + (Math.random()-0.5)*xStep*0.3;
          z = -this.depth/2 + zStep*(row+1) + (Math.random()-0.5)*zStep*0.3;
        }

        // Compute dimensions
        const baseH = 8 + Math.random() * 12;
        h = baseH * this.treeScale;
        trunkR = h * (0.03 + Math.random() * 0.02);
        green = 0.3 + Math.random() * 0.4;

        // Check collision with existing trees (world coords)
        let collision = false;
        const worldX = x + this.position[0];
        const worldZ = z + this.position[2];
        for (const { x: x2, z: z2, trunkRadius: r2 } of this.trees) {
          const dx = worldX - (x2 + this.position[0]);
          const dz = worldZ - (z2 + this.position[2]);
          const minDist = (trunkR + r2) * this.collisionSpacing;
          if (dx*dx + dz*dz < minDist*minDist) {
            collision = true;
            break;
          }
        }
        if (collision) continue;

        // Found valid spot
        break;
      }

      // Skip if no valid placement found
      if (attempt >= this.maxPlacementAttempts) continue;

      // Place tree
      const tree = new MyTree(this.scene, {
        inclinationDeg: (Math.random() - 0.5) * 14,
        inclineAxis: Math.random() < 0.5 ? 'X' : 'Z',
        trunkRadius: trunkR,
        treeHeight: h,
        foliageColor: [0, green, 0]
      });

      this.trees.push({ tree, x, z, trunkRadius: trunkR });
    }
  }

  display() {
    this.scene.pushMatrix();
      this.scene.translate(
        this.position[0],
        this.position[1],
        this.position[2]
      );
      for (const { tree, x, z } of this.trees) {
        this.scene.pushMatrix();
          this.scene.translate(x, 0, z);
          tree.display();
        this.scene.popMatrix();
      }
    this.scene.popMatrix();
  }
}
