import { CGFobject } from '../lib/CGF.js';

export class MyPrismSolid extends CGFobject {
    /**
     * Creates a solid whose top and bottom faces are rectangles (or general quadrilaterals if extended)
     * defined by 2 side lengths ([width, depth]) and with a given height.
     * @param {CGFscene} scene - The scene.
     * @param {Array<number>} topSides - An array of 2 numbers for the top face. (e.g., [width, depth])
     * @param {Array<number>} bottomSides - An array of 2 numbers for the bottom face.
     * @param {number} height - The vertical height between the top and bottom faces.
     * @param {Array<number>} topSideOffset - An array of 2 numbers for the top face offset. (e.g., [x, z])
     */
    constructor(scene, topSides = [2,4], bottomSides = [2,4], height = 2, topSideOffset = [0,0]) {
        super(scene);
        this.topSides = topSides;
        this.bottomSides = bottomSides;
        this.height = height;
        this.topSideOffsetX = topSideOffset[0];
        this.topSideOffsetZ = topSideOffset[1];
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];


        let widthTop = this.topSides[0];
        let depthTop = this.topSides[1];

        let top_v0 = [-widthTop/2 + this.topSideOffsetX, this.height, -depthTop/2 + this.topSideOffsetZ];
        let top_v1 = [ widthTop/2 + this.topSideOffsetX, this.height, -depthTop/2 + this.topSideOffsetZ];
        let top_v2 = [ widthTop/2 + this.topSideOffsetX, this.height,  depthTop/2 + this.topSideOffsetZ];
        let top_v3 = [-widthTop/2 + this.topSideOffsetX, this.height,  depthTop/2 + this.topSideOffsetZ];

        this.vertices.push(...top_v0, ...top_v1, ...top_v2, ...top_v3);
        for (let i = 0; i < 4; i++) {
            this.normals.push(0, 1, 0);
        }
        this.texCoords.push(0,0, 1,0, 1,1, 0,1);
        this.indices.push(2, 1, 0,    
                          3, 2, 0);


        let widthBot = this.bottomSides[0];
        let depthBot = this.bottomSides[1];
        let bot_v0 = [-widthBot/2, 0, -depthBot/2];
        let bot_v1 = [ widthBot/2, 0, -depthBot/2];
        let bot_v2 = [ widthBot/2, 0,  depthBot/2];
        let bot_v3 = [-widthBot/2, 0,  depthBot/2];

        let bottomStart = this.vertices.length / 3;
        this.vertices.push(...bot_v0, ...bot_v1, ...bot_v2, ...bot_v3);
        for (let i = 0; i < 4; i++) {
            this.normals.push(0, -1, 0);
        }
        this.texCoords.push(0,0, 1,0, 1,1, 0,1);
        this.indices.push(bottomStart+1, bottomStart+2, bottomStart, 
                          bottomStart+2, bottomStart+3, bottomStart);

        let sideFaces = [
            { topA: top_v0, topB: top_v1, botA: bot_v0, botB: bot_v1 },
            { topA: top_v1, topB: top_v2, botA: bot_v1, botB: bot_v2 },
            { topA: top_v2, topB: top_v3, botA: bot_v2, botB: bot_v3 },
            { topA: top_v3, topB: top_v0, botA: bot_v3, botB: bot_v0 },
        ];

        for (let s = 0; s < 4; s++) {
            let face = sideFaces[s];
            let p0 = face.topA;
            let p1 = face.topB;
            let p2 = face.botA;
            let v1 = [p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2]];
            let v2 = [p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2]];
            let nx = v1[1]*v2[2] - v1[2]*v2[1];
            let ny = v1[2]*v2[0] - v1[0]*v2[2];
            let nz = v1[0]*v2[1] - v1[1]*v2[0];
            let len = Math.sqrt(nx*nx+ny*ny+nz*nz);
            nx /= len; ny /= len; nz /= len;
            
            let sideStart = this.vertices.length / 3;
            this.vertices.push(...face.topA, ...face.topB, ...face.botB, ...face.botA);
            for (let i = 0; i < 4; i++) {
                this.normals.push(nx, ny, nz);
            }
            this.texCoords.push(0, 1, 1, 1, 1, 0, 0, 0);
            this.indices.push(sideStart, sideStart+1, sideStart+2, sideStart, sideStart+2, sideStart+3);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
