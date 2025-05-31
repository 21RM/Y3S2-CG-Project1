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
        this.scene.helipadHAppr = new CGFappearance(this.scene);
        this.scene.helipadHAppr.setAmbient (0.6, 0.6, 0.6, 1);
        this.scene.helipadHAppr.setDiffuse (0.1, 0.1, 0.1, 1);
        this.scene.helipadHAppr.setSpecular(0.1, 0.1, 0.1, 1);
        this.scene.helipadHAppr.setShininess(10);
        this.scene.helipadHAppr.setEmission(0.5, 0.5, 0.5, 1);
        this.scene.helipadHAppr.loadTexture('textures/helipad.png');
        this.scene.helipadHAppr.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        // Heliport UP
        this.scene.helipadUpAppr = new CGFappearance(this.scene);
        this.scene.helipadUpAppr.setAmbient (0.6, 0.6, 0.6, 1);
        this.scene.helipadUpAppr.setDiffuse (0.1, 0.1, 0.1, 1);
        this.scene.helipadUpAppr.setSpecular(0.1, 0.1, 0.1, 1);
        this.scene.helipadUpAppr.setShininess(10);
        this.scene.helipadUpAppr.setEmission(0.5, 0.5, 0.5, 1);
        this.scene.helipadUpAppr.loadTexture('textures/helipad_up.png');
        this.scene.helipadUpAppr.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        // Heliport DOWN
        this.scene.helipadDownAppr = new CGFappearance(this.scene);
        this.scene.helipadDownAppr.setAmbient (0.6, 0.6, 0.6, 1);
        this.scene.helipadDownAppr.setDiffuse (0.1, 0.1, 0.1, 1);
        this.scene.helipadDownAppr.setSpecular(0.1, 0.1, 0.1, 1);
        this.scene.helipadDownAppr.setShininess(10);
        this.scene.helipadDownAppr.setEmission(0.5, 0.5, 0.5, 1);
        this.scene.helipadDownAppr.loadTexture('textures/helipad_down.png');
        this.scene.helipadDownAppr.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');
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

    // -------------- MyTree --------------- //
    // Trunk
    this.scene.trunkAppearance = new CGFappearance(this.scene);
    this.scene.trunkAppearance.setAmbient(0.1, 0.1, 0.1, 1);
    this.scene.trunkAppearance.setDiffuse(0.6, 0.6, 0, 6);
    this.scene.trunkAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.scene.trunkAppearance.setShininess(10);
    this.scene.trunkAppearance.loadTexture('textures/trunk.png');
    this.scene.trunkAppearance.setTextureWrap('REPEAT','REPEAT');

    // Foliage
    this.scene.leafAppearance = new CGFappearance(this.scene);
    this.scene.leafAppearance.setAmbient (0.1, 0.1, 0.1, 1);
    this.scene.leafAppearance.setDiffuse (0.5,0.5,0.5,1);
    this.scene.leafAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.scene.leafAppearance.setShininess(10);
    this.scene.leafAppearance.loadTexture('textures/leafs.png');
    this.scene.leafAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

    this.scene.leafTopAppearance = new CGFappearance(this.scene);
    this.scene.leafTopAppearance.setAmbient (0.1, 0.1, 0.1, 1);
    this.scene.leafTopAppearance.setDiffuse (0.5,0.5,0.5,1);
    this.scene.leafTopAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.scene.leafTopAppearance.setShininess(10);
    this.scene.leafTopAppearance.loadTexture('textures/leafs_top.png');
    this.scene.leafTopAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

    this.scene.leaf2Appearance = new CGFappearance(this.scene);
    this.scene.leaf2Appearance.setAmbient (0.1, 0.1, 0.1, 1);
    this.scene.leaf2Appearance.setDiffuse (0.5,0.5,0.5,1);
    this.scene.leaf2Appearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.scene.leaf2Appearance.setShininess(10);
    this.scene.leaf2Appearance.loadTexture('textures/leafs_2.png');
    this.scene.leaf2Appearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

    this.scene.leaf2TopAppearance = new CGFappearance(this.scene);
    this.scene.leaf2TopAppearance.setAmbient (0.1, 0.1, 0.1, 1);
    this.scene.leaf2TopAppearance.setDiffuse (0.5,0.5,0.5,1);
    this.scene.leaf2TopAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.scene.leaf2TopAppearance.setShininess(10);
    this.scene.leaf2TopAppearance.loadTexture('textures/leafs_2_top.png');
    this.scene.leaf2TopAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

    this.scene.leaf3Appearance = new CGFappearance(this.scene);
    this.scene.leaf3Appearance.setAmbient (0.1, 0.1, 0.1, 1);
    this.scene.leaf3Appearance.setDiffuse (0.5,0.5,0.5,1);
    this.scene.leaf3Appearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.scene.leaf3Appearance.setShininess(10);
    this.scene.leaf3Appearance.loadTexture('textures/leafs_3.png');
    this.scene.leaf3Appearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

    this.scene.leaf3TopAppearance = new CGFappearance(this.scene);
    this.scene.leaf3TopAppearance.setAmbient (0.1, 0.1, 0.1, 1);
    this.scene.leaf3TopAppearance.setDiffuse (0.5,0.5,0.5,1);
    this.scene.leaf3TopAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.scene.leaf3TopAppearance.setShininess(10);
    this.scene.leaf3TopAppearance.loadTexture('textures/leafs_3_top.png');
    this.scene.leaf3TopAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

    this.scene.treeShadowTex = new CGFtexture(this.scene, 'textures/treeShadow.png');
    this.scene.treeShadowAppr = new CGFappearance(this.scene);
    this.scene.treeShadowAppr.setAmbient(0.9, 0.9, 0.9, 1);
    this.scene.treeShadowAppr.setDiffuse(0.1, 0.1, 0.1, 1);  
    this.scene.treeShadowAppr.setSpecular(0.1, 0.1, 0.1, 1);
    this.scene.treeShadowAppr.setShininess(10);
    this.scene.treeShadowAppr.loadTexture('textures/treeShadow.png');
    this.scene.treeShadowAppr.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

    // --------------------------------------- //
    // WATER drops
    this.scene.dropsTex = new CGFtexture(this.scene, 'textures/water.png');
  }
}