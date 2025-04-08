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

        // Generate vertices, normals, and texture coordinates.
        for (let stack = 0; stack <= this.stacks; stack++) {
            let phi = Math.PI * stack / this.stacks; // angle from 0 to PI
            for (let slice = 0; slice <= this.slices; slice++) {
                let theta = 2 * Math.PI * slice / this.slices; // angle from 0 to 2*PI

                // Spherical coordinates for a unit sphere:
                let x = Math.sin(phi) * Math.cos(theta);
                let y = Math.cos(phi);
                let z = Math.sin(phi) * Math.sin(theta);

                // Save vertex position.
                this.vertices.push(x, y, z);

                // Compute normals. If inverting faces, flip the normals.
                if (this.invertFaces)
                    this.normals.push(-x, -y, -z);
                else
                    this.normals.push(x, y, z);

                // Texture coordinates range linearly from 0 to 1.
                this.texCoords.push(1 - slice / this.slices, stack / this.stacks);
            }
        }

        // Generate indices for triangles.
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
        this.invertFaces = !this.invertFaces;
        this.initBuffers();
    }
}