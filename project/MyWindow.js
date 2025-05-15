// MyWindow.js
import { CGFobject,CGFtexture, CGFappearance } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
import { MyPrismSolid } from './MyPrismSolid.js';

export class MyWindow extends CGFobject {
    constructor(scene, tex) {
        super(scene);


        // Frame: top, bottom, left, right (thin prisms)
        this.frameHoriz = new MyPrismSolid(scene, [0.95, 0.3], [0.95, 0.3], 0.05);
        this.frameVert = new MyPrismSolid(scene, [0.05, 0.3], [0.05, 0.3], 0.9);

        // Cross: vertical and horizontal bars inside the glass
        this.crossVert = new MyPrismSolid(scene, [0.03, 0.1], [0.03, 0.1], 0.95);
        this.crossHoriz = new MyPrismSolid(scene, [0.42, 0.1], [0.42, 0.1], 0.03);

        // Sill: small bottom block
        this.sill = new MyPrismSolid(scene, [1.1, 1.8], [1.1, 1.8], 0.03);

        this.sillShadow = new MyQuad(scene, scene.sillShadeTex);

        // Glass material
        this.glassAppearance = new CGFappearance(scene);
        this.glassAppearance.setAmbient (0.2,0.2,0.2,1);
        this.glassAppearance.setDiffuse (0.7,0.7,0.7,1);
        this.glassAppearance.setSpecular(0.9,0.9,0.9,1);
        this.glassAppearance.setShininess(120);
        this.glassAppearance.setEmission(0.1,0.1,0.1,1);
        this.glassAppearance.setTexture(tex);
        this.glassAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.glass = new MyQuad(scene, tex, this.glassAppearance);
    }

    display() {
        // Glass
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.45);
        this.scene.scale(0.9, -0.9, 1);
        this.glass.display();
        this.scene.popMatrix();

        // Frame appearance
        this.scene.frameAppearance.apply();

        // Top frame
        this.scene.pushMatrix();
        this.scene.translate(0, 0.4, -0.44);
        this.frameHoriz.display();
        this.scene.popMatrix();

        // Bottom frame
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, -0.44);
        this.frameHoriz.display();
        this.scene.popMatrix();

        // Left frame
        this.scene.pushMatrix();
        this.scene.translate(-0.45, -0.5, -0.44);
        this.frameVert.display();
        this.scene.popMatrix();

        // Right frame
        this.scene.pushMatrix();
        this.scene.translate(0.45, -0.5, -0.44);
        this.frameVert.display();
        this.scene.popMatrix();

        // Vertical cross
        this.scene.pushMatrix();
        this.scene.translate(0, -0.52, -0.44);
        this.crossVert.display();
        this.scene.popMatrix();

        // Horizontal cross - left
        this.scene.pushMatrix();
        this.scene.translate(-0.22, 0, -0.44);
        this.crossHoriz.display();
        this.scene.popMatrix();

        // Horizontal cross - right
        this.scene.pushMatrix();
        this.scene.translate(0.22, 0, -0.44);
        this.crossHoriz.display();
        this.scene.popMatrix();

        // Window sill
        this.scene.pushMatrix();
        this.scene.translate(0, -0.53, 0.07);
        this.scene.sillAppearance.apply();
        this.sill.display();
        this.scene.popMatrix();

        //Window sill shadow
        this.scene.pushMatrix();
        this.scene.translate(0, -0.60, -0.4);
        this.scene.scale(1, 0.15, 1);
        this.sillShadow.display();
        this.scene.popMatrix();
    }
}