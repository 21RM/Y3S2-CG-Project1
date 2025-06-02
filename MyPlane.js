import {CGFobject, CGFappearance, CGFshader, CGFtexture} from '../lib/CGF.js';
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
	constructor(scene, nrDivs, minS, maxS, minT, maxT, grassUrl, maskUrl) {
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

		this.grassTexture = new CGFtexture(scene, grassUrl);
    	this.maskTexture = new CGFtexture(scene, maskUrl);
				
		this.material = new CGFappearance(scene);
		this.material.setAmbient(1, 1, 1, 1);
		this.material.setDiffuse(0.5, 0.5, 0.5, 1);
		this.material.setSpecular(0, 0, 0, 1);
		this.material.setEmission(1, 1, 1, 1);
		this.material.setTexture(this.grassTexture);
		this.material.setTextureWrap('MIRRORED_REPEAT', 'REPEAT');
		this.material.setShininess(10);

		this.groundShaders = new CGFshader(this.scene.gl, 'shaders/ground.vert', 'shaders/ground.frag');
		this.groundShaders.setUniformsValues({
			uGrassSampler: 0,
      		uMaskSampler: 1,
			uRepeats: 15.0 
		});

		this.initBuffers();
	}
	initBuffers() {
		this.vertices = [];
		this.normals  = [];
		this.texCoords = [];
		this.indices = [];

		const repeats = 15;
		const step = 1.0 / this.nrDivs;
		let y = 0.5;

		for (let j = 0; j <= this.nrDivs; j++) {
			let x = -0.5;
			for (let i = 0; i <= this.nrDivs; i++) {
				this.vertices.push(x, y, 0);
				this.normals.push(0, 0, 1);

				const u = (i * repeats) / this.nrDivs;
				const v = (j * repeats) / this.nrDivs;
				this.texCoords.push(u, v);

				x += step;
			}
			y -= step;
		}

		let index = 0;
		for (let j = 0; j < this.nrDivs; j++) {
			for (let i = 0; i <= this.nrDivs; i++) {
				this.indices.push(index);
				this.indices.push(index + this.nrDivs + 1);
			index++;
			}
			if (j + 1 < this.nrDivs) {
				this.indices.push(index + this.nrDivs);
				this.indices.push(index);
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
		const gl = this.scene.gl;

		if(!this.scene.frSaver){
			this.scene.setActiveShader(this.groundShaders);
		}

		gl.enable(gl.BLEND);
    	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		this.material.apply();
		
		this.maskTexture.bind(1);

		super.display();
		gl.disable(gl.BLEND);

		if(!this.scene.frSaver){
			this.scene.setActiveShader(this.scene.defaultShader);
		}
	}

}


