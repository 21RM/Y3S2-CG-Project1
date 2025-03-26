import {CGFobject} from '../lib/CGF.js';
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPrism extends CGFobject {
    constructor(scene, slices, stacks) {

        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        let alpha = 2 * Math.PI / this.slices;
        let stackHeight = 1.0 / this.stacks;

        for (let i = 0; i < this.slices; i++) {
            let angleI   = i * alpha;
            let angleI1  = (i + 1) * alpha;
            let angleMid = angleI + alpha / 2.0; 

            let nx = Math.cos(angleMid);
            let ny = Math.sin(angleMid);

            for (let j = 0; j < this.stacks; j++) {
                let zLow = j * stackHeight;     
                let zHigh = (j + 1) * stackHeight;


                let xA = Math.cos(angleI);
                let yA = Math.sin(angleI);
                let xB = Math.cos(angleI1);
                let yB = Math.sin(angleI1);

                this.vertices.push(xA, yA, zLow);
                this.normals.push(nx, ny, 0);

                this.vertices.push(xB, yB, zLow);
                this.normals.push(nx, ny, 0);

                this.vertices.push(xA, yA, zHigh);
                this.normals.push(nx, ny, 0);

                this.vertices.push(xB, yB, zHigh);
                this.normals.push(nx, ny, 0);

                let base = (i * this.stacks + j) * 4;

                let A = base; 
                let B = base + 1;
                let C = base + 2;
                let D = base + 3;

                this.indices.push(A, B, C);

                this.indices.push(C, B, D);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    display() {
        this.scene.pushMatrix();
    
        this.scene.rotate(-Math.PI / 2, 1, 0, 0); 
    
        super.display();
    
        this.scene.popMatrix();
    }
    
}

