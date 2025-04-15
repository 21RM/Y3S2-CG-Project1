import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MySphere } from './MySphere.js';

export class MyPanorama extends CGFobject {
    /**
     * Constructs a panorama object.
     * @param {CGFscene} scene - Reference to the scene.
     * @param {CGFtexture} texture - The panorama texture (should be equirectangular).
     */
    constructor(scene, texture) {
        super(scene);
        this.texture = texture;
        
        this.material = new CGFappearance(scene);
        this.material.setAmbient(0, 0, 0, 1);
        this.material.setDiffuse(0, 0, 0, 1);
        this.material.setSpecular(0, 0, 0, 1);
        this.material.setEmission(0.9, 0.9, 0.9, 1);
        this.material.setTexture(this.texture);
        this.material.setShininess(10);

        this.sphere = new MySphere(scene, 40, 40, false);
    }


    display() {
        this.scene.pushMatrix();
        if(this.scene.panoramaFollowCamera) {
            const pos = this.scene.camera.position;
            this.scene.translate(pos[0], pos[1], pos[2]);
        }

        this.scene.scale(this.scene.panoramaScale, this.scene.panoramaScale, this.scene.panoramaScale);

        this.material.apply();

        this.sphere.display();

        this.scene.popMatrix();
    }

    toggleInvert() {
        this.sphere.toggleInvert();

    }
}