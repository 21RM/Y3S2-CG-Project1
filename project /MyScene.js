import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.ground = new MyPlane(this, 64);
    this.skySphere = new MySphere(this, 64, 64, true);


    // Variables connnected to myInterface //
    this.displayAxis = true;
    this.displayGround = true;
    // ----- Sky Sphere -----
    this.displaySkySphere = true;
    this.skySphereScale = 50;
    this.skySphereTextures = {
      'none' : null,
      'earth': new CGFtexture(this, 'textures/earth.jpg'),
    };
    this.skySphereTextureKey = 'earth';
    this.skySphereMaterial = new CGFappearance(this);
    this.skySphereMaterial.setAmbient(1, 1, 1, 1);
    this.skySphereMaterial.setDiffuse(1, 1, 1, 1);
    this.skySphereMaterial.setSpecular(0, 0, 0, 1);
    this.skySphereMaterial.setEmission(1, 1, 1, 1);
    this.skySphereMaterial.setShininess(10);
    //------------------------------------ //

  }
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      1000,
      vec3.fromValues(200, 200, 200),
      vec3.fromValues(0, 0, 0)
    );
  }
  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    // Check for key codes e.g. in https://keycode.info/
    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
    }

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
    }
    if (keysPressed)
      console.log(text);
  }

  update(t) {
    this.checkKeys();
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }
  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    if (this.displayAxis) this.axis.display();

    this.setDefaultAppearance();

    // Draw ground
    if (this.displayGround) {
      this.pushMatrix();
      this.scale(400, 1, 400);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.ground.display();
      this.popMatrix();
    }
    // Draw sky sphere
    if (this.displaySkySphere){
      this.pushMatrix();
      this.scale(this.skySphereScale, this.skySphereScale, this.skySphereScale);
      this.skySphereMaterial.setTexture(this.skySphereTextures[this.skySphereTextureKey]);
      this.skySphereMaterial.apply();
      this.skySphere.display();
      this.popMatrix();
    }
  }
}
