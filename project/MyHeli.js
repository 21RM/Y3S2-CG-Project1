import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MySemiSphere } from './MySemiSphere.js';
import { MyCylinder } from './MyCylinder.js';
import { MyPrismSolid } from './MyPrismSolid.js';

export class MyHeli extends CGFobject {
    /** 
     * Constructs a MyHeli object that is, for now, composed of two semispheres back-to-back (a full sphere). 
     * @param {CGFscene} scene - The scene. 
     */ 
    constructor(scene, position = [0, 0, 0], rotation = 0, velocity = [0, 0, 0]) { 
        super(scene);

        // heli variables
        this.heliScale = vec3.fromValues(4, 4, 4);
        this.hasWater = false;
        this.counter = 0;

        // Movement Variables
        this.baseFlyingHeight = null;
        this.position = position;
        this.rotation = rotation;
        this.rotationSpeed = 0;
        this.velocity = velocity;
        this.velocityY = velocity[1];
        this.acelerationY = 0;
        this.brake = -0.05;
        this.maxSpeed = 5;
        this.parked = true;
        this.parking = false;
        this.parkingBrakeInitiated = false;
        this.parkingStep = 0;
        this.pointingToHelipad = false;
        this.aboveHelipad = false;
        this.isOff = false;
        this.takingOff = false;
        this.descending = false;
        this.breaking = false;
        this.gravity = 0.1;
        this.pitch = 0; 
        this.roll  = 0;
        this._targetPitch = 0;
        this._targetRoll  = 0;
        this.hoverWobbleAngle = 0;   // running phase for the sine wave
        this.hoverWobbleAmp   = 0.4; // max ±0.2 units up/down
        this.hoverWobbleFreq  = 0.005; // controls speed of the wobble

        // Movement variables related with keyboard
        this.dir = [0, 0];
        this.turnInput = 0;
        this.wx = 0;  //world x
        this.wy = 0;  //world z

        // Variables Conected to my interface
        this.motorPower = 2;
        this.cruiseHeight = 30;
        this.maxSpeed = 0.05

        // Variables conected to my building
        this.helipadPos = vec3.fromValues(0,0,0);
        


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
        this.topRotorAngle = Math.PI/4;
        this.topRotorAngleSpeed = 0;

        // Tail rotor
        this.tailRotorBase = new MyPrismSolid(scene, [0.15, 0.15], [0.15, 0.15], 0.2, [0, 0]);
        this.tailHeliceCylinder = new MyCylinder(scene, 0.25, 0.07, 0.07, 10, 5);
        this.tailHeliceCylinderTop = new MySemiSphere(scene, 0.1, 10, 10, 1.2, 0);
        this.tailRotorAngle = Math.PI/4;
        this.tailRotorAngleSpeed = 0;

        // Parking feet
        this.parkingFeetSupport = new MyCylinder(scene, 2, 0.05, 0.05, 20, 20);
        this.parkingFeetConnector = new MySemiSphere(scene, 0.05, 20, 20, 1.0, 0);
        this.parkingFeetSupport2 = new MyCylinder(scene, 0.3, 0.05, 0.05, 20, 20);
        this.parkingFeet = new MyCylinder(scene, 3, 0.05, 0.05, 20, 20);

        // ---------------- Materials and Textures ------------------ //

        // default
        this.defaultAppearance = new CGFappearance(this.scene);
        this.defaultAppearance.setAmbient(0.0, 0.0, 0.0, 1);
        this.defaultAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
        this.defaultAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.defaultAppearance.setShininess(300);

        //heli red
        this.heliRedAppearance = new CGFappearance(this.scene);
        this.heliRedAppearance.setAmbient(0.0, 0.0, 0.0, 1);
        this.heliRedAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
        this.heliRedAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.heliRedAppearance.setShininess(300);
        this.heliRedAppearance.loadTexture("textures/helicopterRed.png");

        // front cockpick
        this.cockpitFrontAppearance = new CGFappearance(this.scene);
        this.cockpitFrontAppearance.setAmbient(0.0, 0.0, 0.0, 1);
        this.cockpitFrontAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
        this.cockpitFrontAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.cockpitFrontAppearance.setShininess(300);
        this.cockpitFrontAppearance.loadTexture("textures/frontCockpit.jpg");

        // middle cylinder cockpit
        this.cockpitCylinderAppearance = new CGFappearance(this.scene);
        this.cockpitCylinderAppearance.setAmbient(0.0, 0.0, 0.0, 1);
        this.cockpitCylinderAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
        this.cockpitCylinderAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.cockpitCylinderAppearance.setShininess(300);
        this.cockpitCylinderAppearance.loadTexture("textures/cylinderCockpit.jpg");

        // back cockpit
        this.cockpitBackAppearance = new CGFappearance(this.scene);
        this.cockpitBackAppearance.setAmbient(0.0, 0.0, 0.0, 1);
        this.cockpitBackAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
        this.cockpitBackAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.cockpitBackAppearance.setShininess(300);
        this.cockpitBackAppearance.loadTexture("textures/backCockpit.jpg");

        // tail 
        this.tailAppearence = new CGFappearance(this.scene);
        this.tailAppearance = new CGFappearance(this.scene);
        this.tailAppearance.setAmbient(0.0, 0.0, 0.0, 1);
        this.tailAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
        this.tailAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.tailAppearance.setShininess(300);
        this.tailAppearance.loadTexture("textures/tail.jpg");

        // tail top prism
        this.tailTopPrismAppearance = new CGFappearance(this.scene);
        this.tailTopPrismAppearance.setAmbient(0.0, 0.0, 0.0, 1);
        this.tailTopPrismAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
        this.tailTopPrismAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.tailTopPrismAppearance.setShininess(300);
        this.tailTopPrismAppearance.loadTexture("textures/tailPrismTop.jpg");

        // top rotor base bottom
        this.topRotorBaseBottomAppearance = new CGFappearance(this.scene);
        this.topRotorBaseBottomAppearance.setAmbient(0.0, 0.0, 0.0, 1);
        this.topRotorBaseBottomAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
        this.topRotorBaseBottomAppearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.topRotorBaseBottomAppearance.setShininess(300);
        this.topRotorBaseBottomAppearance.loadTexture("textures/topRotorBaseBottom.jpg");

        // top rotor base top
        this.topRotorBaseTopAppearance = new CGFappearance(this.scene);
        this.topRotorBaseTopAppearance.setAmbient(0.0, 0.0, 0.0, 1);
        this.topRotorBaseTopAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
        this.topRotorBaseTopAppearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.topRotorBaseTopAppearance.setShininess(300);
        this.topRotorBaseTopAppearance.loadTexture("textures/topRotorBaseTop.jpg");

        // metalic
        this.metalicAppearance = new CGFappearance(this.scene);
        this.metalicAppearance.setAmbient(0.0, 0.0, 0.0, 1);
        this.metalicAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
        this.metalicAppearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.metalicAppearance.setShininess(300);
        this.metalicAppearance.loadTexture("textures/metal.png");

        // helice
        this.heliceAppearance = new CGFappearance(this.scene);
        this.heliceAppearance.setAmbient(0.0, 0.0, 0.0, 1);
        this.heliceAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
        this.heliceAppearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.heliceAppearance.setShininess(300);
        this.heliceAppearance.loadTexture("textures/helice.jpg");

    }



    display() {
        // MAIN Movement Matrix
        this.scene.pushMatrix();
        this.scene.translate(this.position[0], this.position[1], this.position[2]);
        this.scene.scale(this.heliScale[0], this.heliScale[1], this.heliScale[2]);
        this.scene.rotate(this.rotation, 0, 1, 0);
        this.scene.rotate(this.pitch, 1,0,0);
        this.scene.rotate(this.roll, 0,0,1);



        // --------------- COCKPIT --------------- // 
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
        this.heliRedAppearance.apply();
        this.tailTipRounder.display();
        this.scene.popMatrix();

        // Tail aerodynamic prism top
        this.scene.pushMatrix();
        this.scene.translate(0, 0.865, -5.1);
        this.tailTopPrismAppearance.apply();
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
        this.heliceAppearance.apply();
        this.heliceCylinder.display();
        this.scene.popMatrix();

        // Helice cylinder top
        this.scene.pushMatrix();
        this.scene.translate(0, 1.5, -0.35);
        this.metalicAppearance.apply();
        this.heliceCylinderTop.display();
        this.scene.popMatrix();

        // Draw Blades
        for (let i = 0; i < 4; i++) {
            this.drawBigHeliceBlade(this.topRotorAngle + i * (Math.PI * 2 / 4));
        }

        // --------------- Tail Rotor --------------- //

        // Tail rotor base
        this.scene.pushMatrix();
        this.scene.translate(0.05, 0.75, -5.3);
        this.metalicAppearance.apply();
        this.tailRotorBase.display();
        this.scene.popMatrix();

        // Tail rotor cylinder
        this.scene.pushMatrix();
        this.scene.translate(0.3, 0.85, -5.3);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.heliceAppearance.apply();
        this.tailHeliceCylinder.display();
        this.scene.popMatrix();

        // Tail rotor cylinder top
        this.scene.pushMatrix();
        this.scene.translate(0.3, 0.85, -5.3);
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.metalicAppearance.apply();
        this.tailHeliceCylinderTop.display();
        this.scene.popMatrix();

        // Draw tail rotor blades
        for (let i = 0; i < 4; i++) {
            this.drawSmallHeliceBlade(this.tailRotorAngle + i * (Math.PI * 2 / 4));
        }


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


        // MAIN Movement Matrix
        this.scene.popMatrix();
    }



    drawBigHeliceBlade(rotation) {
        this.scene.pushMatrix();
        this.scene.translate(0, 1.4, -0.35);
        this.scene.rotate(rotation, 0, 1, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.heliceAppearance.apply();
        this.bladeAttachment.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(Math.sin(rotation), 1.4, Math.cos(rotation) - 0.35);
        this.scene.rotate(rotation, 0, 1, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.heliceAppearance.apply();
        this.blade.display();
        this.scene.popMatrix();
    }

    drawSmallHeliceBlade(rotation) {
        this.scene.pushMatrix();
        this.scene.translate(0.225, 0.85, -5.3);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.rotate(rotation, 0, 0, 1);
        this.scene.scale(0.3, 0.3, 0.3);
        this.heliceAppearance.apply();
        this.bladeAttachment.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.225, 0.3*Math.cos(rotation) + 0.85, 0.3*Math.sin(rotation) - 5.3);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.rotate(rotation, 0, 0, 1);
        this.scene.scale(0.3, 0.15, 0.3);
        this.heliceAppearance.apply();
        this.blade.display();
        this.scene.popMatrix();
    }


    update(timeDelta) {
        if (this.parking) this.park(timeDelta);
        if (this.takingOff) this.take_off(timeDelta);
        if (this.isOff) {
            this.accelerate(this.dir, timeDelta);
            this.turn(this.turnInput, timeDelta);
            this.hoverWobbleAngle += timeDelta * this.hoverWobbleFreq;
            this.position[1] = this.baseFlyingHeight + Math.sin(this.hoverWobbleAngle) * this.hoverWobbleAmp;
            this.position[0] += this.velocity[0] * timeDelta;
            this.position[2] += this.velocity[2] * timeDelta;
            this.rotation += this.rotationSpeed * timeDelta;
        } else if (this.takingOff) {
            if (this.descending) {
                this.position[1] = Math.max(this.position[1] + this.velocityY, this.helipadPos[1] + this.cruiseHeight);
            } else {
                this.position[1] = Math.min(this.position[1] + this.velocityY, this.helipadPos[1] + this.cruiseHeight);
            }
        }
        if (this.parked) {
            this.turn(0, timeDelta);
        }

        this.topRotorAngle += this.topRotorAngleSpeed % (2*Math.PI);
        this.tailRotorAngle += this.tailRotorAngleSpeed % (2*Math.PI);
    }


    turn(turnInput, timeDelta) {
        const accelRate = this.motorPower / 2000;
        if (turnInput !== 0) {
            this.tailRotorAngleSpeed += accelRate * timeDelta * turnInput;
            this.tailRotorAngleSpeed = Math.max(-0.5, Math.min(0.5, this.tailRotorAngleSpeed));
            this.rotationSpeed += (accelRate * turnInput)/30;
            this.rotationSpeed = Math.max(-0.001, Math.min(0.001, this.rotationSpeed));
        } else {
            const decel = accelRate * timeDelta;
            if (this.tailRotorAngleSpeed > 0) {
                this.tailRotorAngleSpeed = Math.max(0, this.tailRotorAngleSpeed - decel/1.5);
            } else if (this.tailRotorAngleSpeed < 0) {
                this.tailRotorAngleSpeed = Math.min(0, this.tailRotorAngleSpeed + decel/1.5);
            }
            if (this.rotationSpeed > 0) {
                this.rotationSpeed = Math.max(0, this.rotationSpeed - decel/600);
            } else if (this.rotationSpeed < 0) {
                this.rotationSpeed = Math.min(0, this.rotationSpeed + decel/600);
            }
        }
    }


    accelerate(dir, timeDelta) {
        const [ix, iz] = dir;
        if (ix===0 && iz===0) {
            this._targetPitch = 0;
            this._targetRoll  = 0;
        } else {
            const MAX_TILT = Math.PI/12;
            this._targetPitch = iz * MAX_TILT;
            this._targetRoll  =  ix * MAX_TILT;
        }

        const SMOOTH = 0.05;
        this.pitch += (this._targetPitch - this.pitch) * SMOOTH;
        this.roll  += (this._targetRoll  - this.roll ) * SMOOTH;

        const yaw = this.rotation;
        const fx =  Math.sin(yaw), fz =  Math.cos(yaw);
        const rx = -Math.cos(yaw), rz = Math.sin(yaw);

        this.wx = (fx*iz + rx*ix);
        this.wz = (fz*iz + rz*ix);

        const dx = Math.sin(yaw);
        const dz = Math.cos(yaw);
        const d = [dx, dz];
        const d90 = [dz, -dx]

        const vx = this.velocity[0];
        const vz = this.velocity[2];

        this.velocityXZ = [vx, vz];

        const decel = (Math.abs(this.brake) / 1000) * timeDelta; 
        
        if (ix !== 0 || iz !== 0) {
            this.velocity[0] += this.wx * (this.motorPower / 2000);
            this.velocity[2] += this.wz * (this.motorPower / 2000);
            const speed = Math.hypot(this.velocity[0], this.velocity[2]);
            if (speed > this.maxSpeed) {
                const factor = this.maxSpeed / speed;
                this.velocity[0] = this.velocity[0] * factor;
                this.velocity[2] = this.velocity[2] * factor;
            }

        } 
        if (ix === 0) {
            const dot = vx*d90[0] + vz*d90[1];
            const brakeDir = dot > 0 ? d90 : [-d90[0], -d90[1]];
            const sideSpeed = Math.abs(dot);
            const actualDecel = Math.min(decel, sideSpeed);

            this.velocity[0] -= brakeDir[0] * actualDecel;
            this.velocity[2] -= brakeDir[1] * actualDecel;
        }
        if (iz === 0) {
            const dotF = vx*d[0] + vz*d[1];

            const brakeDirF = dotF > 0 ? d : [-d[0], -d[1]];

            const fwdSpeed = Math.abs(dotF);
            const actualDecelF = Math.min(decel, fwdSpeed);

            this.velocity[0] -= brakeDirF[0] * actualDecelF;
            this.velocity[2] -= brakeDirF[1] * actualDecelF;
        }
    }

    take_off(timeDelta) {
        let heightObjective = this.position[1] - (this.cruiseHeight+this.helipadPos[1]);
        if (this.cruiseHeight != 0){
            if (heightObjective < 0) {
                this.topRotorAngleSpeed = Math.min(this.topRotorAngleSpeed + (this.motorPower/20000) * timeDelta, this.cruiseHeight/60);
            } else {
                this.topRotorAngleSpeed = Math.max(this.topRotorAngleSpeed - (this.motorPower/20000) * timeDelta, this.cruiseHeight/60);
            }
        }
        else {
            const decel = (this.motorPower / 20000) * timeDelta;
            this.topRotorAngleSpeed = Math.max(0, this.topRotorAngleSpeed - decel);
        }

        if ((this.position[1] <= (this.cruiseHeight+this.helipadPos[1]) + (this.velocityY * this.velocityY) / (2 * this.brake)) && !this.breaking) {
            this.descending = false;
            this.acelerationY = Math.max((this.topRotorAngleSpeed - this.gravity*3)*timeDelta, 0) / 300;
            this.velocityY += this.acelerationY;
        } 
        else if ((this.position[1] >= (this.cruiseHeight+this.helipadPos[1]) - (this.velocityY * this.velocityY) / (2 * this.brake)) && !this.breaking){
            this.descending = true;
            this.acelerationY = Math.min((-this.topRotorAngleSpeed + this.gravity*3)*timeDelta, 0) / 100;
            this.velocityY += this.acelerationY;
        }
        else {
            this.breaking = true;
            this.descending == false ? this.acelerationY = this.brake : this.acelerationY = -this.brake;
            this.descending == false ? this.velocityY = Math.max(this.velocityY + this.acelerationY, 0.03) : this.velocityY = Math.min(this.velocityY + this.acelerationY, -0.03);
            if (Math.abs(this.position[1] - (this.cruiseHeight+this.helipadPos[1])) < 0.001){
                this.position[1] = (this.cruiseHeight+this.helipadPos[1]);
                if (this.cruiseHeight != 0) {
                    this.isOff = true;
                    this.takingOff = false;
                }
                this.breaking = false;
                this.baseFlyingHeight = this.helipadPos[1] + this.cruiseHeight;
            }
        }
    }

    stayOnHelipad(helipadPos){
        if (!(this.isOff || this.takingOff) || this.parked) {
            this.position = vec3.clone(helipadPos);
            this.position[1] += 1.65 * this.heliScale[1];
            this.baseFlyingHeight = this.helipadPos[1] + this.cruiseHeight;
        }
        this.helipadPos = vec3.clone(helipadPos);
        this.helipadPos[1] += 1.65 * this.heliScale[1];
        this.handleLpress();
        this.handleLpress();
    }

    handleLpress(){
        if (this.parking_step != 5) {
            this.parking = !this.parking
            this.parkingStep = 0;
            this.dir = [0, 0];
            this.turnInput = 0;
        }
    }

    park(timeDelta) {
        switch (this.parkingStep){
            case 0: //STABILIZE
                if (this.heliIsStabilized()){
                    this.parkingStep = 1;
                }
                break;
            case 1: //ROTATE
                if ((!this.pointingToHelipad || !this.heliIsStabilized()) && !this.parked){
                    this.rotateToHelipad(timeDelta);
                } else {
                    this.turnInput = 0;
                    this.parkingStep = 2;
                    this.pointingToHelipad = false;
                }
                break;
            case 2: //ADJUST HEIGHT
                if (this.counter == 0) {
                    this.takingOff = true;
                    this.isOff = false
                    this.cruiseHeight = 30;
                    this.counter += 1;
                }
                if (!this.takingOff){
                    this.parkingStep = 3;
                    this.counter = 0;
                }
                break;
            case 3: //GOTO HELIPAD
                if (!this.aboveHelipad || !this.heliIsStabilized()){
                    this.moveToHelipad(timeDelta);
                } else {
                    this.dir = [0,0];
                    this.parkingStep = 4;
                    this.aboveHelipad = false;
                }
                break;
            case 4: //ROTATE AGAIN
                if (!(this.rotation == Math.PI)){
                    this.rotateToHelipad(timeDelta, true)
                } else {
                    this.turnInput = 0;
                    this.parkingStep = 5;
                    this.pointingToHelipad = false;
                }
                break;
            case 5: //PARK
                if (this.counter == 0) {
                    this.takingOff = true;
                    this.isOff = false
                    this.cruiseHeight = 0;
                    this.counter += 1;
                }
                this.turn(this.turnInput, timeDelta);
                if (this.velocityY <= 0.5){
                    this.parked = true;
                }
                if (this.topRotorAngleSpeed == 0){
                    this.parking = false;
                    this.parked = true;

                    this.velocityY = 0;
                    this.acelerationY = 0;
                    this.descending = false;
                    this.breaking = false;

                    this.isOff = false;
                    this.takingOff = false;
                    this.cruiseHeight = 30;
                    this.counter = 0;
                }
                break;
            default:
                break;
        }
    }

    heliIsStabilized(){
        return ((this.velocity[0] == 0) && (this.velocity[2] == 0) && (this.rotationSpeed == 0));
    }

    rotateToHelipad(timeDelta, origin=false) {
        const dx = this.helipadPos[0] - this.position[0];
        const dz = this.helipadPos[2] - this.position[2]
        const targetYaw = origin ? Math.PI : Math.atan2(dx, dz);

        let delta = targetYaw - this.rotation;
        delta = ((delta + Math.PI) % (2*Math.PI) + 2*Math.PI) % (2*Math.PI) - Math.PI;

        const accelRate = this.motorPower / 2000;
        const alpha = accelRate / 600;

        const brakeDist  = (this.rotationSpeed * this.rotationSpeed) / (2 * alpha);

        if (Math.abs(delta) > brakeDist) {
            this.turnInput = delta > 0 ?  1 : -1;
        } else {
            this.turnInput = 0;
        }

        this.turn(this.turnInput, timeDelta);

        const ANGLE_TOL = 0.005;
        const SPEED_TOL = 0.0001;
        if (Math.abs(delta) < ANGLE_TOL && Math.abs(this.rotationSpeed) < SPEED_TOL) {
            this.rotation = targetYaw;
            this.rotationSpeed = 0;
            this.pointingToHelipad = true;
            this.turnInput = 0;
        }
    }

    moveToHelipad(timeDelta) {
        const dx = this.helipadPos[0] - this.position[0];
        const dz = this.helipadPos[2] - this.position[2];
        const dist = Math.hypot(dx, dz);

        const speed = Math.hypot(this.velocity[0], this.velocity[2]);

        const decelRate = (Math.abs(this.brake) / 1000);
        const brakeDist = (speed * speed / (2 * decelRate));

        if (dist > brakeDist) {
            this.dir = [0, 1];
        } else {
            this.dir = [0, 0];
        }

        this.accelerate(this.dir, timeDelta);

        const POS_TOL = 0.1; 
        if (dist < POS_TOL) {
            this.position[0] = this.helipadPos[0];
            this.position[2] = this.helipadPos[2];
            this.velocity[0] = 0;
            this.velocity[2] = 0;
            this.dir = [0, 0];
            this.parkingStep = 4;
        }
    }
}