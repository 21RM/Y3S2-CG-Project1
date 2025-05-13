import { CGFobject, CGFshader } from "../lib/CGF.js";
import { MyGrassBlade } from "./MyGrassBlade.js";

export class MyGrass extends CGFobject {
    constructor(scene, bladeCount = 2000, areaRadius = 200) {
        super(scene);
        this.blade = new MyGrassBlade(scene);
        

        this.offsets = new Float32Array(bladeCount * 3);
        this.scales = new Float32Array(bladeCount);
        this.rotations = new Float32Array(bladeCount);

        for (let i = 0; i < bladeCount; ++i) {
            const r = Math.random() * areaRadius;
            const θ = Math.random() * Math.PI * 2;
            this.offsets.set([Math.cos(θ)*r, 0, Math.sin(θ)*r], 3*i);
            this.scales[i]    = 0.8 + Math.random() * 0.4;
            this.rotations[i] = Math.random() * Math.PI * 2;
        }

        this.grassShader = new CGFshader(
            this.scene.gl,
            "shaders/grass-inst.vert",
            "shaders/grass-inst.frag"
        );

        this.blade.setInstancedAttribute("aOffset",   3, this.offsets);
        this.blade.setInstancedAttribute("aScale",    1, this.scales);
        this.blade.setInstancedAttribute("aRotation", 1, this.rotations);

        this.time = 0;
    }

    update(dt) {
        this.time += dt * 0.001;
        this.grassShader.setUniformsValues({ time: this.time })
    }

    display() {
        const gl = this.scene.gl;

        this.scene.setActiveShader(this.grassShader);

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
        
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}