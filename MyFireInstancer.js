import { CGFobject, CGFshader, CGFtexture } from "../lib/CGF.js";
import { MyFireCone } from "./MyFireCone.js";

export class MyFireInstancer extends CGFobject {
  /**
   * @param {CGFscene} scene
   * @param {Number}    totalCones   Total cones to allocate room for
   */
    constructor(scene, totalCones = 1000) {
        super(scene);
        this.gl = scene.gl;

        this.time = 0;

        this.totalCones = totalCones;

        this.offsets = new Float32Array(totalCones * 3);
        this.axes = new Float32Array(totalCones * 3);
        this.angles = new Float32Array(totalCones);
        this.scales = new Float32Array(totalCones * 3);

        this.cone = new MyFireCone(scene, 8);

        this.fireTex = new CGFtexture(this.scene, "textures/fire.png");

        this.fireShader = new CGFshader(this.gl, "shaders/fire-cone.vert", "shaders/fire-cone.frag");

        this.scene.setActiveShader(this.fireShader);

        this.cone.setInstancedAttribute("aOffset", 3, this.offsets);
        this.cone.setInstancedAttribute("aAxis", 3, this.axes);
        this.cone.setInstancedAttribute("aAngle", 1, this.angles);
        this.cone.setInstancedAttribute("aScale", 3, this.scales);


        const gl = this.gl;
        const prog = gl.getParameter(gl.CURRENT_PROGRAM);

        gl.bindVertexArray(this.cone.vao);

        let loc = gl.getAttribLocation(prog, "aVertexPosition");
        if (loc < 0) {
            console.warn("fireShader: no aVertexPosition attribute found.");
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cone.vertsBuffer);
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
        }
        loc = gl.getAttribLocation(prog, "aVertexNormal");
        if (loc >= 0) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cone.normsBuffer);
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
        }

        loc = gl.getAttribLocation(prog, "aTextureCoord");
        if (loc < 0) {
            console.warn("fireShader: no aTextureCoord attribute found.");
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cone.texCoordsBuffer);
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        }

        if (this.cone.indicesBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cone.indicesBuffer);
        }

        gl.bindVertexArray(null);


        this.scene.setActiveShaderSimple(this.scene.defaultShader);

        this.usedCones = 0;
    }


    resetAll() {
        this.usedCones = 0;
    }


    addCone({ offset, axis, angle, scale }) {
        const i = this.usedCones++;
        if (i >= this.totalCones) {
            console.warn("Exceeded totalCones in FireInstancer " + this.totalCones);
            return;
        }
        this.offsets.set(offset, i * 3);
        this.axes.set(axis, i * 3);
        this.angles[i] = angle;
        this.scales.set(scale, i * 3);
    }


    uploadBuffers() {
        this.scene.setActiveShader(this.fireShader);

        this.cone.setInstancedAttribute("aOffset", 3, this.offsets);
        this.cone.setInstancedAttribute("aAxis", 3, this.axes);
        this.cone.setInstancedAttribute("aAngle", 1, this.angles);
        this.cone.setInstancedAttribute("aScale", 3, this.scales);

        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }

    update(dt) {
        this.time += dt * 0.001;
        this.fireShader.setUniformsValues({ uTime: this.time })
    }

    display() {
        const gl = this.scene.gl;
        this.scene.setActiveShader(this.fireShader);
        this.scene.updateProjectionMatrix();
        this.fireShader.setUniformsValues({
            uMVMatrix: this.scene.activeMatrix,
            uNMatrix: this.scene.invMatrix
        });
        this.fireTex.bind(0); 
        gl.bindVertexArray(this.cone.vao);
        gl.drawElementsInstanced(
            this.cone.primitiveType,
            this.cone.indices.length,
            gl.UNSIGNED_SHORT,
            0,
            this.usedCones
        );
        gl.bindVertexArray(null);
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }
}