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

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}