import { CGFobject } from '../lib/CGF.js';

export class MyCylinder extends CGFobject { 
    /**
     * Constructs a cylinder (or truncated cone). 
     * @param {CGFscene} scene - The scene. 
     * @param {number} height - The height of the cylinder. 
     * @param {number} bottomRadius - The radius of the bottom base. 
     * @param {number} topRadius - The radius of the top base. 
     * @param {number} slices - Number of radial divisions. 
     * @param {number} stacks - Number of vertical divisions. 
     */ 
    constructor(scene, height = 1.0, bottomRadius = 1.0, topRadius = 1.0, slices = 20, stacks = 1, invert = false, hide_tb = false, uRepeat = 1, vRepeat = 1) { 
        super(scene); 
        this.height = height; 
        this.bottomRadius = bottomRadius; 
        this.topRadius = topRadius; 
        this.slices = slices; this.stacks = stacks;
        this.invert = invert; 
        this.hide_tb = hide_tb;
        this.uRepeat = uRepeat;
        this.vRepeat = vRepeat;
        this.initBuffers(); 
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const invSign = this.invert ? -1 : 1;
        
        const dr = this.topRadius - this.bottomRadius;

        const normFactor = Math.sqrt(this.height * this.height + dr * dr);
        
        for (let i = 0; i <= this.stacks; i++) {
            let v = i / this.stacks;
            let y = this.height * v;
            let r = this.bottomRadius + dr * v;
            
            for (let j = 0; j <= this.slices; j++) {
                let u = j / this.slices;
                let theta = 2 * Math.PI * u;
                let cosTheta = Math.cos(theta);
                let sinTheta = Math.sin(theta);
                
                let x = r * cosTheta;
                let z = r * sinTheta;
                this.vertices.push(x, y, z);
                
                let nx = (this.height * cosTheta) / normFactor;
                let ny = (-dr) / normFactor;
                let nz = (this.height * sinTheta) / normFactor;
                this.normals.push(nx, ny, nz);
                
                this.texCoords.push(u * this.uRepeat, v * this.vRepeat)
            }
        }
        
        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                let first = i * (this.slices + 1) + j;
                let second = (i + 1) * (this.slices + 1) + j;
                if (!this.invert) {
                    this.indices.push(first, second, first + 1);
                    this.indices.push(first + 1, second, second + 1);
                } else {
                    this.indices.push(first, first + 1, second);
                    this.indices.push(first + 1, second + 1, second);
                }
            }
        }
        
        if (!this.hide_tb && this.bottomRadius > 0) {
            const baseCenterIndex = this.vertices.length / 3;
            this.vertices.push(0, 0, 0);
            this.normals.push(0, -1 * invSign, 0);
            this.texCoords.push(0.5, 0.5);
            for (let j = 0; j < this.slices; j++) {
                const idx0 = j;
                const idx1 = j + 1;
                if (!this.invert) {
                    this.indices.push(idx0, idx1, baseCenterIndex);
                } else {
                    this.indices.push(idx1, idx0, baseCenterIndex);
                }
            }
        }
        
        if (!this.hide_tb && this.topRadius > 0) {
            const topCenterIndex = this.vertices.length / 3;
            this.vertices.push(0, this.height, 0);
            this.normals.push(0, 1 * invSign, 0);
            this.texCoords.push(0.5, 0.5);
            const start = this.stacks * (this.slices + 1);
            for (let j = 0; j < this.slices; j++) {
                const idx0 = start + j;
                const idx1 = start + j + 1;
                if (!this.invert) {
                    this.indices.push(idx1, idx0, topCenterIndex);
                } else {
                    this.indices.push(idx0, idx1, topCenterIndex);
                }
            }
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        const gl = this.scene.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        super.display();
        gl.disable(gl.BLEND);
    }    

}