
import {CGFapplication} from '../lib/CGF.js';
import { MyScene } from '../project/MyScene.js';
import { MyInterface } from '../project/MyInterface.js';

function main()
{
    var app = new CGFapplication(document.body);
    var myScene = new MyScene();
    var myInterface = new MyInterface();

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

    app.run();
}

main();