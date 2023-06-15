class TRSTransform{
    constructor(translate = [0,0,0],scale = [1,1,1]){
        this.translate = translate;
        this.scale = scale;
    }
}

class Mesh{
    constructor(verticesAttrib, normalsAttrib, texcoordsAttrib, indices, transform) {
		this.indices = indices;
		this.count = indices.length;
		this.hasVertices = false;
		this.hasNormals = false;
		this.hasTexcoords = false;

		const modelTranslation = [transform.modelTransX, transform.modelTransY, transform.modelTransZ];
		const modelScale = [transform.modelScaleX, transform.modelScaleY, transform.modelScaleZ];
		let meshTrans = new TRSTransform(modelTranslation, modelScale);
		this.transform = meshTrans;

		let extraAttribs = [];

		if (verticesAttrib != null) {
			this.hasVertices = true;
			this.vertices = verticesAttrib.array;
			this.verticesName = verticesAttrib.name;
		}
		if (normalsAttrib != null) {
			this.hasNormals = true;
			this.normals = normalsAttrib.array;
			this.normalsName = normalsAttrib.name;
		}
		if (texcoordsAttrib != null) {
			this.hasTexcoords = true;
			this.texcoords = texcoordsAttrib.array;
			this.texcoordsName = texcoordsAttrib.name;
		}
		console.log(this.texcoordsName);
	}

	update(time){
		var newPosition = [];
		//console.log(this.vertices);
		for(var i=0;i<this.vertices.length/3;i++){
			var a = Math.sin(7.0 *this.vertices[3 * i] + 8.0 * time) * Math.sin(13.0*this.vertices[3 * i + 1]  + Math.sin(3.0 * time)) * Math.sin(20.0*this.vertices[3 * i + 2] + 4.0 * time);
			newPosition.push(this.vertices[3 * i] + this.normals[3 * i] * a * 0.15); 
			newPosition.push(this.vertices[3 * i + 1] + this.normals[3 * i + 1] * a * 0.15); 
			newPosition.push(this.vertices[3 * i + 2] + this.normals[3 * i + 2] * a * 0.15); 
			
		}
		var newNormal = [];
		for(var i = 0;i<this.normals.length;i+=1){
			newNormal.push(0);		
		}
		for(var i=0;i<this.indices.length/3;i++){
			var p0 = [newPosition[this.indices[i * 3] * 3] , newPosition[this.indices[i * 3] * 3 + 1],newPosition[this.indices[i * 3] * 3 + 2]];
			var p1 = [newPosition[this.indices[i * 3 + 1] * 3] , newPosition[this.indices[i * 3 + 1] * 3 + 1],newPosition[this.indices[i * 3 + 1] * 3 + 2]];
			var p2 = [newPosition[this.indices[i * 3 + 2] * 3] , newPosition[this.indices[i * 3 + 2] * 3 + 1],newPosition[this.indices[i * 3 + 2] * 3 + 2]];
			var v1 = [p1[0]-p0[0],p1[1]-p0[1],p1[2]-p0[2]];
			var v2 = [p2[0]-p0[0],p2[1]-p0[1],p2[2]-p0[2]];
			var n = [v1[1]*v2[2]-v1[2]*v2[1],v1[2]*v2[0]-v1[0]*v2[2],v1[0]*v2[1]-v1[1]*v2[0]];
			newNormal[this.indices[i * 3] * 3    ] += n[0];
			newNormal[this.indices[i * 3] * 3 + 1] += n[1];
			newNormal[this.indices[i * 3] * 3 + 2] += n[2];

			newNormal[this.indices[i * 3 + 1] * 3   ]  += n[0];
			newNormal[this.indices[i * 3 + 1] * 3 + 1] += n[1];
			newNormal[this.indices[i * 3 + 1] * 3 + 2] += n[2];

			newNormal[this.indices[i * 3 + 2] * 3    ] += n[0];
			newNormal[this.indices[i * 3 + 2] * 3 + 1] += n[1];
			newNormal[this.indices[i * 3 + 2] * 3 + 2] += n[2];
		}
		
		
		
		this.newvertices = new Float32Array(newPosition);
		this.newNormal = new Float32Array(newNormal);
	
	}

    static cube(transform) {
		const positions = [
			// Front face
			-1.0, -1.0, 1.0,
			1.0, -1.0, 1.0,
			1.0, 1.0, 1.0,
			-1.0, 1.0, 1.0,

			// Back face
			-1.0, -1.0, -1.0,
			-1.0, 1.0, -1.0,
			1.0, 1.0, -1.0,
			1.0, -1.0, -1.0,

			// Top face
			-1.0, 1.0, -1.0,
			-1.0, 1.0, 1.0,
			1.0, 1.0, 1.0,
			1.0, 1.0, -1.0,

			// Bottom face
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, -1.0, 1.0,
			-1.0, -1.0, 1.0,

			// Right face
			1.0, -1.0, -1.0,
			1.0, 1.0, -1.0,
			1.0, 1.0, 1.0,
			1.0, -1.0, 1.0,

			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0, 1.0,
			-1.0, 1.0, 1.0,
			-1.0, 1.0, -1.0,
		];
		const indices = [
			0, 1, 2, 0, 2, 3,    // front
			4, 5, 6, 4, 6, 7,    // back
			8, 9, 10, 8, 10, 11,   // top
			12, 13, 14, 12, 14, 15,   // bottom
			16, 17, 18, 16, 18, 19,   // right
			20, 21, 22, 20, 22, 23,   // left
		];

		return new Mesh({ name: 'aVertexPosition', array: new Float32Array(positions) }, null, null, indices, transform);
	}

}


class Sphere{
	constructor(){}
	static sphere(resolution = 10,transform){
		var position = [];
		var normal = [];
		var uvs = [];
		position.push(0,1,0);
		normal.push(0,1,0);
		uvs.push(0.5,1)
		for(var i=1;i<resolution-1;i++){
			for(var j=0;j<resolution;j++){
				var theta = map(j,0,resolution-1,0,2*PI);
				var phi = map(i,0,resolution,0,PI);
				var u = map(theta,0,2*PI,1,0);
				var v = map(phi,0,PI,1,0);
				var x = Math.sin(phi) * Math.cos(theta);
				var y = Math.cos(phi);
				var z = Math.sin(phi) * Math.sin(theta);
				position.push(x,y,z);
				normal.push(x,y,z);		
				uvs.push(u,v);		
			}
		}
		position.push(0,-1,0);
		normal.push(0,-1,0);
		uvs.push(0.5,0);
		
		var indices = [];
		for(var i = 0;i<resolution;i++){
			indices.push(0);
			indices.push(1 + i%resolution);
			indices.push(1 + (i+1)%resolution);
		}
		for(var i = 0 ; i < resolution - 3 ; i++){
			for(var j = 0; j < resolution ; j++){
				
				indices.push(i * resolution + j + 1);
				indices.push(i * resolution + (j + 1)%resolution + 1);
				indices.push((i + 1) * resolution + (j + 1)%resolution + 1);

				indices.push(i * resolution + j + 1);
				indices.push((i + 1) * resolution + (j + 1)%resolution + 1);
				indices.push((i + 1) * resolution + j + 1);
			}
		}
		var s = (resolution-2)*resolution + 1;
		var s1 = (resolution-3) * resolution +1;
		for(var i = 0;i<resolution;i++){
			
			indices.push(s1+i);
			indices.push(s1+(i+1)%resolution);
			indices.push(s);
		}
		
		return new Mesh({name:'aVertexPosition',array:new Float32Array(position)},{name:'aNormalPosition',array:new Float32Array(normal)},{ name: 'aTextureCoord', array: new Float32Array(uvs) },indices,transform)


	}

	
}



