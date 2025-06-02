import {CGFobject} from '../lib/CGF.js';
/**
* MySphere
* @constructor
 * @param {CGFscene} scene - The scene reference.
 * @param {number} slices - Number of slices around the Y axis.
 * @param {number} stacks - Number of stacks from top to bottom.
 * @param {boolean} invertFaces - If true, the sphere is inverted so that its interior is visible.
*/
export class MySphere extends CGFobject {
    constructor(scene, slices = 20, stacks = 20, invertFaces = false) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.invertFaces = invertFaces;
        this.initBuffers();
      }
    
    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        this.indices = [];

        for (let stack = 0; stack <= this.stacks; stack++) {
            let phi = Math.PI * stack / this.stacks; 
            for (let slice = 0; slice <= this.slices; slice++) {
                let theta = 2 * Math.PI * slice / this.slices;

                let x = Math.sin(phi) * Math.cos(theta);
                let y = Math.cos(phi);
                let z = Math.sin(phi) * Math.sin(theta);

                this.vertices.push(x, y, z);

                if (this.invertFaces)
                    this.normals.push(-x, -y, -z);
                else
                    this.normals.push(x, y, z);

                this.texCoords.push(1 - slice / this.slices, stack / this.stacks);
            }
        }

        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
            let first = stack * (this.slices + 1) + slice;
            let second = first + this.slices + 1;
            if (!this.invertFaces) {
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            } else {
                this.indices.push(first, first + 1, second);
                this.indices.push(second, first + 1, second + 1);
            }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    toggleInvert() {
        console.log("Inverting faces");
        this.invertFaces = !this.invertFaces;
        this.initBuffers();
    }
}