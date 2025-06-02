import { CGFobject } from "../lib/CGF.js";

/**
 * MyTriangleBig
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MyTriangleBig extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            -2, 0, 0,
            0, 2, 0,
            2, 0, 0
        ];

        this.indices = [
            2, 1, 0
        ];

        this.normals = [
            0, 0, 1,  // Normal for vertex 0
            0, 0, 1,  // Normal for vertex 1
            0, 0, 1   // Normal for vertex 2
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}