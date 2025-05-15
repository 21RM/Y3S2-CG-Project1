// MyBuilding.js
import { CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
import { MyPrismSolid } from './MyPrismSolid.js';
import { MyWindow } from './MyWindow.js';
import { MyCylinder } from './MyCylinder.js';
import { MyQuad } from './MyQuad.js';

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

        // after you set up this.appearance for the color, add:
        this.wallAppearance = new CGFappearance(scene);
        this.wallAppearance.setAmbient (0.3, 0.3, 0.3, 1);
        this.wallAppearance.setDiffuse (0.8, 0.8, 0.8, 1);
        this.wallAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.wallAppearance.setShininess(20);
        this.wallAppearance.loadTexture('textures/side_buildings.jpg');
        this.wallAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

        this.centerAppearance = new CGFappearance(scene);
        this.centerAppearance.setAmbient (0.3, 0.3, 0.3, 1);
        this.centerAppearance.setDiffuse (0.8, 0.8, 0.8, 1);
        this.centerAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.centerAppearance.setShininess(20);
        this.centerAppearance.loadTexture('textures/middle_building.jpg');
        this.centerAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');


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

        const heliRadius = this.moduleWidth * 0.3;
        const heliHeight = 1;

        this.heliPort = new MyCylinder(
            scene,
            heliHeight,     
            heliRadius,     
            heliRadius,     
            64,            
            1              
            );

        this.helipadTex = new CGFtexture(scene, 'textures/helipad.png');

        this.windowTextures = [
          'textures/window_first.png', 
          'textures/window_glass_reflective.png', 
          'textures/window_sky_first.png',
          'textures/window_sky_middle.png',
          'textures/window_sky_last.png',
          'textures/window_sky_last.png',
         
        ];
        this.windowsByFloor = this.windowTextures.map(
          path => new MyWindow(scene, path)
        );

        this.door = new MyPrismSolid(scene, [14, 0.2], [14, 0.2], 20);
        this.doorFrameTop = new MyPrismSolid(scene, [17, 0.8], [16, 0.8], 1);
        this.doorFrameSide = new MyPrismSolid(scene, [1, 0.8], [1, 0.8], 20);
        this.sign = new MyPrismSolid(scene, [25, 1], [25, 1], 6);

        this.doorAppearance = new CGFappearance(scene);
        this.doorAppearance.setAmbient (0.3, 0.3, 0.3, 1);
        this.doorAppearance.setDiffuse (0.8, 0.8, 0.8, 1);
        this.doorAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.doorAppearance.setShininess(20);
        this.doorAppearance.setEmission(1, 1, 1, 1);  
        this.doorAppearance.loadTexture("textures/door.jpg");
        this.doorAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');   

        this.doorFrameAppearance = new CGFappearance(scene);
        this.doorFrameAppearance.setAmbient (0.3, 0.3, 0.3, 1);
        this.doorFrameAppearance.setDiffuse (0.8, 0.8, 0.8, 1);
        this.doorFrameAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.doorFrameAppearance.setShininess(20);
        this.doorFrameAppearance.loadTexture("textures/window_frame.jpg");
        this.doorFrameAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.signAppearance = new CGFappearance(scene);
        this.signAppearance.setAmbient (0.3, 0.3, 0.3, 1);
        this.signAppearance.setDiffuse (0.8, 0.8, 0.8, 1);
        this.signAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.signAppearance.setShininess(20);
        this.signAppearance.loadTexture("textures/bombeiros_sign.jpg");
        this.signAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

        this.heliPortCapAppr = new CGFappearance(scene);
        this.heliPortCapAppr.setAmbient (0.6, 0.6, 0.6, 1);
        this.heliPortCapAppr.setDiffuse (0.1, 0.1, 0.1, 1);
        this.heliPortCapAppr.setSpecular(0.1, 0.1, 0.1, 1);
        this.heliPortCapAppr.setShininess(5);
        this.heliPortCapAppr.setEmission(0.5, 0.5, 0.5, 1);

        this.helipadAppr = new CGFappearance(scene);
        this.helipadAppr.setAmbient (0.6, 0.6, 0.6, 1);
        this.helipadAppr.setDiffuse (0.1,0.1,0.1,1);
        this.helipadAppr.setSpecular(0.1, 0.1, 0.1, 1);
        this.helipadAppr.setShininess(10);
        this.helipadAppr.setEmission(0.5, 0.5, 0.5, 1);
        this.helipadAppr.setTexture(this.helipadTex);
        this.helipadAppr.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.helipadPlane = new MyQuad(scene, this.helipadTex, this.helipadAppr);
    }

    display() {
        const width75 = this.moduleWidth * 0.75;
        const depth75 = this.moduleDepth * 0.75;
        const spacing = this.moduleWidth / 2 + width75 / 2;

        // Left module
        this.scene.pushMatrix();
        this.wallAppearance.apply();
        this.scene.translate(-spacing, 0, 0); 
        this.left.display();
        this.displayWindows( this.numFloorsSide, width75, depth75); 
        this.scene.popMatrix();

        // Center module
        this.scene.pushMatrix();
        this.wallAppearance.apply();
        this.center.display();
        this.displayWindows(this.numFloorsCenter, this.moduleWidth, this.moduleDepth, true);
        this.scene.popMatrix();

        // Helipad
        this.scene.pushMatrix();
        this.scene.translate(0,this.floorHeight * this.numFloorsCenter + 0.01,0);
        this.heliPortCapAppr.apply();
        this.heliPort.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0, this.floorHeight*this.numFloorsCenter+1.03, 0);
        this.scene.rotate(-Math.PI/2, 1,0,0);
        this.scene.scale(this.moduleWidth*0.7,this.moduleWidth*0.7, 1);
        this.helipadAppr.apply();
        this.helipadPlane.display();
        this.scene.popMatrix();

        // Right module
        this.scene.pushMatrix();
        this.wallAppearance.apply();
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
            this.scene.translate(0, 20, 0);
            this.scene.scale(1, -1, 1);
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
            const idx     = Math.min(floor , this.windowsByFloor.length - 1);
            const winInst = this.windowsByFloor[idx];
            for (let i = 1; i <= this.windowsPerFloor; i++) {
                this.scene.pushMatrix();
                this.scene.translate(
                    i * spacing - width / 2,
                    floor * this.floorHeight + this.floorHeight / 2,
                    depth / 2 + 0.5
                );
                this.scene.scale(10, 10, 1);
                winInst.display();
                this.scene.popMatrix();
            }
        }
    }
    
    
}