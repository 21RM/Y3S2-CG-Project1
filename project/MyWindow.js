// MyWindow.js
import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyPlane } from './MyPlane.js';

export class MyWindow extends CGFobject {
    constructor(scene) {
        super(scene);

        this.frame = new MyPlane(scene, 1, 0, 1, 0, 1);
        this.glass = new MyPlane(scene, 1, 0, 1, 0, 1);

        // Moldura escura
        this.frameAppearance = new CGFappearance(scene);
        this.frameAppearance.setAmbient(0.2, 0.2, 0.2, 1);
        this.frameAppearance.setDiffuse(0.3, 0.3, 0.3, 1);
        this.frameAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.frameAppearance.setShininess(10);

        // Vidro azulado com textura (podes substituir o caminho)
        this.glassAppearance = new CGFappearance(scene);
        this.glassAppearance.setAmbient(0.1, 1.0, 0.1, 1);
        this.glassAppearance.setDiffuse(0.1, 1.0, 0.1, 1);
        this.glassAppearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.glassAppearance.setShininess(10);        
        //this.glassAppearance.loadTexture("images/window_texture.jpg");
        //this.glassAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
    }

    display() {
        // Frame 
        this.frameAppearance.apply();
        this.scene.pushMatrix();
        this.scene.scale(1.2, 1.2, 1); 
        this.frame.display();
        this.scene.popMatrix();
    
        // Glass 
        this.glassAppearance.apply();
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.01); 
        this.scene.scale(0.9, 0.9, 1); 
        this.glass.display();
        this.scene.popMatrix();
    }
    
}
