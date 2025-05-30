import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';
import { MyFire} from './MyFire.js';

export class MyForest extends CGFobject {
 
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

    // fire parameters
    this.fireProbability    = options.fireProbability     ?? 0.1;  // cluster radius factor
    this.fireInstances      = options.fireInstances       ?? 1;    // fires per tree
    this.fireScale          = options.fireScale           ?? 1.0;  // global size multiplier
    this.fireHeightFactor   = options.fireHeightFactor    ?? 0.3;  // flame height relative to trunk
    this.fireLayers         = options.fireLayers          ?? 5;    // cones per fire instance


    // compute max cluster radius
    if (this.useSemiCircle) {
      this.maxFireRadius = this.semiRadius;
      const r     = Math.sqrt(Math.random()) * this.semiRadius;
      const theta = this.semiRotationRad + Math.random() * Math.PI;
      this.fireCenter = [
        this.semiCenter[0] + r * Math.cos(theta),
        this.semiCenter[1] + r * Math.sin(theta)
      ];
    } else {
      this.maxFireRadius = Math.sqrt(width*width + depth*depth) / 2;
      this.fireCenter = [
        (Math.random() - 0.5) * width   + this.position[0],
        (Math.random() - 0.5) * depth   + this.position[2]
      ];
    }

    this.trees = [];
    this.generate();
    this.applyFires();
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

      this.trees.push({ tree, x, z, trunkRadius: trunkR, fire: [] });
    }
    
  }

  applyFires() {
    const radius = this.fireProbability * this.maxFireRadius;
    for (const entry of this.trees) {
      entry.fire = [];

      // compute world position and distance to fire center
      const worldX = entry.x + this.position[0];
      const worldZ = entry.z + this.position[2];
      const dx = worldX - this.fireCenter[0];
      const dz = worldZ - this.fireCenter[1];

      // within cluster? then possibly ignite
      if (dx*dx + dz*dz <= radius*radius) {
        for(let i=0; i < this.fireInstances; i++) {
          const trunkH   = entry.tree.trunkHeight;
          const trunkR   = entry.tree.trunkRadius;
          const canopyR  = entry.tree.canopyRadius;
          const eps  = 0.02;
          const sizeScale = 0.3 + Math.random()* 0.05;
          const sphereRadius = (trunkR * 1.8) * sizeScale;
          const coneMaxHeight    = (trunkH * this.fireHeightFactor) * sizeScale*0.7;
          const coneMaxBaseRadius= (sphereRadius * 0.4);

          // attach fire at base of trunk
          let fireX = worldX;
          let fireZ = worldZ;
          let fireY;

          // use adjustable height factor and layers  
          let baseR, height;

          const zone = Math.floor(Math.random()*3);
          const ang  = Math.random()*2*Math.PI;
          const cosA = Math.cos(ang), sinA = Math.sin(ang)

          switch(zone) {
            case 0: // near ground, offset from trunk
              fireX += (trunkR + eps)*cosA+ 2*Math.random();
              fireZ += (trunkR + eps)*sinA+ 2*Math.random();
              fireY = eps;
              baseR  = trunkR * 1.8;
              height = trunkH * this.fireHeightFactor;
              break;
            case 1: // on trunk side
              fireX += (trunkR + eps)*cosA;
              fireZ += (trunkR + eps)*sinA;
              fireY = trunkH * (0.3 + Math.random()*0.4);
              baseR  = trunkR * 1.2;
              height = trunkH * this.fireHeightFactor;
              break;
            case 2: // in canopy
              fireX += (canopyR*0.6 + eps)*cosA-0.5;
              fireZ += (canopyR*0.6 + eps)*sinA-0.5;
              fireY = trunkH * 0.8;
              baseR  = trunkR * 1.5;
              height = trunkH * this.fireHeightFactor;
              break;
          }

      
          entry.fire.push( new MyFire(
            this.scene,
            [ fireX, fireY, fireZ ],
            { radius:        sphereRadius,
              count:         this.fireLayers * 5,    
              maxHeight:     coneMaxHeight,
              maxBaseRadius: coneMaxBaseRadius,
              fireScale: this.fireScale,
              slices:        8 }
          ));
        }
      }
    }
  }


  update(dt) {
    for (const entry of this.trees) {
      for (const f of entry.fire) {
        if (f.update) f.update(dt);
      }
    }
  }


  display(showFires = true) {
    this.scene.pushMatrix();
      this.scene.translate(
        this.position[0],
        this.position[1],
        this.position[2]
      );
      for (const posi of this.trees) {
        this.scene.pushMatrix();
          this.scene.translate(posi.x, 0,posi.z);
          posi.tree.display();
        this.scene.popMatrix();
        if (showFires) {
          for (const f of posi.fire) {
            f.display();
          }
        }
      }
    this.scene.popMatrix();
  }
}
