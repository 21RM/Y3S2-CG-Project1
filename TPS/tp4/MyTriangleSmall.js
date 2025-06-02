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

        this.normals = [
            0, 0, 1,  // Normal for vertex 0
            0, 0, 1,  // Normal for vertex 1
            0, 0, 1   // Normal for vertex 2
        ];
        

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

    setTexCoords(n) {
        switch(n) {
            case 0:
                this.texCoords = [
                    0,    0,
                    0.25, 0.25,
                    0,    0.5
                ];
                break;
    
            case 1:
                this.texCoords = [
                    0.25, 0.75,
                    0.5,  0.5,
                    0.75, 0.75
                ];
                break;
    
            default:
                this.texCoords = [
                    0, 0,
                    1, 0,
                    0, 1
                ];
                break;
        }
        this.updateTexCoordsGLBuffers();
    }
}