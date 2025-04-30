// MyBuilding.js
import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyPrismSolid } from './MyPrismSolid.js';
import { MyWindow } from './MyWindow.js';
import { MyPlane } from './MyPlane.js';

export class MyBuilding extends CGFobject {
    constructor(scene, numFloorsSide, windowsPerFloor, color) {
        super(scene);

        this.floorHeight = 30;
        this.numFloorsSide = numFloorsSide;
        this.numFloorsCenter = numFloorsSide + 1;
        this.windowsPerFloor = windowsPerFloor;
        this.color = color;

        this.moduleWidth = 100;
        this.moduleDepth = 100;

        this.appearance = new CGFappearance(scene);
        this.appearance.setAmbient(0.4, 0.4, 0.4, 1);
        this.appearance.setDiffuse(color[0]/255, color[1]/255, color[2]/255, 1);
        this.appearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.appearance.setShininess(8);

        this.left = new MyPrismSolid(scene,
            [this.moduleWidth * 0.75, this.moduleDepth * 0.75],
            [this.moduleWidth * 0.75, this.moduleDepth * 0.75],
            this.floorHeight * this.numFloorsSide
        );

        this.center = new MyPrismSolid(scene,
            [this.moduleWidth, this.moduleDepth],
            [this.moduleWidth, this.moduleDepth],
            this.floorHeight * this.numFloorsCenter
        );

        this.right = new MyPrismSolid(scene,
            [this.moduleWidth * 0.75, this.moduleDepth * 0.75],
            [this.moduleWidth * 0.75, this.moduleDepth * 0.75],
            this.floorHeight * this.numFloorsSide
        );

        this.window = new MyWindow(scene);

        this.door = new MyPrismSolid(scene, [14, 0.2], [14, 0.2], 20);
        this.doorFrameTop = new MyPrismSolid(scene, [17, 0.8], [16, 0.8], 1);
        this.doorFrameSide = new MyPrismSolid(scene, [1, 0.8], [1, 0.8], 20);
        this.sign = new MyPrismSolid(scene, [25, 1], [25, 1], 6);

        this.doorAppearance = new CGFappearance(scene);
        this.doorAppearance.setAmbient(0.3, 0.2, 0.1, 1);
        this.doorAppearance.setDiffuse(0.5, 0.3, 0.2, 1);
        this.doorAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.doorAppearance.setShininess(10);
       // this.doorAppearance.loadTexture("images/door_texture.jpg");
       // this.doorAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');   

       this.doorFrameAppearance = new CGFappearance(scene);
       this.doorFrameAppearance.setAmbient(0.1, 0.1, 0.1, 1);
       this.doorFrameAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
       this.doorFrameAppearance.setSpecular(0.3, 0.3, 0.3, 1);
       this.doorFrameAppearance.setShininess(10);

       this.signAppearance = new CGFappearance(scene);
       this.signAppearance.setAmbient(1, 1, 1, 1);
       this.signAppearance.setDiffuse(1, 1, 1, 1);
       this.signAppearance.setSpecular(0, 0, 0, 1);
       this.signAppearance.setShininess(10);       
       this.signAppearance.loadTexture("textures/bombeiros_sign.jpg");
       this.signAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

    }

    display() {
        const width75 = this.moduleWidth * 0.75;
        const depth75 = this.moduleDepth * 0.75;
        const spacing = this.moduleWidth / 2 + width75 / 2;

        // Left module
        this.scene.pushMatrix();
        this.appearance.apply();
        this.scene.translate(-spacing, 0, 0); 
        this.left.display();
        this.displayWindows( this.numFloorsSide, width75, depth75); 
        this.scene.popMatrix();

        // Center module
        this.scene.pushMatrix();
        this.appearance.apply();
        this.center.display();
        this.displayWindows(this.numFloorsCenter, this.moduleWidth, this.moduleDepth, true);
        this.scene.popMatrix();

        // Right module
        this.scene.pushMatrix();
        this.appearance.apply();
        this.scene.translate(spacing, 0, 0); 
        this.right.display();
        this.displayWindows(this.numFloorsSide, width75, depth75); 
        this.scene.popMatrix();

    }

    displayWindows(floors, width, depth, skipGroundFloor = false) {
        const spacing = width / (this.windowsPerFloor + 1);
        const startFloor = skipGroundFloor ? 1 : 0;
    
        if (skipGroundFloor) {
            // Door frame: top bar
            this.scene.pushMatrix();
            this.scene.translate(0, 20, depth / 2 + 0.2);
            this.doorFrameAppearance.apply();
            this.doorFrameTop.display();
            this.scene.popMatrix();

            // Door frame: left bar
            this.scene.pushMatrix();
            this.scene.translate(-7.5, 0, depth / 2 + 0.2);
            this.doorFrameAppearance.apply();
            this.doorFrameSide.display();
            this.scene.popMatrix();

            // Door frame: right bar
            this.scene.pushMatrix();
            this.scene.translate(7.5, 0, depth / 2 + 0.2);
            this.doorFrameAppearance.apply();
            this.doorFrameSide.display();
            this.scene.popMatrix();

            // Door
            this.scene.pushMatrix();
            this.scene.translate(0, 0, depth / 2 + 0.2);
            this.doorAppearance.apply();
            this.door.display();
            this.scene.popMatrix();

            // Sign
            this.scene.pushMatrix();
            this.scene.translate(0, this.floorHeight , depth / 2 +0.2);
            this.scene.rotate(Math.PI , 1, 0, 0);
            this.signAppearance.apply();
            this.sign.display();
            this.scene.popMatrix();
        }
    
        for (let floor = startFloor; floor < floors; floor++) {
            for (let i = 1; i <= this.windowsPerFloor; i++) {
                this.scene.pushMatrix();
                this.scene.translate(
                    i * spacing - width / 2,
                    floor * this.floorHeight + this.floorHeight / 2,
                    depth / 2 + 0.5
                );
                this.scene.scale(10, 10, 1);
                this.window.display();
                this.scene.popMatrix();
            }
        }
    }
    
    
}