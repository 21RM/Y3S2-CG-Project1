import {CGFappearance, CGFtexture} from '../lib/CGF.js';

export class TextureManager {
  /**
   * @param {CGFscene} scene
   */
  constructor(scene) {
    this.scene = scene;
  }

  initTextures() {
    // ------------- MyBuilding -------------- //
        // Wall 
        this.scene.wallAppearance = new CGFappearance(this.scene);
        this.scene.wallAppearance.setAmbient (0.3, 0.3, 0.3, 1);
        this.scene.wallAppearance.setDiffuse (0.8, 0.8, 0.8, 1);
        this.scene.wallAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.scene.wallAppearance.setShininess(20);
        this.scene.wallAppearance.loadTexture('textures/side_buildings.jpg');
        this.scene.wallAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        // Center Building
        this.scene.centerAppearance = new CGFappearance(this.scene);
        this.scene.centerAppearance.setAmbient (0.3, 0.3, 0.3, 1);
        this.scene.centerAppearance.setDiffuse (0.8, 0.8, 0.8, 1);
        this.scene.centerAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.scene.centerAppearance.setShininess(20);
        this.scene.centerAppearance.loadTexture('textures/middle_building.jpg');
        this.scene.centerAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        // Door
        this.scene.doorAppearance = new CGFappearance(this.scene);
        this.scene.doorAppearance.setAmbient (0.3, 0.3, 0.3, 1);
        this.scene.doorAppearance.setDiffuse (0.8, 0.8, 0.8, 1);
        this.scene.doorAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.scene.doorAppearance.setShininess(20);
        this.scene.doorAppearance.setEmission(1, 1, 1, 1);  
        this.scene.doorAppearance.loadTexture("textures/door.jpg");
        this.scene.doorAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        // Door Frame
        this.scene.doorFrameAppearance = new CGFappearance(this.scene);
        this.scene.doorFrameAppearance.setAmbient (0.3, 0.3, 0.3, 1);
        this.scene.doorFrameAppearance.setDiffuse (0.8, 0.8, 0.8, 1);
        this.scene.doorFrameAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.scene.doorFrameAppearance.setShininess(20);
        this.scene.doorFrameAppearance.loadTexture("textures/window_frame.jpg");
        this.scene.doorFrameAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');
        // Sign
        this.scene.signAppearance = new CGFappearance(this.scene);
        this.scene.signAppearance.setAmbient (0.3, 0.3, 0.3, 1);
        this.scene.signAppearance.setDiffuse (0.8, 0.8, 0.8, 1);
        this.scene.signAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.scene.signAppearance.setShininess(20);
        this.scene.signAppearance.loadTexture("textures/bombeiros_sign.jpg");
        this.scene.signAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        // Heliport Base
        this.scene.heliPortCapAppr = new CGFappearance(this.scene);
        this.scene.heliPortCapAppr.setAmbient (0.6, 0.6, 0.6, 1);
        this.scene.heliPortCapAppr.setDiffuse (0.1, 0.1, 0.1, 1);
        this.scene.heliPortCapAppr.setSpecular(0.1, 0.1, 0.1, 1);
        this.scene.heliPortCapAppr.setShininess(5);
        this.scene.heliPortCapAppr.setEmission(0.5, 0.5, 0.5, 1);
        // Heliport H
        this.scene.helipadAppr = new CGFappearance(this.scene);
        this.scene.helipadAppr.setAmbient (0.6, 0.6, 0.6, 1);
        this.scene.helipadAppr.setDiffuse (0.1,0.1,0.1,1);
        this.scene.helipadAppr.setSpecular(0.1, 0.1, 0.1, 1);
        this.scene.helipadAppr.setShininess(10);
        this.scene.helipadAppr.setEmission(0.5, 0.5, 0.5, 1);
        this.scene.helipadAppr.loadTexture('textures/helipad.png');
        this.scene.helipadAppr.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');
    // --------------------------------------- //

    // -------------- MyWindow --------------- //
        // Frame material
        this.scene.frameAppearance = new CGFappearance(this.scene);
        this.scene.frameAppearance.setAmbient(0.2, 0.2, 0.2, 1);
        this.scene.frameAppearance.setDiffuse(0.3, 0.3, 0.3, 1);
        this.scene.frameAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.scene.frameAppearance.setShininess(10);
        this.scene.frameAppearance.loadTexture('textures/window_frame.jpg');
        this.scene.frameAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');
        // Sill appearance
        this.scene.sillAppearance = new CGFappearance(this.scene);
        this.scene.sillAppearance.setAmbient(0.1, 0.1, 0.1, 1);
        this.scene.sillAppearance.setDiffuse(1, 1, 1, 1);
        this.scene.sillAppearance.setSpecular(0.3, 0.3, 0.3, 1);
        this.scene.sillAppearance.setShininess(20);
        this.scene.sillAppearance.loadTexture('textures/window_frame.jpg');
        this.scene.sillAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');
        // Sill shadow
        this.scene.sillShadeTex = new CGFtexture(this.scene, 'textures/sillShadow.png');
        // Window Glass
        this.scene.windowTex1 = new CGFtexture(this.scene, 'textures/window_first.png');
        this.scene.windowTex2 = new CGFtexture(this.scene, 'textures/window_glass_reflective.png');
        this.scene.windowTex3 = new CGFtexture(this.scene, 'textures/window_sky_first.png');
        this.scene.windowTex4 = new CGFtexture(this.scene, 'textures/window_sky_middle.png');
        this.scene.windowTex5 = new CGFtexture(this.scene, 'textures/window_sky_last.png');
        this.scene.windowTex6 = new CGFtexture(this.scene, 'textures/window_sky_last.png');
    // --------------------------------------- //
  }
}