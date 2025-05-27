// MyBuilding.js
import { CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
import { MyPrismSolid } from './MyPrismSolid.js';
import { MyWindow } from './MyWindow.js';
import { MyCylinder } from './MyCylinder.js';
import { MyQuad } from './MyQuad.js';

export class MyBuilding extends CGFobject {
    constructor(scene, numFloorsSide, windowsPerFloor) {
        super(scene);

        this.floorHeight = 30;
        this.numFloorsSide = numFloorsSide;
        this.numFloorsCenter = numFloorsSide + 1;
        this.windowsPerFloor = windowsPerFloor;

        this.moduleWidth = 100;
        this.moduleDepth = 100;
        
        this.helipadPos = vec3.fromValues(scene.buildingPos[0], (this.floorHeight*this.numFloorsCenter + scene.buildingPos[1])*scene.buildingScale[1], scene.buildingPos[2]);


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

        this.windowTextures = [
          scene.windowTex1, 
          scene.windowTex2, 
          scene.windowTex3,
          scene.windowTex4, 
          scene.windowTex5, 
          scene.windowTex6 
        ];
        this.windowsByFloor = this.windowTextures.map(
          tex => new MyWindow(scene, tex)
        );

        this.door = new MyPrismSolid(scene, [14, 0.2], [14, 0.2], 20);
        this.doorFrameTop = new MyPrismSolid(scene, [17, 0.8], [16, 0.8], 1);
        this.doorFrameSide = new MyPrismSolid(scene, [1, 0.8], [1, 0.8], 20);
        this.sign = new MyPrismSolid(scene, [25, 1], [25, 1], 6);

        this.helipadPlane = new MyQuad(scene, 1, null, this.scene.helipadAppr);
    }

    display() {
        const width75 = this.moduleWidth * 0.75;
        const depth75 = this.moduleDepth * 0.75;
        const spacing = this.moduleWidth / 2 + width75 / 2;

        // Left module
        this.scene.pushMatrix();
        this.scene.wallAppearance.apply();
        this.scene.translate(-spacing, 0, 0); 
        this.left.display();
        this.displayWindows( this.numFloorsSide, width75, depth75); 
        this.scene.popMatrix();

        // Center module
        this.scene.pushMatrix();
        this.scene.wallAppearance.apply();
        this.center.display();
        this.displayWindows(this.numFloorsCenter, this.moduleWidth, this.moduleDepth, true);
        this.scene.popMatrix();

        // Helipad
        this.scene.pushMatrix();
        this.scene.translate(0,this.floorHeight * this.numFloorsCenter + 0.01,0);
        this.scene.heliPortCapAppr.apply();
        this.heliPort.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0, this.floorHeight*this.numFloorsCenter+1.03, 0);
        this.scene.rotate(-Math.PI/2, 1,0,0);
        this.scene.scale(this.moduleWidth*0.7,this.moduleWidth*0.7, 1);
        this.scene.helipadAppr.apply();
        this.helipadPlane.display();
        this.scene.popMatrix();

        // Right module
        this.scene.pushMatrix();
        this.scene.wallAppearance.apply();
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
            this.scene.doorFrameAppearance.apply();
            this.doorFrameTop.display();
            this.scene.popMatrix();

            // Door frame: left bar
            this.scene.pushMatrix();
            this.scene.translate(-7.5, 0, depth / 2 + 0.2);
            this.scene.doorFrameAppearance.apply();
            this.doorFrameSide.display();
            this.scene.popMatrix();

            // Door frame: right bar
            this.scene.pushMatrix();
            this.scene.translate(7.5, 0, depth / 2 + 0.2);
            this.scene.doorFrameAppearance.apply();
            this.doorFrameSide.display();
            this.scene.popMatrix();

            // Door
            this.scene.pushMatrix();
            this.scene.translate(0, 0, depth / 2 + 0.2);
            this.scene.translate(0, 20, 0);
            this.scene.scale(1, -1, 1);
            this.scene.doorAppearance.apply();
            this.door.display();
            this.scene.popMatrix();

            // Sign
            this.scene.pushMatrix();
            this.scene.translate(0, this.floorHeight , depth / 2 +0.2);
            this.scene.rotate(Math.PI , 1, 0, 0);
            this.scene.signAppearance.apply();
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