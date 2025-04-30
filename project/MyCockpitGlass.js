import { CGFobject } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

export class MyCockpitGlass extends CGFobject {
    constructor(scene, glassTexture) { 
        super(scene);

        this.scene = scene;
        this.glassTexture = glassTexture;

        this.quad = new MyQuad(this.scene, this.glassTexture);
    }

    display() {      
        const gl = this.scene.gl;

        this.scene.pushMatrix();
      
          // 1) Reset back to camera‐space (dropping any world‐transforms)
          this.scene.loadIdentity();
      
          // 2) Render on top of everything
          gl.disable(gl.DEPTH_TEST);
          gl.depthMask(false);
      
          // 3) Move slightly into the frustum so it isn’t clipped
          this.scene.translate(0, 0, -0.5);
      
          // 4) Scale a unit quad (−0.5→+0.5) to cover the whole screen
          this.scene.scale(2, 2, 1);
      
          // 5) Draw your MyQuad
          this.quad.display();
      
          // 6) Restore depth
          gl.depthMask(true);
          gl.enable(gl.DEPTH_TEST);
      
        this.scene.popMatrix();
    }
}