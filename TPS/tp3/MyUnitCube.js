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
            -0.5, -0.5, -0.5,	//00
            -0.5, -0.5, 0.5,	//10
            0.5, -0.5, 0.5,	    //20
            0.5, -0.5, -0.5,	//30
            -0.5, 0.5, -0.5,    //40
            -0.5, 0.5, 0.5,     //50
            0.5, 0.5, 0.5,      //60
            0.5, 0.5, -0.5,     //70
    //--------------------------//
            -0.5, -0.5, -0.5,	//01
            -0.5, -0.5, 0.5,	//11
            0.5, -0.5, 0.5,	    //21
            0.5, -0.5, -0.5,	//31
            -0.5, 0.5, -0.5,    //41
            -0.5, 0.5, 0.5,     //51
            0.5, 0.5, 0.5,      //61
            0.5, 0.5, -0.5,     //71
    //--------------------------//
            -0.5, -0.5, -0.5,	//02
            -0.5, -0.5, 0.5,	//12
            0.5, -0.5, 0.5,	    //22
            0.5, -0.5, -0.5,	//32
            -0.5, 0.5, -0.5,    //42
            -0.5, 0.5, 0.5,     //52
            0.5, 0.5, 0.5,      //62
            0.5, 0.5, -0.5,     //72
        ];

        this.normals = [
            0, -1, 0 ,   //00
            0, -1, 0 ,   //10
            0, -1, 0 ,   //20
            0, -1, 0 ,   //30
            0, 1, 0 ,    //40
            0, 1, 0 ,    //50
            0, 1, 0 ,    //60
            0, 1, 0 ,    //70
        //--------------------------//
            0, 0, -1 ,   //01
            0, 0, 1 ,    //11
            0, 0, 1 ,    //21
            0, 0, -1 ,   //31
            0, 0, -1 ,   //41
            0, 0, 1 ,    //51
            0, 0, 1 ,    //61
            0, 0, -1 ,   //71
        //--------------------------//
            -1, 0, 0 ,   //02
            -1, 0, 0 ,    //12
            1, 0, 0 ,    //22
            1, 0, 0 ,   //32
            -1, 0, 0 ,   //42
            -1, 0, 0 ,    //52
            1, 0, 0 ,    //62
            1, 0, 0 ,   //72
        ]

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

