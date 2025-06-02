import { CGFobject } from '../lib/CGF.js';

export class MyCylinder extends CGFobject {
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


        for (let stack = 0; stack <= this.stacks; stack++) {
            let z = stack * stackHeight;
            
            for (let slice = 0; slice <= this.slices; slice++) {
                let ang = slice * alpha;
                
                let x = Math.cos(ang);
                let y = Math.sin(ang);

                this.vertices.push(x, y, z);

                let length = Math.sqrt(x*x + y*y);
                this.normals.push(x/length, y/length, 0);
            }
        }

        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                let current = stack*(this.slices+1) + slice;
                let next    = current + (this.slices+1);

                this.indices.push(current, current + 1, next);

                this.indices.push(next, current + 1, next + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
