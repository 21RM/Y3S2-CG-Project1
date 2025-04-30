import { CGFinterface, dat } from '../lib/CGF.js';

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

        this.gui.add(this.scene, 'toggleHeliControl').name('Helicopter Mode'); // enable helicopter mode

        // Scene elements folder
        let sceneElementsFolder = this.gui.addFolder('Scene Elements');
        // V //
            // Axis folder
            let axisFolder = sceneElementsFolder.addFolder('Axis');
            // V //
                axisFolder.add(this.scene, 'displayAxis').name('Show Axis'); // show axis
            // -----------
            // Fire Station folder
            let buildingFolder = sceneElementsFolder.addFolder('Fire Station');
            // V //
                buildingFolder.add(this.scene, 'displayBuilding').name('Show Fire Station');
                buildingFolder.add(this.scene, 'buildingNumFloorsSide', 1, 6, 1).name('Side Floors').onChange(() => this.scene.updateBuilding());
                buildingFolder.add(this.scene, 'buildingWindowsPerFloor', 1, 5, 1).name('Windows/Floor').onChange(() => this.scene.updateBuilding());
                buildingFolder.addColor(this.scene, 'buildingColor').name('Color').onChange(() => this.scene.updateBuilding());

            // -----------
            // Ground folder
            let groundFolder = sceneElementsFolder.addFolder('Ground');
            // V //
                groundFolder.add(this.scene, 'displayGround').name('Show Ground'); // show ground
                groundFolder.add(this.scene, 'groundScale', 500, 1000).name('Scale'); // scale ground
            // -----------
            // Sky Sphere folder
            let skySphereFolder = sceneElementsFolder.addFolder('Sky Sphere');
            // V //
                skySphereFolder.add(this.scene, 'displayPanorama').name('Show Sky Sphere'); // show sky sphere
                skySphereFolder.add(this.scene, 'panoramaScale', 50, 1000).name('Scale'); // scale sky sphere
                skySphereFolder.add({ invert: () => { this.scene.panorama.toggleInvert();} }, 'invert').name('Invert Faces'); // invert faces
                skySphereFolder.add(this.scene, 'panoramaTextureKey', Object.keys(this.scene.panoramaTextures)).name('Texture'); // change texture
                skySphereFolder.add(this.scene, 'panoramaFollowCamera').name('Follow Camera'); // follow camera
            // -----------
        //----------------------

        this.initKeys();

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}