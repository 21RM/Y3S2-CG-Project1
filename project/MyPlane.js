import {CGFobject, CGFappearance} from '../lib/CGF.js';
/**
* MyPlane
* @constructor
 * @param scene - Reference to MyScene object
 * @param nDivs - number of divisions in both directions of the surface
 * @param minS - minimum texture coordinate in S
 * @param maxS - maximum texture coordinate in S
 * @param minT - minimum texture coordinate in T
 * @param maxT - maximum texture coordinate in T
*/
export class MyPlane extends CGFobject {
	constructor(scene, nrDivs, minS, maxS, minT, maxT, texture) {
		super(scene);
		// nrDivs = 1 if not provided
		nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;
		this.nrDivs = nrDivs;
		this.patchLength = 1.0 / nrDivs;
		this.minS = minS || 0;
		this.maxS = maxS || 1;
		this.minT = minT || 0;
		this.maxT = maxT || 1;
		this.q = (this.maxS - this.minS) / this.nrDivs;
		this.w = (this.maxT - this.minT) / this.nrDivs;

		this.texture = texture;
				
		this.material = new CGFappearance(scene);
		this.material.setAmbient(0.5, 0.5, 0.5, 1);
		this.material.setDiffuse(0.5, 0.5, 0.5, 1);
		this.material.setSpecular(0, 0, 0, 1);
		this.material.setEmission(0, 0, 0, 1);
		this.material.setTexture(this.texture);
		this.material.setTextureWrap('MIRRORED_REPEAT', 'REPEAT');
		this.material.setShininess(10);

		this.initBuffers();
	}
	initBuffers() {
		// Generate vertices, normals, and texCoords
		this.vertices = [];
		this.normals = [];
		this.texCoords = [];
		var yCoord = 0.5;
		for (var j = 0; j <= this.nrDivs; j++) {
			var xCoord = -0.5;
			for (var i = 0; i <= this.nrDivs; i++) {
				this.vertices.push(xCoord, yCoord, 0);
				this.normals.push(0, 0, 1);
				const repeats = 15;  
				const du = repeats / this.nrDivs;
				const dv = repeats / this.nrDivs;

				this.texCoords = [];

				for (let j = 0; j <= this.nrDivs; j++) {
					for (let i = 0; i <= this.nrDivs; i++) {
						this.texCoords.push(i * du, j * dv);
					}
				}
				xCoord += this.patchLength;
			}
			yCoord -= this.patchLength;
		}
		// Generating indices
		this.indices = [];

		var ind = 0;
		for (var j = 0; j < this.nrDivs; j++) {
			for (var i = 0; i <= this.nrDivs; i++) {
				this.indices.push(ind);
				this.indices.push(ind + this.nrDivs + 1);
				ind++;
			}
			if (j + 1 < this.nrDivs) {
				this.indices.push(ind + this.nrDivs);
				this.indices.push(ind);
			}
		}
		this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
		this.initGLBuffers();
	}

	setFillMode() { 
		this.primitiveType=this.scene.gl.TRIANGLE_STRIP;
	}

	setLineMode() 
	{ 
		this.primitiveType=this.scene.gl.LINES;
	};

	display() {
		this.material.apply();
		super.display();
	}

}


