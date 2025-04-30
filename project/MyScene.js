import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from './MyPanorama.js';
import { MyHeli } from "./MyHeli.js";
import { MyCockpitGlass } from "./MyCockpitGlass.js";
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

    this.setUpdatePeriod(20);

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.ground = new MyPlane(this, 64, 0, 1, 0, 1, new CGFtexture(this, 'textures/grass.jpg'));
    let panoramaTexture = new CGFtexture(this, 'textures/sky.png');
    this.panorama = new MyPanorama(this, panoramaTexture);
    this.heliPosition = vec3.fromValues(0, 0, 0);
    this.heliVelocity = vec3.fromValues(0, 0, 0);
    this.heli = new MyHeli(this, this.heliPosition, 0, this.heliVelocity);
    const glassTex = new CGFtexture(this, 'textures/cockpitGlass.png');
    this.cockpitGlass = new MyCockpitGlass(this, glassTex);
    this.heli = new MyHeli(this);

   
    

    //------- Variables connnected to myInterface -------//
    // AXIS
    this.displayAxis = false;
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
    // HELICOPTER
    this.helicopterMode = false;
    this.followHeli3P = false;
    this.followHeli1P = false;
    this.toggleHeliControl = false;
    this.displayHeli = true;
    // BUILDING
    this.displayBuilding = false;
    // Parâmetros do edifício (controláveis via interface)
    this.buildingNumFloorsSide = 3;
    this.buildingWindowsPerFloor = 3;
    this.buildingColor = [255, 0, 0]; // vermelho
    //---------------------------------------------------//

    // -------- Objects that depend on interface variables --------- //
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
    // ------------------------------------------------------------- //

  }
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camDefault = new CGFcamera(1.2, 0.1, 1000, vec3.fromValues(50, 50, 50), vec3.fromValues(0, 0, 0));
    this.camHeli1P = new CGFcamera(1.2, 0.1, 1000, vec3.fromValues(0,0,0), vec3.fromValues(0,0,0));
    this.camHeli3P = new CGFcamera(1.2, 0.1, 1000, vec3.fromValues(0,0,0), vec3.fromValues(0,0,0));
    this.camera = this.camDefault;
  }

  update(currTime) {
    if (!this.lastTime) this.lastTime = currTime;
    const delta = currTime - this.lastTime;
    this.lastTime = currTime;

    this.heli.update(delta);

    if (this.followHeli1P){
      const [hx, hy, hz] = this.heli.position;
      const yaw   = this.heli.rotation;
      const pitch = this.heli.pitch;
      const roll  = this.heli.roll;

      const M = mat4.create();
      mat4.rotateY(M, M, yaw);
      mat4.rotateX(M, M, pitch);
      mat4.rotateZ(M, M, roll);

      const localCam    = vec3.fromValues( 0,  1.9,  1.2);
      const localTarget = vec3.fromValues( 0,  1.9,  1.3);
      const worldCam    = vec3.create();
      const worldTarget = vec3.create();
      vec3.transformMat4(worldCam, localCam, M);
      vec3.transformMat4(worldTarget, localTarget, M);
      vec3.add(worldCam, worldCam, [hx,hy,hz]);
      vec3.add(worldTarget, worldTarget, [hx,hy,hz]);

      this.camHeli1P.position.set(worldCam);
      this.camHeli1P.target.set(worldTarget);
      this.camera = this.camHeli1P;
    }
    else if (this.followHeli3P){
      const [hx,hy,hz] = this.heli.position;
      const yaw = this.heli.rotation;
      const back = 10, up = 10;
      const cx = hx - Math.sin(yaw)*back,
            cz = hz - Math.cos(yaw)*back,
            cy = hy + up;
      this.camHeli3P.position.set([cx,cy,cz]);
      this.camHeli3P.target.set([hx,hy,hz]);
      this.camera = this.camHeli3P;
    }
    else {
      this.camera = this.camDefault;
    }

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
    
    
    if (this.displayHeli) { // Draw helicopter
      this.pushMatrix();
      this.heli.display();
      this.popMatrix();
    }

    if (this.followHeli1P) {
      this.cockpitGlass.display();
    }
  }
}
