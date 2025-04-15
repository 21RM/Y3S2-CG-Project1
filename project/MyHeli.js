import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MySemiSphere } from './MySemiSphere.js';
import { MyCylinder } from './MyCylinder.js';
import { MyPrismSolid } from './MyPrismSolid.js';

export class MyHeli extends CGFobject {
    /** 
     * Constructs a MyHeli object that is, for now, composed of two semispheres back-to-back (a full sphere). 
     * @param {CGFscene} scene - The scene. 
     */ 
    constructor(scene) { 
        super(scene);

        // Cockpit
        this.topSemi = new MySemiSphere(scene, 1, 20, 20, 1.5, 0.3);
        this.bottomSemi = new MySemiSphere(scene, 1, 20, 20, 1.8, -0.4); 
        this.cockpitCylinder = new MyCylinder(scene, 1, 1, 1, 20, 20);

        // Tail
        this.tailCylinder = new MyCylinder(scene, 4, 0.5, 0.1, 20, 20);
        this.tailTipRounder = new MySemiSphere(scene, 0.1, 20, 20, 1.5, 0);
        this.tailPrismTop = new MyPrismSolid(scene, [0.05, 0.2], [0.1, 0.5], 1.2, [0, -1]);
        this.tailPrismBottom = new MyPrismSolid(scene, [0.05, 0.2], [0.1, 0.5], 0.4, [0, -1]);

        // Top rotor
        this.topRotorBaseBottom = new MyPrismSolid(scene, [0.7, 2], [1, 2.8], 0.4, [0, 0]);
        this.topRotorBaseTop = new MyPrismSolid(scene, [0.5, 1.5], [0.5, 2.3], 0.41, [0, 0]);
        this.heliceBase = new MyPrismSolid(scene, [0.3, 0.3], [0.3, 0.3], 0.4, [0, 0]);
        this.heliceCylinder = new MyCylinder(scene, 0.3, 0.1, 0.1, 10, 5);
        this.heliceCylinderTop = new MySemiSphere(scene, 0.15, 10, 10, 1.5, 0);
        this.bladeAttachment = new MyPrismSolid(scene, [0.3, 0.1], [0.1, 0.05], 1, [0, 0]);
        this.blade = new MyPrismSolid(scene, [0.3, 0.1], [0.3, 0.1], 3, [0, 0]);

        // Tail rotor
        this.tailRotorBase = new MyPrismSolid(scene, [0.2, 0.2], [0.2, 0.2], 0.2, [0, 0]);
        this.tailHeliceCylinder = new MyCylinder(scene, 0.25, 0.07, 0.07, 10, 5);
        this.tailHeliceCylinderTop = new MySemiSphere(scene, 0.1, 10, 10, 1.2, 0);

        // Parking feet
        this.parkingFeetSupport = new MyCylinder(scene, 2, 0.05, 0.05, 20, 20);
        this.parkingFeetConnector = new MySemiSphere(scene, 0.05, 20, 20, 1.0, 0);
        this.parkingFeetSupport2 = new MyCylinder(scene, 0.3, 0.05, 0.05, 20, 20);
        this.parkingFeet = new MyCylinder(scene, 3, 0.05, 0.05, 20, 20);

        // ---------------- Materials and Textures ------------------ //

        // default
        this.defaultAppearance = new CGFappearance(this.scene);
        this.defaultAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.defaultAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.defaultAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.defaultAppearance.setShininess(10);

        // front cockpick
        this.cockpitFrontAppearance = new CGFappearance(this.scene);
        this.cockpitFrontAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.cockpitFrontAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.cockpitFrontAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.cockpitFrontAppearance.setShininess(10);
        this.cockpitFrontAppearance.loadTexture("textures/frontCockpit.jpg");

        // middle cylinder cockpit
        this.cockpitCylinderAppearance = new CGFappearance(this.scene);
        this.cockpitCylinderAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.cockpitCylinderAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.cockpitCylinderAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.cockpitCylinderAppearance.setShininess(10);
        this.cockpitCylinderAppearance.loadTexture("textures/cylinderCockpit.jpg");

        // back cockpit
        this.cockpitBackAppearance = new CGFappearance(this.scene);
        this.cockpitBackAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.cockpitBackAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.cockpitBackAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.cockpitBackAppearance.setShininess(10);
        this.cockpitBackAppearance.loadTexture("textures/backCockpit.jpg");

        // tail 
        this.tailAppearence = new CGFappearance(this.scene);
        this.tailAppearance = new CGFappearance(this.scene);
        this.tailAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.tailAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.tailAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.tailAppearance.setShininess(10);
        this.tailAppearance.loadTexture("textures/tail.jpg");

        // top rotor base bottom
        this.topRotorBaseBottomAppearance = new CGFappearance(this.scene);
        this.topRotorBaseBottomAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.topRotorBaseBottomAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.topRotorBaseBottomAppearance.setSpecular(0.5, 0.5, 0.5, 1);
        this.topRotorBaseBottomAppearance.setShininess(10);
        this.topRotorBaseBottomAppearance.loadTexture("textures/topRotorBaseBottom.jpg");

        // top rotor base top
        this.topRotorBaseTopAppearance = new CGFappearance(this.scene);
        this.topRotorBaseTopAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.topRotorBaseTopAppearance.setDiffuse(1, 1, 1, 1);
        this.topRotorBaseTopAppearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.topRotorBaseTopAppearance.setShininess(10);
        this.topRotorBaseTopAppearance.loadTexture("textures/topRotorBaseTop.jpg");

        // metalic
        this.metalicAppearance = new CGFappearance(this.scene);
        this.metalicAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.metalicAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.metalicAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.metalicAppearance.setShininess(10);
        this.metalicAppearance.loadTexture("textures/metal.png");

    }

    display() {
        //  --------------- COCKPIT --------------- // 
        // Front semi-sphere
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.scene.scale(0.9, 1, 1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.cockpitFrontAppearance.apply();
        this.topSemi.display();
        this.scene.popMatrix();

        // Middle cylinder
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.scene.scale(0.9, 1, 1)
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.cockpitCylinderAppearance.apply();
        this.cockpitCylinder.display();
        this.scene.popMatrix();
        
        // Back semi-sphere
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.scale(0.9, 1, 1);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.cockpitBackAppearance.apply();
        this.bottomSemi.display();
        this.scene.popMatrix();

        // --------------- TAIL --------------- //

        // Tail cylinder
        this.scene.pushMatrix();
        this.scene.translate(0, 0.45, -1.5);
        this.scene.scale(0.9, 1, 1);
        this.scene.rotate(-Math.PI*14/30, 1, 0, 0);
        this.tailAppearance.apply();
        this.tailCylinder.display();
        this.scene.popMatrix();

        // Tail cylinder tip rounder
        this.scene.pushMatrix();
        this.scene.translate(0, 0.865, -5.45);
        this.scene.scale(0.9, 1, 1);
        this.scene.rotate(-Math.PI*14/30, 1, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.defaultAppearance.apply();
        this.tailTipRounder.display();
        this.scene.popMatrix();

        // Tail aerodynamic prism top
        this.scene.pushMatrix();
        this.scene.translate(0, 0.865, -5.1);
        this.defaultAppearance.apply();
        this.tailPrismTop.display();
        this.scene.popMatrix();

        // Tail aerodynamic prism bottom
        this.scene.pushMatrix();
        this.scene.translate(0, 0.865, -5);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.tailPrismBottom.display();
        this.scene.popMatrix();
        
        // --------------- Top Rotor --------------- //

        // Top rotor base bottom
        this.scene.pushMatrix();
        this.scene.translate(0, 0.6, -0.35);
        this.topRotorBaseBottomAppearance.apply();
        this.topRotorBaseBottom.display();
        this.scene.popMatrix();

        // Top rotor base top
        this.scene.pushMatrix();
        this.scene.translate(0, 0.85, -0.35);
        this.topRotorBaseTopAppearance.apply();
        this.topRotorBaseTop.display();
        this.scene.popMatrix();

        // Helice base
        this.scene.pushMatrix();
        this.scene.translate(0, 0.9, -0.35);
        this.metalicAppearance.apply();
        this.heliceBase.display();
        this.scene.popMatrix();

        // Helice cylinder
        this.scene.pushMatrix();
        this.scene.translate(0, 1.2, -0.35);
        this.metalicAppearance.apply();
        this.heliceCylinder.display();
        this.scene.popMatrix();

        // Helice cylinder top
        this.scene.pushMatrix();
        this.scene.translate(0, 1.5, -0.35);
        this.metalicAppearance.apply();
        this.heliceCylinderTop.display();
        this.scene.popMatrix();

        // Draw Blades
        this.drawBigHeliceBlade(Math.PI*1/4)
        this.drawBigHeliceBlade(Math.PI*3/4)
        this.drawBigHeliceBlade(Math.PI*5/4)
        this.drawBigHeliceBlade(Math.PI*7/4)

        // --------------- Tail Rotor --------------- //

        // Tail rotor base
        this.scene.pushMatrix();
        this.scene.translate(0.05, 0.75, -5.3);
        this.defaultAppearance.apply();
        this.tailRotorBase.display();
        this.scene.popMatrix();

        // Tail rotor cylinder
        this.scene.pushMatrix();
        this.scene.translate(0.3, 0.85, -5.3);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.tailHeliceCylinder.display();
        this.scene.popMatrix();

        // Tail rotor cylinder top
        this.scene.pushMatrix();
        this.scene.translate(0.3, 0.85, -5.3);
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.tailHeliceCylinderTop.display();
        this.scene.popMatrix();

        // Draw tail rotor blades
        this.drawSmallHeliceBlade(Math.PI*1/4);
        this.drawSmallHeliceBlade(Math.PI*3/4);
        this.drawSmallHeliceBlade(Math.PI*5/4);
        this.drawSmallHeliceBlade(Math.PI*7/4);


        // --------------- Parking Feet --------------- //

        // Right Back Parking Feet Support
        this.scene.pushMatrix();
        this.scene.translate(0.6, -1.2, -1);
        this.scene.rotate(Math.PI*1/4, 0, 0, 1);
        this.scene.rotate(Math.PI/16, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetSupport.display();
        this.scene.popMatrix();

        // Right Back Parking Feet Connector
        this.scene.pushMatrix();
        this.scene.translate(0.6, -1.2, -1);
        this.scene.rotate(Math.PI*5/4, 0, 0, 1);
        this.scene.rotate(Math.PI*-1/16, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetConnector.display();
        this.scene.popMatrix();

        // Left Back Parking Feet Support
        this.scene.pushMatrix();
        this.scene.translate(-0.6, -1.2, -1);
        this.scene.rotate(-Math.PI*1/4, 0, 0, 1);
        this.scene.rotate(Math.PI/16, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetSupport.display();
        this.scene.popMatrix();

        // Left Back Parking Feet Connector
        this.scene.pushMatrix();
        this.scene.translate(-0.6, -1.2, -1);
        this.scene.rotate(-Math.PI*5/4, 0, 0, 1);
        this.scene.rotate(Math.PI*-1/16, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetConnector.display();
        this.scene.popMatrix();

        // Right Front Parking Feet Support
        this.scene.pushMatrix();
        this.scene.translate(0.6, -1.2, 1);
        this.scene.rotate(Math.PI*1/4, 0, 0, 1);
        this.scene.rotate(-Math.PI/16, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetSupport.display();
        this.scene.popMatrix();

        // Right Front Parking Feet Connector
        this.scene.pushMatrix();
        this.scene.translate(0.6, -1.2, 1);
        this.scene.rotate(Math.PI*5/4, 0, 0, 1);
        this.scene.rotate(Math.PI*1/16, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetConnector.display();
        this.scene.popMatrix();

        // Left Front Parking Feet Support
        this.scene.pushMatrix();
        this.scene.translate(-0.6, -1.2, 1);
        this.scene.rotate(-Math.PI*1/4, 0, 0, 1);
        this.scene.rotate(-Math.PI/16, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetSupport.display();
        this.scene.popMatrix();

        // Left Front Parking Feet Connector
        this.scene.pushMatrix();
        this.scene.translate(-0.6, -1.2, 1);
        this.scene.rotate(-Math.PI*5/4, 0, 0, 1);
        this.scene.rotate(Math.PI*1/16, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetConnector.display();
        this.scene.popMatrix();

        // Right Back Parking Feet Support 2
        this.scene.pushMatrix();
        this.scene.translate(0.6, -1.5, -1);
        this.metalicAppearance.apply();
        this.parkingFeetSupport2.display();
        this.scene.popMatrix();

        // Left Back Parking Feet Support 2
        this.scene.pushMatrix();
        this.scene.translate(-0.6, -1.5, -1)
        this.metalicAppearance.apply();
        this.parkingFeetSupport2.display();
        this.scene.popMatrix();

        // Right Front Parking Feet Support 2
        this.scene.pushMatrix();
        this.scene.translate(0.6, -1.5, 1);
        this.metalicAppearance.apply();
        this.parkingFeetSupport2.display();
        this.scene.popMatrix();

        // Left Front Parking Feet Support 2
        this.scene.pushMatrix();
        this.scene.translate(-0.6, -1.5, 1)
        this.metalicAppearance.apply();
        this.parkingFeetSupport2.display();
        this.scene.popMatrix();

        // Right Parking Foot
        this.scene.pushMatrix();
        this.scene.translate(0.6, -1.5, -1.5);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeet.display();
        this.scene.popMatrix()

        // Left Parking Foot
        this.scene.pushMatrix();
        this.scene.translate(-0.6, -1.5, -1.5);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeet.display();
        this.scene.popMatrix()

        // Right Parking Foot Connector Front
        this.scene.pushMatrix();
        this.scene.translate(0.6, -1.5, 1.5);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetConnector.display();
        this.scene.popMatrix();

        // Left Parking Foot Connector Front
        this.scene.pushMatrix();
        this.scene.translate(-0.6, -1.5, 1.5);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetConnector.display();
        this.scene.popMatrix();

        // Right Parking Foot Connector Back
        this.scene.pushMatrix();
        this.scene.translate(-0.6, -1.5, -1.5);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetConnector.display();
        this.scene.popMatrix();

        // Left Parking Foot Connector Back
        this.scene.pushMatrix();
        this.scene.translate(0.6, -1.5, -1.5);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetConnector.display();
        this.scene.popMatrix();

        // Right Foot Curve
        this.scene.pushMatrix();
        this.scene.translate(0.6, -1.5, 1.5);
        this.scene.rotate(Math.PI/4, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetSupport2.display();
        this.scene.popMatrix();

        // Left Foot Curve
        this.scene.pushMatrix();
        this.scene.translate(-0.6, -1.5, 1.5);
        this.scene.rotate(Math.PI/4, 1, 0, 0)
        this.metalicAppearance.apply();
        this.parkingFeetSupport2.display();
        this.scene.popMatrix();

        // Right Foot Curve Connector
        this.scene.pushMatrix();
        this.scene.translate(0.6, -1.5+0.3*Math.cos(Math.PI/4), 1.5+0.3*Math.cos(Math.PI/4));
        this.scene.rotate(Math.PI/4, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetConnector.display();
        this.scene.popMatrix();

        // Left Foot Curve Connector
        this.scene.pushMatrix();
        this.scene.translate(-0.6, -1.5+0.3*Math.cos(Math.PI/4), 1.5+0.3*Math.cos(Math.PI/4));
        this.scene.rotate(Math.PI/4, 1, 0, 0);
        this.metalicAppearance.apply();
        this.parkingFeetConnector.display();
        this.scene.popMatrix();
    }



    drawBigHeliceBlade(rotation) {
        this.scene.pushMatrix();
        this.scene.translate(0, 1.4, -0.35);
        this.scene.rotate(rotation, 0, 1, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.defaultAppearance.apply();
        this.bladeAttachment.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(Math.sin(rotation), 1.4, Math.cos(rotation) - 0.35);
        this.scene.rotate(rotation, 0, 1, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.defaultAppearance.apply();
        this.blade.display();
        this.scene.popMatrix();
    }

    drawSmallHeliceBlade(rotation) {
        this.scene.pushMatrix();
        this.scene.translate(0.225, 0.85, -5.3);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.rotate(rotation, 0, 0, 1);
        this.scene.scale(0.3, 0.3, 0.3);
        this.defaultAppearance.apply();
        this.bladeAttachment.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.225, 0.3*Math.cos(rotation) + 0.85, 0.3*Math.sin(rotation) - 5.3);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.rotate(rotation, 0, 0, 1);
        this.scene.scale(0.3, 0.15, 0.3);
        this.defaultAppearance.apply();
        this.blade.display();
        this.scene.popMatrix();
    }
}