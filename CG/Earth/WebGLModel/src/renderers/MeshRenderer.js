class MeshRender{
    #vertexBuffer;
    #normalBuffer;
    #texcoordBuffer;
    #indicesBuffer;

    /**
     * @param {WebGLRenderingContext } gl
     * @param {Mesh} mesh 
     * @param {Material} material 
     * @param {Shader} this.shader
     */
    constructor(gl, mesh, material) {

		this.gl = gl;
		this.mesh = mesh;
		this.material = material;

		this.#vertexBuffer = gl.createBuffer();
		this.#normalBuffer = gl.createBuffer();
		this.#texcoordBuffer = gl.createBuffer();
		this.#indicesBuffer = gl.createBuffer();

		let extraAttribs = []
		if (mesh.hasVertices) {
			extraAttribs.push(mesh.verticesName);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}

		if (mesh.hasNormals) {
			extraAttribs.push(mesh.normalsName);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.#normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}

		if (mesh.hasTexcoords) {
			extraAttribs.push(mesh.texcoordsName);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.#texcoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, mesh.texcoords, gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indicesBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		this.material.setMeshAttribs(extraAttribs);
		this.shader = this.material.compile(gl);
	}

	updateVerties(){
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.mesh.newvertices, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}
	updateNormals(){
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.#normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.mesh.newNormal, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}


    bindGeometryInfo(){
        const gl = this.gl;
        if(this.mesh.hasVertices){
            const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER,this.#vertexBuffer);
            gl.vertexAttribPointer(
                this.shader.program.attribs[this.mesh.verticesName],
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(this.shader.program.attribs[this.mesh.verticesName]);
        }

        if (this.mesh.hasNormals) {
			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, this.#normalBuffer);
			gl.vertexAttribPointer(
				this.shader.program.attribs[this.mesh.normalsName],
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				this.shader.program.attribs[this.mesh.normalsName]);
		}

		if (this.mesh.hasTexcoords) {
			const numComponents = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			//console.log(this.shader.program.attribs[this.mesh.texcoordsName]);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.#texcoordBuffer);
			gl.vertexAttribPointer(
				this.shader.program.attribs[this.mesh.texcoordsName],
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				this.shader.program.attribs[this.mesh.texcoordsName]);
		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indicesBuffer);

    }

    bindCameraParameters(camera) {
		const gl = this.gl;

		let modelMatrix = mat4.create();
		let viewMatrix = mat4.create();
		let projectionMatrix = mat4.create();
		// Model transform
		mat4.identity(modelMatrix);
		mat4.translate(modelMatrix, modelMatrix, this.mesh.transform.translate);
		mat4.scale(modelMatrix, modelMatrix, this.mesh.transform.scale);
		// View transform
		camera.updateMatrixWorld();
		mat4.invert(viewMatrix, camera.matrixWorld.elements);
		// mat4.lookAt(viewMatrix, cameraPosition, [0,0,0], [0,1,0]);
		// Projection transform
		mat4.copy(projectionMatrix, camera.projectionMatrix.elements);

		gl.uniformMatrix4fv(
			this.shader.program.uniforms.uProjectionMatrix,
			false,
			projectionMatrix);
		gl.uniformMatrix4fv(
			this.shader.program.uniforms.uModelMatrix,
			false,
			modelMatrix);
		gl.uniformMatrix4fv(
			this.shader.program.uniforms.uViewMatrix,
			false,
			viewMatrix);
		gl.uniform3fv(
			this.shader.program.uniforms.uCameraPos,
			[camera.position.x, camera.position.y, camera.position.z]);
	}

    bindMaterialParameters() {
		const gl = this.gl;

		let textureNum = 0;
		//console.log(this.material.uniforms);
		for (let k in this.material.uniforms) {

			if (this.material.uniforms[k].type == 'matrix4fv') {
				gl.uniformMatrix4fv(
					this.shader.program.uniforms[k],
					false,
					this.material.uniforms[k].value);
			} else if (this.material.uniforms[k].type == '3fv') {
				gl.uniform3fv(
					this.shader.program.uniforms[k],
					this.material.uniforms[k].value);
			} else if (this.material.uniforms[k].type == '1f') {
				//console.log(this.material.uniforms[k].value);
				gl.uniform1f(
					this.shader.program.uniforms[k],
					this.material.uniforms[k].value);
			} else if (this.material.uniforms[k].type == '1i') {
				gl.uniform1i(
					this.shader.program.uniforms[k],
					this.material.uniforms[k].value);
			} else if (this.material.uniforms[k].type == 'texture') {
				gl.activeTexture(gl.TEXTURE0 + textureNum);
				gl.bindTexture(gl.TEXTURE_2D, this.material.uniforms[k].value.texture);
				gl.uniform1i(this.shader.program.uniforms[k], textureNum);
				textureNum += 1;
			}
		}
	}

    draw(camera){
        const gl = this.gl;
        gl.viewport(0.0,0.0,window.screen.width,window.screen.height);
        gl.useProgram(this.shader.program.glShaderProgram);

        this.bindGeometryInfo();
        this.bindCameraParameters(camera);
        this.bindMaterialParameters();

        const vertexCount = this.mesh.count;
		const type = gl.UNSIGNED_SHORT;
		const offset = 0;       
		gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);

    }

}