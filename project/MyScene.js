import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from './MyPanorama.js';
import { MyHeli } from "./MyHeli.js";
import { MyBuilding } from './MyBuilding.js';

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
    this.ground = new MyPlane(this, 64, 0, 1, 0, 1, new CGFtexture(this, 'textures/grass.jpg'));
    let panoramaTexture = new CGFtexture(this, 'textures/sky.png');
    this.panorama = new MyPanorama(this, panoramaTexture);
    this.heli = new MyHeli(this);
    
    // Parâmetros do edifício (controláveis via interface)
    this.buildingNumFloorsSide = 3;
    this.buildingWindowsPerFloor = 3;
    this.buildingColor = [255, 0, 0]; // vermelho

    // Criação inicial do edifício
    this.building = new MyBuilding(this,
      this.buildingNumFloorsSide,
      this.buildingWindowsPerFloor,
      this.buildingColor
    );

    // Método para atualizar o edifício dinamicamente
    this.updateBuilding = () => {
      this.building = new MyBuilding(this,
        this.buildingNumFloorsSide,
        this.buildingWindowsPerFloor,
        this.buildingColor
      );
    };

   
    

    //------- Variables connnected to myInterface -------//
    // AXIS
    this.displayAxis = true;
    // GROUND
    this.displayGround = true;
    this.groundScale = 500;
    // SKY SPHERE
    this.displayPanorama = false;
    this.panoramaScale = 200;
    this.panoramaTextures = {
      'None' : null,
      'Sky': 'textures/sky.png',
    };
    this.panoramaTextureKey = 'Sky';
    this.panoramaFollowCamera = true;
    //HELICOPTER
    this.toggleHeliControl = false;
    this.displayBuilding = true;
    //---------------------------------------------------//

  }
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      1.2,
      0.1,
      1000,
      vec3.fromValues(50, 50, 50),
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
    if (this.displayAxis){ 
      this.axis.display();
    }

    this.setDefaultAppearance();

    // Draw ground
    if (this.displayGround) {
      this.pushMatrix();
      this.scale(this.groundScale, 1, this.groundScale);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.ground.display();
      this.popMatrix();
    }
  
    // Draw sky sphere
    if (this.displayPanorama) {
      this.panorama.texture = this.panoramaTextures[this.panoramaTextureKey];
      this.panorama.display();
    }

    if (this.displayBuilding) {
      this.pushMatrix();
      //this.translate(-150, 0, -240); 
      this.translate(0, 0, 0); 
      this.building.display();
      this.popMatrix();
    }
    
  
    // Draw helicopter
    this.pushMatrix();
    this.scale(10, 10, 10);
   // this.heli.display();
    this.popMatrix();
  }
}
