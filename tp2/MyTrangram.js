import {CGFobject} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js"; 
import { MyTriangleBig } from "./MyTriangleBig.js";
import { MyParallelogram } from "./MyParallelogram.js";

/**
 * MyTrangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTrangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
        this.diamond= new MyDiamond(this.scene);
        this.triangle= new MyTriangle(this.scene);
        this.triangleSmall = new MyTriangleSmall(this.scene);
        this.triangleBig = new MyTriangleBig(this.scene);
        this.parallelogram = new MyParallelogram(this.scene);
    }

    display(){
        this.scene.pushMatrix();
        // Apply translation first
        let translationMatrix = [
            1, 0, 0, 0, 
            0, 1, 0, 0,  
            0, 0, 1, 0,
            -2.5,0.7, 0, 1
        ];
        this.scene.multMatrix(translationMatrix);
        // Apply rotation (45 degrees)
        let angle = Math.PI / 4;
        let rotationMatrix = [
            Math.cos(angle),Math.sin(angle), 0, 0,
            -Math.sin(angle), Math.cos(angle), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        this.scene.multMatrix(rotationMatrix);
    
        this.diamond.display();
        this.scene.popMatrix(); 

        this.scene.pushMatrix();
        this.scene.translate(-3.6,2.4,0);
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1,1,0);
        this.scene.rotate(Math.PI, 1, 0, 0);  
        this.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1,0,0);
        this.triangleSmall.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(-3.9,0.7,0);
        this.scene.rotate(-Math.PI/4,0,0,1);
        this.triangleSmall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.4,-0.4,0);
        this.scene.rotate((Math.PI/4), 0, 0, 1); 
        this.triangleBig.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(-0.4,2.4,0);
        this.scene.rotate(3*Math.PI/4, 0, 0, 1); 
        this.triangleBig.display();
        this.scene.popMatrix();
    }



}