import { CGFobject } from '../lib/CGF.js';

export class MyBucket extends CGFobject {
    constructor(scene, height = 1, bottomRadius = 1, topRadius = 1, thickness = 0.1, slices = 20, stacks = 1, invert = false, uRepeat = 1, vRepeat = 1) {
        super(scene);
        this.height = height;
        this.bottomRadius = bottomRadius;
        this.topRadius = topRadius;
        this.thickness = thickness;
        this.slices = slices;
        this.stacks = stacks;
        this.invert = invert;
        this.uRepeat = uRepeat;
        this.vRepeat = vRepeat;
        this.innerBottomRadius = bottomRadius - thickness;
        this.innerTopRadius = topRadius - thickness;
        this.initBuffers();
    }

     initBuffers() {
        this.vertices   = [];
        this.normals    = [];
        this.texCoords  = [];
        this.indices    = [];

        // ---- Outer shell ----
        const drOuter     = this.topRadius   - this.bottomRadius;
        const normFactorO = Math.hypot(this.height, drOuter);
        for (let i = 0; i <= this.stacks; i++) {
            const v = i / this.stacks;
            const y = this.height * v;
            const r = this.bottomRadius + drOuter * v;
            for (let j = 0; j <= this.slices; j++) {
                const u = j / this.slices;
                const theta = 2 * Math.PI * u;
                const cosT = Math.cos(theta), sinT = Math.sin(theta);
                this.vertices.push(r * cosT, y, r * sinT);
                this.normals.push((cosT * this.height) / normFactorO, drOuter / normFactorO, (sinT * this.height) / normFactorO);
                this.texCoords.push(u * this.uRepeat, v * this.vRepeat);
            }
        }
        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                const first  = i * (this.slices + 1) + j;
                const second = first + this.slices + 1;
                if (!this.invert) {
                    this.indices.push(first, second, first + 1);
                    this.indices.push(first + 1, second, second + 1);
                } else {
                    this.indices.push(first, first + 1, second);
                    this.indices.push(first + 1, second + 1, second);
                }
            }
        }

        // ---- Inner shell ----
        const innerOffset = this.vertices.length / 3;
        const drInner     = this.innerTopRadius   - this.innerBottomRadius;
        const normFactorI = Math.hypot(this.height, drInner);
        for (let i = 0; i <= this.stacks; i++) {
            const v = i / this.stacks;
            const y = this.height * v;
            const r = this.innerBottomRadius + drInner * v;
            for (let j = 0; j <= this.slices; j++) {
                const u = j / this.slices;
                const theta = 2 * Math.PI * u;
                const cosT = Math.cos(theta), sinT = Math.sin(theta);
                this.vertices.push(r * cosT, y, r * sinT);
                this.normals.push(-(cosT * this.height) / normFactorI, -drInner / normFactorI, -(sinT * this.height) / normFactorI);
                this.texCoords.push((1 - u) * this.uRepeat, v * this.vRepeat);
            }
        }
        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                const first  = innerOffset + i * (this.slices + 1) + j;
                const second = first   + this.slices + 1;
                this.indices.push(first, first + 1, second);
                this.indices.push(first + 1, second + 1, second);
            }
        }

        // === Top Rim Cap ===
        const rimStartIndex = this.vertices.length / 3;
        for (let j = 0; j <= this.slices; j++) {
            const theta = (2 * Math.PI * j) / this.slices;
            const cosT = Math.cos(theta), sinT = Math.sin(theta);

            const xO = this.topRadius * cosT;
            const zO = this.topRadius * sinT;
            this.vertices.push(xO, this.height, zO);
            this.normals.push(0, 1, 0);
            this.texCoords.push((cosT * 0.5 + 0.5) * this.uRepeat, (sinT * 0.5 + 0.5) * this.vRepeat);

            const xI = this.innerTopRadius * cosT;
            const zI = this.innerTopRadius * sinT;
            this.vertices.push(xI, this.height, zI);
            this.normals.push(0, 1, 0);
            this.texCoords.push((cosT * (this.innerTopRadius/this.topRadius) * 0.5 + 0.5) * this.uRepeat, (sinT * (this.innerTopRadius/this.topRadius) * 0.5 + 0.5) * this.vRepeat);
        }

        for (let j = 0; j < this.slices; j++) {
            const o0 = rimStartIndex + j*2;      
            const i0 = rimStartIndex + j*2 + 1;  
            const o1 = rimStartIndex + (j+1)*2;    
            const i1 = rimStartIndex + (j+1)*2 + 1; 

            if (!this.invert) {
                this.indices.push(o0, i1, o1);
                this.indices.push(i1, o0, i0);
            } else {
                this.indices.push(o0, o1, i1);
                this.indices.push(i1, i0, o0);
            }
        }

        // === Bottom Disk Fill ===
        const centerIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5 * this.uRepeat, 0.5 * this.vRepeat);

        for (let j = 0; j <= this.slices; j++) {
            const theta = (2 * Math.PI * j) / this.slices;
            const cosT  = Math.cos(theta), sinT = Math.sin(theta);
            this.vertices.push(this.bottomRadius * cosT, 0, this.bottomRadius * sinT);
            this.normals.push(0, -1, 0);
            this.texCoords.push((cosT * 0.5 + 0.5) * this.uRepeat, (sinT * 0.5 + 0.5) * this.vRepeat);
        }

        for (let j = 0; j < this.slices; j++) {
            const rimIdx = centerIndex + 1 + j;
            const nextRim = centerIndex + 1 + ((j + 1) % this.slices);
            this.indices.push(centerIndex, nextRim, rimIdx);
            this.indices.push(centerIndex, rimIdx, nextRim);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        super.display();
    }
}