import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            -0.5, -0.5, -0.5,	//0
            -0.5, -0.5, 0.5,	//1
            0.5, -0.5, 0.5,	    //2
            0.5, -0.5, -0.5,	//3
            -0.5, 0.5, -0.5,    //4
            -0.5, 0.5, 0.5,     //5
            0.5, 0.5, 0.5,      //6
            0.5, 0.5, -0.5,     //7
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 3, 2,    //Bottom Face 1
            2, 1, 0,    //Bottom Face 2
            4, 5, 6,    //Top Face 1
            6, 7, 4,    //Top Face 2
            1, 2, 6,    //Front Face 1
            6, 5, 1,    //Front Face 2
            0, 4, 7,    //Back Face 1
            7, 3, 0,    //Back Face 2
            0, 1, 5,    //Left Face 1
            5, 4, 0,    //Left Face 2
            3, 7, 6,    //Right Face 1
            6, 2, 3,    //Right Face 2
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

