import { CGFobject } from '../lib/CGF.js';
import { MyQuad } from "./MyQuad.js";

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MyUnitCubeQuad extends CGFobject {
	constructor(scene, topTex, frontTex, rightTex, backTex, leftTex, bottomTex) {
		super(scene);

		this.quad = new MyQuad(scene);

        this.textureTop = topTex;
        this.textureFront = frontTex;
        this.textureRight = rightTex;
        this.textureBack = backTex;
        this.textureLeft = leftTex;
        this.textureBottom = bottomTex;
	}

    display(){
        this.scene.setDefaultAppearance();
        // Front face
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        if (this.texturesFront) this.texturesFront.apply();
        this.quad.display();
        this.scene.popMatrix();

        // Back face
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        if (this.texturesBack) this.texturesBack.apply();
        this.quad.display();
        this.scene.popMatrix();

        // Left face
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        if (this.texturesLeft) this.texturesLeft.apply();
        this.quad.display();
        this.scene.popMatrix();

        // Right face
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        if (this.texturesRight) this.texturesRight.apply();
        this.quad.display();
        this.scene.popMatrix();

        // Top face
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        if (this.texturesTop) this.texturesTop.apply();
        this.quad.display();
        this.scene.popMatrix();

        // Bottom face
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        if (this.texturesBottom) this.texturesBottom.apply();
        this.quad.display();
        this.scene.popMatrix();
    }
}