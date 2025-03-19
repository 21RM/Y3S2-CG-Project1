import {CGFobject, CGFappearance} from '../lib/CGF.js';
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
        this.initMaterials();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
    
        this.initGLBuffers();
    }
    initMaterials() {
    
            // material with high specular component
            //Red
            this.redMaterial = new CGFappearance(this.scene);
            this.redMaterial.setAmbient(0.1, 0.0, 0.0, 1.0);
            this.redMaterial.setDiffuse(0.7, 0.0, 0.0, 1.0);
            this.redMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
            this.redMaterial.setShininess(50.0);  
    
            // Green
            this.greenMaterial = new CGFappearance(this.scene);
            this.greenMaterial.setAmbient(0.0, 0.1, 0.0, 1.0);
            this.greenMaterial.setDiffuse(0.0, 0.7, 0.0, 1.0);
            this.greenMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
            this.greenMaterial.setShininess(50.0);
    
            // Blue
            this.blueMaterial = new CGFappearance(this.scene);
            this.blueMaterial.setAmbient(0.0, 0.0, 0.1, 1.0);
            this.blueMaterial.setDiffuse(0.0, 0.0, 0.7, 1.0);
            this.blueMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
            this.blueMaterial.setShininess(50.0);
    
            // Orange
            this.orangeMaterial = new CGFappearance(this.scene);
            this.orangeMaterial.setAmbient(0.1, 0.05, 0.0, 1.0);
            this.orangeMaterial.setDiffuse(0.7, 0.35, 0.0, 1.0);
            this.orangeMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
            this.orangeMaterial.setShininess(50.0);
    
            // Pink
            this.pinkMaterial = new CGFappearance(this.scene);
            this.pinkMaterial.setAmbient(0.1, 0.075, 0.08, 1.0);
            this.pinkMaterial.setDiffuse(0.7, 0.525, 0.56, 1.0);
            this.pinkMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
            this.pinkMaterial.setShininess(50.0);
    
            // Purple
            this.purpleMaterial = new CGFappearance(this.scene);
            this.purpleMaterial.setAmbient(0.05, 0.0, 0.05, 1.0);
            this.purpleMaterial.setDiffuse(0.35, 0.0, 0.35, 1.0);
            this.purpleMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
            this.purpleMaterial.setShininess(50.0);
    
            // Yellow
            this.yellowMaterial = new CGFappearance(this.scene);
            this.yellowMaterial.setAmbient(0.1, 0.1, 0.0, 1.0);
            this.yellowMaterial.setDiffuse(0.7, 0.7, 0.0, 1.0);
            this.yellowMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
            this.yellowMaterial.setShininess(50.0);
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
        this.scene.customMaterial.apply();
        this.diamond.display();
        this.scene.popMatrix(); 

        this.scene.pushMatrix();
        this.scene.translate(-3.6,2.4,0);
        this.pinkMaterial.apply();
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1,1,0);
        this.scene.rotate(Math.PI, 1, 0, 0); 
        this.yellowMaterial.apply(); 
        this.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1,0,0);
        this.purpleMaterial.apply();
        this.triangleSmall.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(-3.9,0.7,0);
        this.scene.rotate(-Math.PI/4,0,0,1);
        this.redMaterial.apply();
        this.triangleSmall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.4,-0.4,0);
        this.scene.rotate((Math.PI/4), 0, 0, 1); 
        this.blueMaterial.apply();
        this.triangleBig.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(-0.4,2.4,0);
        this.scene.rotate(3*Math.PI/4, 0, 0, 1);
        this.orangeMaterial.apply(); 
        this.triangleBig.display();
        this.scene.popMatrix();

        if (this.scene.displayNormals) {
            this.diamond.enableNormalViz();
            this.triangle.enableNormalViz();
            this.triangleSmall.enableNormalViz();
            this.triangleBig.enableNormalViz();
            this.parallelogram.enableNormalViz();
        } else {
            this.diamond.disableNormalViz();
            this.triangle.disableNormalViz();
            this.triangleSmall.disableNormalViz();
            this.triangleBig.disableNormalViz();
            this.parallelogram.disableNormalViz();
        }
        
    }



}