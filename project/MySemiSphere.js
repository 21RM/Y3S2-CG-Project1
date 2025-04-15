import { CGFobject } from '../lib/CGF.js';

export class MySemiSphere extends CGFobject {
    /**
     * Constructs a cockpit as a semisphere (dome) with an aerodynamic nose.
     * @param {CGFscene} scene - The scene.
     * @param {number} radius - Base radius of the dome.
     * @param {number} stacks - Number of horizontal divisions.
     * @param {number} slices - Number of radial divisions.
     * @param {number} noseFactor - Factor by which to elongate the "nose" (front) of the dome. Use values > 1 for elongation.
     * @param {number} noseOffset - Vertical offset for the nose. 
     */
    constructor(scene, radius = 1.0, stacks = 10, slices = 20, noseFactor = 1, noseOffset = 0) {
        super(scene);
        this.radius = radius;
        this.stacks = stacks;
        this.slices = slices;
        this.noseFactor = noseFactor
        this.noseOffset = noseOffset;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (let i = 0; i <= this.stacks; i++) {
            let theta = (Math.PI / 2) * (i / this.stacks);
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let j = 0; j <= this.slices; j++) {
                let phi = (2 * Math.PI) * (j / this.slices);
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                let x = this.radius * sinTheta * cosPhi;
                let y = this.radius * cosTheta;
                let z = this.radius * sinTheta * sinPhi;


                let scale = 1 + (this.noseFactor - 1) * cosTheta;
                y *= scale;
                x += this.noseOffset * cosTheta**2;

                this.vertices.push(x, y, z);

                let nx = sinTheta * cosPhi;
                let ny = cosTheta;
                let nz = sinTheta * sinPhi;
                let len = Math.sqrt(nx * nx + ny * ny + nz * nz);
                this.normals.push(nx / len, ny / len, nz / len);

                let u = j / this.slices;
                let v = i / this.stacks;
                this.texCoords.push(u, v);
            }
        }

        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                let first = i * (this.slices + 1) + j;
                let second = first + this.slices + 1;
                this.indices.push(first + 1, second, first);
                this.indices.push(first + 1, second + 1, second);
            }
        }

        // --- Adding Bottom Cap --- //
        let bottomStart = this.stacks * (this.slices + 1);
        let centerIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 0.5);
        for (let j = 0; j < this.slices; j++) {
            this.indices.push(centerIndex, bottomStart + j, bottomStart + j + 1);
        }
        this.indices.push(centerIndex, bottomStart + this.slices, bottomStart);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}