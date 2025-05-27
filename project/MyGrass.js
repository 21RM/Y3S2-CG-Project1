import { CGFobject, CGFshader } from "../lib/CGF.js";
import { MyGrassBlade } from "./MyGrassBlade.js";

export class MyGrass extends CGFobject {
    constructor(scene, bladeCount = 1000000, areaRadius = 200) {
        super(scene);
        
        this.offsets = new Float32Array(bladeCount * 3);
        this.scales = new Float32Array(bladeCount);
        this.rotations = new Float32Array(bladeCount);

        const lakeCenter = [140, -80];
        const lakeRadius = 81;

        const pathPoints = [
            [0, 100 ],
            [-2.5, 90],
            [-5, 85],
            [-7.5, 82.5],
            [-10, 80],
            [-11.25, 77.5],
            [-12.5, 75],
            [-13.75, 72.5],
            [-15, 70],
            [-15, 66.67],
            [-15, 63.33],
            [-15, 60],
            [-12, 40 ],
            [-8, 20 ],
            [-4, 10 ],
            [-2, 4 ],
            [1, -2 ],
            [2, -2.75 ],
            [3.5, -3.5 ],
            [5, -4.25 ],
            [6, -5 ],
            [7, -6.67 ],
            [8, -8.33 ],
            [10, -10 ],
            [ 30, -22 ],
            [ 60, -34 ],
            [ 90, -56 ],
            [ 115, -73 ],
            [ 140, -90 ] 
        ];

        const pathWidth = 15; 

        const segments = [];
        for (let i = 0; i < pathPoints.length - 1; ++i) {
            const [x1, z1] = pathPoints[i];
            const [x2, z2] = pathPoints[i + 1];
            const dx = x2 - x1;
            const dz = z2 - z1;
            segments.push({ x1, z1, dx, dz, lenSq: dx*dx + dz*dz });
        }

        for (let i = 0; i < bladeCount; ++i) {
            let x, z;

            while (true) {
                const θ = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random()) * areaRadius;

                x = Math.cos(θ) * r;
                z = Math.sin(θ) * r;

                const dxL = x - lakeCenter[0];
                const dzL = z - lakeCenter[1];

                if (dxL*dxL + dzL*dzL < lakeRadius*lakeRadius) continue;
                if (this.distSqToPath(x, z, segments) < (pathWidth*0.5)*(pathWidth*0.5)) continue;

                break;
            }

            this.offsets.set([x, 0, z], 3 * i);
            this.scales[i] = 0.8 + Math.random() * 0.4;
            this.rotations[i] = Math.random() * Math.PI * 2;
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

    distSqToPath(px, pz, segments) {
        let min = Infinity;

        for (const s of segments) {
            const t = s.lenSq === 0 ? 0 : Math.max(0, Math.min(1,((px - s.x1)*s.dx + (pz - s.z1)*s.dz) / s.lenSq));

            const projX = s.x1 + t * s.dx;
            const projZ = s.z1 + t * s.dz;

            const dx = px - projX;
            const dz = pz - projZ;
            const dSq = dx*dx + dz*dz;

            if (dSq < min) min = dSq;
        }
        return min;
    }
}