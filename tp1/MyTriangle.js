import { CGFobject } from "../lib/CGF.js";

/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MyTriangle extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            0, 0, 0,
            2, 0, 0,
            0, 2, 0
        ];

        this.indices = [
			0, 1, 2,
		];

        this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
    }
}