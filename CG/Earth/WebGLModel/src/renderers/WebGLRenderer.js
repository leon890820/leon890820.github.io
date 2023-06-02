class WebGLRenderer {
    meshes = [];
    shadowMeshes = [];
    lights = [];

    /**
     * @param {WebGLRenderingContext } gl
     */

    constructor(gl, camera) {
        this.gl = gl;
        this.camera = camera;
        this.count = 0;
    }

    addLight(light) {
        this.lights.push({
            entity: light,
            meshRender: new MeshRender(this.gl, light.mesh, light.mat)
        });
    }
    addMeshRender(mesh) { this.meshes.push(mesh); }
    addShadowMeshRender(mesh) { this.shadowMeshes.push(mesh); }
    
    render() {
        const gl = this.gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        
        console.assert(this.lights.length != 0, "No light");
        console.assert(this.lights.length == 1, "Multiple lights");
        var t = map(Date.now()%20000,0,20000,0,2*PI);

        if(this.meshes[0]) {
            this.meshes[0].mesh.update(t);
            this.meshes[0].updateVerties();
            this.meshes[0].updateNormals();
            //console.log(this.meshes[0]);
        }
        
        for (let l = 0; l < this.lights.length; l++) {
            // Draw light
            // TODO: Support all kinds of transform
            this.lights[l].meshRender.mesh.transform.translate = this.lights[l].entity.lightPos;
            this.lights[l].meshRender.draw(this.camera);           

            // Camera pass
            for (let i = 0; i < this.meshes.length; i++) {
                this.gl.useProgram(this.meshes[i].shader.program.glShaderProgram);
                this.gl.uniform3fv(this.meshes[i].shader.program.uniforms.uLightPos, this.lights[l].entity.lightPos);
                this.meshes[i].draw(this.camera);
            }
            
        }
        
    }

}