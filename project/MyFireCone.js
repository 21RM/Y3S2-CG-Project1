import { CGFobject, CGFshader } from "../lib/CGF.js";

export class MyFireCone extends CGFobject {

    constructor(scene, slices = 8) {
        super(scene);
        this.gl = scene.gl;
        this.slices = slices;

        // 1) Create the VAO
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        // 2) Build the cone’s geometry (unit cone)
        this.initBuffers();
        this.initGLBuffers();

        // 3) Unbind VAO
        this.gl.bindVertexArray(null);
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        this.indices = [];

        this.vertices.push(0, 1, 0);
        this.normals.push(0, 1, 0); 
        this.texCoords.push(0.5, 1.0);

        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 0.5);

        const angleStep = (2 * Math.PI) / this.slices;
        for (let i = 0; i <= this.slices; i++) {
            const ang = i * angleStep;
            const x = Math.cos(ang);
            const z = Math.sin(ang);

            const sideNormal = [x, 0, z];
            const length = Math.hypot(x, 1, z); 

            const nx = x / length;
            const ny = 1 / length;
            const nz = z / length;

            this.vertices.push(x, 0, z);
            this.normals.push(nx, ny, nz);
            this.texCoords.push(i / this.slices, 0);
        }

        for (let i = 0; i < this.slices; i++) {
            this.indices.push(1, 2 + i, 2 + i + 1);
        }

        for (let i = 0; i < this.slices; i++) {
            this.indices.push(0, 2 + i + 1, 2 + i);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
    }


    setInstancedAttribute(name, size, data) {
        const gl = this.gl;
        const program = gl.getParameter(gl.CURRENT_PROGRAM);
        if (!program) {
            console.warn("No shader bound when setting instanced attribute", name);
            return;
        }

        const loc = gl.getAttribLocation(program, name);

        if (loc < 0) {
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
        gl.bindVertexArray(null);
    }


    displayInstanced(count) {
        const gl = this.gl;
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        gl.drawElementsInstanced(this.primitiveType, this.indices.length, gl.UNSIGNED_SHORT, 0, count);
        gl.bindVertexArray(null);
    }
}