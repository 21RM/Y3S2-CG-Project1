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
        this.material.setAmbient(0.2, 0.2, 0.2, 1);
        this.material.setDiffuse(0, 0, 0, 1);
        this.material.setSpecular(0, 0, 0, 1);
        this.material.setEmission(1, 1, 1, 1);
        this.material.setTexture(this.texture);
        this.material.setShininess(10);
        
        this.sphere = new MySphere(scene, 40, 40, false);

        this.light = scene.lights[0];
        this.light.setAmbient (0,0,0,1);
        this.light.setDiffuse (1,1,1,1);
        this.light.setSpecular(1,1,1,1);
        this.light.enable();
    }


    display() {
        this.scene.pushMatrix();

        let px = 0, py = 0, pz = 0;
        if (this.scene.panoramaFollowCamera) {
        [px, py, pz] = this.scene.camera.position;
        }
        py += 138 *this.scene.panoramaScale/200;
        px += 85 *this.scene.panoramaScale/200;
        pz -= 140 *this.scene.panoramaScale/200;

        this.light.setPosition(px, py, pz, 1);
        this.light.update();


        if(this.scene.panoramaFollowCamera) {
            const pos = this.scene.camera.position;
            this.scene.translate(pos[0], pos[1], pos[2]);
        }

        this.scene.translate(0, 20, 0);

        this.scene.scale(this.scene.panoramaScale, this.scene.panoramaScale, this.scene.panoramaScale);

        this.material.apply();

        this.sphere.display();

        this.scene.popMatrix();
    }

    toggleInvert() {
        this.sphere.toggleInvert();

    }
}