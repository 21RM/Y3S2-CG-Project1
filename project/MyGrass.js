import { CGFobject, CGFshader } from "../lib/CGF.js";
import { MyGrassBlade } from "./MyGrassBlade.js";

export class MyGrass extends CGFobject {
    constructor(scene, bladeCount = 1000000, areaRadius = 200) {
        super(scene);
        
        this.offsets = new Float32Array(bladeCount * 3);
        this.scales = new Float32Array(bladeCount);
        this.rotations = new Float32Array(bladeCount);

        for (let i = 0; i < bladeCount; ++i) {
            const θ = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * areaRadius;

            this.offsets.set([Math.cos(θ) * r, 0, Math.sin(θ) * r], 3 * i);
            this.scales[i]     = 0.8 + Math.random() * 0.4;
            this.rotations[i]  = Math.random() * Math.PI * 2;
        }

        this.grassShader = new CGFshader(
            this.scene.gl,
            "shaders/grass-inst.vert",
            "shaders/grass-inst.frag"
        );
        this.scene.setActiveShader(this.grassShader);

        const yellowishGreen = [0.569, 0.486, 0.318];
        this.grassShader.setUniformsValues({ uGrassColor: yellowishGreen });
        const L = this.scene.lights[0];
        const dir = vec3.fromValues(
            L.spot_direction[0],
            L.spot_direction[1],
            L.spot_direction[2]
        );
        vec3.normalize(dir, dir);
        this.grassShader.setUniformsValues({
            uAmbientColor : [0.75, 0.75, 0.75],
            uLightColor   : [0.1, 0.1, 0.1],
            uLightDirection : dir
        });

        this.blade = new MyGrassBlade(scene);
        this.blade.setInstancedAttribute("aOffset", 3, this.offsets);
        this.blade.setInstancedAttribute("aScale", 1, this.scales);
        this.blade.setInstancedAttribute("aRotation", 1, this.rotations);
        
         /* -------- attach *static* attributes to the same VAO once ------ */
        const gl   = scene.gl;
        const prog = gl.getParameter(gl.CURRENT_PROGRAM);
        gl.bindVertexArray(this.blade.vao);

        /* positions ----------------------------------------------------- */
        let loc = gl.getAttribLocation(prog, "aVertexPosition");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.blade.vertsBuffer);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);

        /* normals ------------------------------------------------------- */
        loc = gl.getAttribLocation(prog, "aVertexNormal");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.blade.normsBuffer);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);

        /* texture coordinates ------------------------------------------ */
        loc = gl.getAttribLocation(prog, "aTextureCoord");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.blade.texCoordsBuffer);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        gl.bindVertexArray(null);


        this.scene.setActiveShaderSimple(this.scene.defaultShader);

        this.time = 0;
    }

    update(dt) {
        this.time += dt * 0.001;
        this.grassShader.setUniformsValues({ time: this.time })
    }

    display() {
        const gl = this.scene.gl;

        this.scene.setActiveShader(this.grassShader);

        this.grassShader.setUniformsValues({
            uMVMatrix: this.scene.activeMatrix,   // identity at this point
            uNMatrix:  this.scene.invMatrix       // also identity
        });

        gl.bindVertexArray(this.blade.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.blade.indicesBuffer);

        gl.drawElementsInstanced(
            this.blade.primitiveType,
            this.blade.indices.length,
            gl.UNSIGNED_SHORT,
            0,
            this.scales.length
        );
        
        gl.bindVertexArray(null);

        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }
}