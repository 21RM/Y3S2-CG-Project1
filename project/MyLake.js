import {CGFobject, CGFappearance, CGFshader, CGFtexture} from '../lib/CGF.js';

import { MySemiSphere } from './MySemiSphere.js';
import { MyQuad } from './MyQuad.js';
import { MyCylinder } from './MyCylinder.js';

export class MyLake extends CGFobject {
    constructor(scene) {
        super(scene);
        
        this.time = 0;

        this.positionX = 140;
        this.positionZ = -80;

        this.radius = 50;

        // BOWL
        this.bowl = new MySemiSphere(this.scene, 50, 30, 100, 1, 0, false, true);

        this.bowlAppearence = new CGFappearance(this.scene);
        this.bowlAppearence.setAmbient(0.0, 0.0, 0.0, 1);
        this.bowlAppearence.setDiffuse(0.8, 0.8, 0.8, 1);
        this.bowlAppearence.setSpecular(0.0, 0.0, 0.0, 1);
        this.bowlAppearence.setShininess(20);
        this.bowlAppearence.setEmission(0.7, 0.7, 0.7, 1);
        this.bowlAppearence.loadTexture("textures/lakeBowl.png");

        // SAND
        this.sand = new MyCylinder(scene, 10, 50, 80.1, 100, 1, true, true, 10, 1);
        this.sandAppearence = new CGFappearance(this.scene);
        this.sandAppearence.setAmbient(0.0, 0.0, 0.0, 1);
        this.sandAppearence.setDiffuse(0.8, 0.8, 0.8, 1);
        this.sandAppearence.setSpecular(0.8, 0.8, 0.8, 1);
        this.sandAppearence.setShininess(200);
        this.sandAppearence.setEmission(1, 1, 1, 1);
        this.sandAppearence.loadTexture("textures/sand.png");
        this.sandAppearence.setTextureWrap('MIRRORED_REPEAT', 'REPEAT');


        // WATER
        this.waterAppearence = new CGFappearance(this.scene);
        this.waterAppearence.setAmbient( 0.0, 0.1, 0.2, 0.8 );
        this.waterAppearence.setDiffuse( 0.2, 0.4, 0.7, 0.8 );
        this.waterAppearence.setSpecular(1.0, 1.0, 1.0, 0.8);
        this.waterAppearence.setShininess(300);
        this.waterTex = new CGFtexture(this.scene, 'textures/water.png');

        this.water = new MyQuad(this.scene, 20, this.waterTex, this.waterAppearence);

        this.waterShader = new CGFshader(this.scene.gl, 'shaders/water.vert', 'shaders/water.frag');
        this.waterShader.setUniformsValues({uSampler: 0});
    }
    
    update(dt) {
        this.time += dt * 0.001;
        this.waterShader.setUniformsValues({ timeFactor: this.time })
    }

    display() {
        const gl = this.scene.gl;

        // BOWL
        this.scene.pushMatrix();
        this.scene.translate(this.positionX, -10, this.positionZ);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.bowlAppearence.apply();
        this.bowl.display();
        this.scene.popMatrix();

        // SAND
        this.scene.pushMatrix();
        this.scene.translate(this.positionX, -10, this.positionZ);
        this.sandAppearence.apply();
        this.sand.display();
        this.scene.popMatrix();

        // WATER
        this.scene.pushMatrix();
        this.scene.translate(this.positionX, -8, this.positionZ);
        this.scene.rotate(-Math.PI/2, 1,0,0);
        this.scene.scale(150, 150, 1);

        this.scene.setActiveShader(this.waterShader);

        this.water.display();

        this.scene.setActiveShader(this.scene.defaultShader);

        this.scene.popMatrix();
    }

    is_above(position){
        const dx = position[0] - this.positionX;
        const dz = position[2] - this.positionZ;
        return (dx*dx + dz*dz) <= (this.radius * this.radius);
    }
}