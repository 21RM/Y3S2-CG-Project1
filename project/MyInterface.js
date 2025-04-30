import { CGFinterface, dat } from "../lib/CGF.js";

/**
 * MyInterface
 * @constructor
 */
export class MyInterface extends CGFinterface {
  constructor() {
    super();
  }

  init(application) {
    // call CGFinterface init
    super.init(application);

    // init GUI. For more information on the methods, check:
    // https://github.com/dataarts/dat.gui/blob/master/API.md
    this.gui = new dat.GUI();

    const heliModeCtrl = this.gui.add(this.scene, "helicopterMode").name("Helicopter Mode"); // enable helicopter mode
    this.heliModeCtrl = heliModeCtrl;

    // Add controls for helicopter mode
    let heliControlFolder = this.gui.addFolder("Helicopter Control");
    heliControlFolder.open();
    this.heliControlFolder = heliControlFolder;
    // V //
        const fp1Ctrl = heliControlFolder.add(this.scene, 'followHeli1P').name('Camera 1P');
        fp1Ctrl.onChange(val => {
          if (val) {
            this.scene.followHeli3P = false;
            fp3Ctrl.updateDisplay();
          }
        });
        const fp3Ctrl = heliControlFolder.add(this.scene, 'followHeli3P').name('Camera 3P');
        fp3Ctrl.onChange(val => {
          if (val) {
            this.scene.followHeli1P = false;
            fp1Ctrl.updateDisplay();
          }
        });
        const cruiseCtrl = heliControlFolder.add(this.scene.heli, "cruiseHeight", 20, 40).name("Cruise Height"); // helicopter cruise height
        cruiseCtrl.onChange((newHeight) => {
          this.scene.heli.isOff = false;
          this.scene.heli.takingOff = true;
          this.scene.heli.breaking = false;
          this.scene.heli.dir = [0, 0];
        });
        heliControlFolder.add(this.scene.heli, "motorPower", 0.1, 3) .name("Motor Power"); // helicopter aceleration

        heliControlFolder.domElement.style.display = "none";

    // Scene elements folder
    let sceneElementsFolder = this.gui.addFolder("Scene Elements");
    // V //
        // Axis folder
        let axisFolder = sceneElementsFolder.addFolder("Axis");
        // V //
            axisFolder.add(this.scene, "displayAxis").name("Show Axis"); // show axis
            // -----------
        // Ground folder
        let groundFolder = sceneElementsFolder.addFolder("Ground");
        // V //
            groundFolder.add(this.scene, "displayGround").name("Show Ground"); // show ground
            groundFolder.add(this.scene, "groundScale", 500, 1000).name("Scale"); // scale ground
            // -----------
        // Heli Folder
        let heliFolder = sceneElementsFolder.addFolder("Helicopter");
        // V //
            heliFolder.add(this.scene, "displayHeli").name("Show Heli");
        // Fire Station folder
        let buildingFolder = sceneElementsFolder.addFolder('Fire Station');
        // V //
            buildingFolder.add(this.scene, 'displayBuilding').name('Show Fire Station');
            buildingFolder.add(this.scene, 'buildingNumFloorsSide', 1, 6, 1).name('Side Floors').onChange(() => this.scene.updateBuilding());
            buildingFolder.add(this.scene, 'buildingWindowsPerFloor', 1, 5, 1).name('Windows/Floor').onChange(() => this.scene.updateBuilding());
            buildingFolder.addColor(this.scene, 'buildingColor').name('Color').onChange(() => this.scene.updateBuilding());
            // -----------
        // Sky Sphere folder
        let skySphereFolder = sceneElementsFolder.addFolder("Sky Sphere");
        // V //
            skySphereFolder.add(this.scene, "displayPanorama").name("Show Sky Sphere"); // show sky sphere
            skySphereFolder.add(this.scene, "panoramaScale", 50, 1000).name("Scale"); // scale sky sphere
            skySphereFolder.add({invert: () => {this.scene.panorama.toggleInvert();},},"invert").name("Invert Faces"); // invert faces
            skySphereFolder.add(this.scene,"panoramaTextureKey",Object.keys(this.scene.panoramaTextures)).name("Texture"); // change texture
            skySphereFolder.add(this.scene, "panoramaFollowCamera").name("Follow Camera"); // follow camera
            // -----------
    //----------------------

    heliModeCtrl.onChange((enabled) => {
      heliControlFolder.domElement.style.display = enabled ? "" : "none";
    });

    this.initKeys();

    return true;
  }

  initKeys() {
    // create reference from the scene to the GUI
    this.scene.gui = this;

    // disable the processKeyboard function
    this.processKeyboard = function () {};

    // create a named array to store which keys are being pressed
    this.activeKeys = {};
    this.dir = [0,0]; 
  }
  processKeyDown(event) {
    // called when a key is pressed down
    // mark it as active in the array
    this.activeKeys[event.code] = true;

    if (this.scene.helicopterMode && this.scene.heli.isOff) {
      switch (event.code) {
        case "KeyA":
          this.dir[0] = -1;
          break;
        case "KeyD":
          this.dir[0] = 1;
          break;
        case "KeyW":
          this.dir[1] = 1;
          break;
        case "KeyS":
          this.dir[1] = -1;
          break;
        case "ArrowLeft":
          this.scene.heli.turnInput = 1
          break;
        case "ArrowRight":
          this.scene.heli.turnInput = -1
          break;
      }
      this.scene.heli.dir = this.dir;
    }
  }

  processKeyUp(event) {
    this.activeKeys[event.code] = false;
    if (this.scene.helicopterMode) {
      if (this.scene.heli.isOff) {
        switch (event.code) {
          case "KeyA":
            this.dir[0] = this.activeKeys["KeyD"] ? 1 : 0;
            break;
          case "KeyD":
            this.dir[0] = this.activeKeys["KeyA"] ? -1 : 0;
            break;
          case "KeyW":
            this.dir[1] = this.activeKeys["KeyS"] ? -1 : 0;
            break;
          case "KeyS":
            this.dir[1] = this.activeKeys["KeyW"] ? 1 : 0;
            break;
          case "ArrowLeft":
            this.scene.heli.turnInput = this.activeKeys['ArrowRight'] ? -1 : 0
            break;
          case "ArrowRight":
            this.scene.heli.turnInput = this.activeKeys['ArrowLeft'] ? 1 : 0
            break;
        }
        this.scene.heli.dir = this.dir;
      }
      if (event.code === "KeyP") {
        if (!this.scene.heli.isOff) this.scene.heli.takingOff = true;
      }
      if (event.code === "KeyC") {
        this.scene.helicopterMode = false;
        this.heliControlFolder.domElement.style.display = "none";
        this.heliModeCtrl.setValue(this.scene.helicopterMode);
      }
    } else {
      if (event.code === "KeyC") {
        this.scene.helicopterMode = true;
        this.heliControlFolder.domElement.style.display = "";
        this.heliModeCtrl.setValue(this.scene.helicopterMode);
      }
    }
  }

  isKeyPressed(keyCode) {
    // returns true if a key is marked as pressed, false otherwise
    return this.activeKeys[keyCode] || false;
  }
}
