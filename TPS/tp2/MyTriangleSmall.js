import { CGFobject } from "../lib/CGF.js";

/**
 * MyTriangleSmall
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MyTriangleSmall extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            -1, 0, 0,
            0, 1, 0,
            1, 0, 0
        ];

        this.indices = [
            2, 1, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}