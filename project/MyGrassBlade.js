import { CGFobject, CGFappearance } from "../lib/CGF.js";

export class MyGrassBlade extends CGFobject {
    constructor(scene) {
        super(scene);
        this.gl = scene.gl;
    
        this.material = new CGFappearance(scene);
        this.material.setAmbient(0.3,0.3,0.3,1);
        this.material.setDiffuse(0.7,0.7,0.7,1);
        this.material.setSpecular(0,0,0,1);
        this.material.setEmission(0,0,0,1);
        this.material.setShininess(10);
    
        this.initBuffers();
        this.initGLBuffers();
        this.gl.bindVertexArray(null);
    }

    initBuffers() {
        this.vertices = [
            -0.05, 0,  0,   
             0.05, 0,  0,   
             0.05, 1,  0,  
            -0.05, 1,  0,
             0, 0, -0.05,  
             0, 0,  0.05,  
             0, 1,  0.05, 
             0, 1, -0.05
        ];

        this.normals = Array(8*3).fill(0).map((v,i) => i%3===1?1:0);

        this.texCoords = [
            0,0, 1,0, 1,1, 0,1,
            0,0, 1,0, 1,1, 0,1
        ];

        this.indices = [
            0,1,2,    0,2,3,
            4,5,6,    4,6,7
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);
    }

    setTexture(tex) {
        this.material.setTexture(tex);
    }

    setInstancedAttribute(name, size, data) {
        const gl = this.gl;
        const program = gl.getParameter(gl.CURRENT_PROGRAM);
        if (!program) {
            console.warn("No shader bound when setting instanced attribute", name);
            return;
        }
        const loc = gl.getAttribLocation(program, name);
        if (loc<0) {
            console.warn(`Instanced attrib ${name} not found in shader`);
            return;
        }
        gl.bindVertexArray(this.vao);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(loc, 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    displayInstanced(count) {    
        const gl = this.gl;

        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        gl.drawElementsInstanced(this.primitiveType, this.indices.length, gl.UNSIGNED_SHORT, 0, count);
        gl.bindVertexArray(null);
    }
}