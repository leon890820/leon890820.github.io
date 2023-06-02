var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +  
  'attribute vec4 a_Normal;\n' +  
  'uniform mat4 u_MVPMatrix;\n'+
  'uniform mat4 u_MMatrix;\n'+
  'uniform vec3 u_lightPos;\n'+
  'varying vec3 v_lightPos;\n' + 
  'varying vec3 v_normal;\n' + 
  'varying vec3 v_worldPos;\n'+
  'void main() {\n' +
  '  gl_Position = u_MVPMatrix * a_Position;\n' +
  '  v_worldPos = (u_MMatrix * a_Position).xyz;\n'+
  '  v_normal = normalize((u_MMatrix * a_Normal).xyz);\n'+
  '  v_lightPos = u_lightPos;\n'+
  '}\n'; 

// Fragment shader program
var FSHADER_SOURCE = 
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec3 v_lightPos;\n' + 
  'varying vec3 v_normal;\n' + 
  'varying vec3 v_worldPos;\n'+
  'void main() {\n' +
  '  vec3 ambient = vec3(0.2,0.2,0.2);\n'+
  '  vec3 light_color = vec3(1.0,0.8,0.5);\n'+
  '  vec3 v = normalize(v_lightPos - v_worldPos);\n'+
  '  float ndotv = max( 0.0 , dot(v_normal,v) );\n'+
  '  vec3 diffuse = ndotv * light_color;\n'+
  '  gl_FragColor = vec4(diffuse + ambient, 1.0);\n' +
  '}\n';


function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');
  
    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    var n = initVertexBuffers(gl);
    if(n<0){
      console.log("Fail to get buffer");
      return;
    }
    gl.clearColor(0.0 , 0.0 , 0.0 , 1.0);
    gl.enable(gl.DEPTH_TEST);

    var u_MVPMatrix = gl.getUniformLocation(gl.program,'u_MVPMatrix');
    var u_MMatrix = gl.getUniformLocation(gl.program,'u_MMatrix');
    var u_lightPos = gl.getUniformLocation(gl.program,'u_lightPos');
    if(!u_MVPMatrix || !u_lightPos || !u_MMatrix){
      console.log("Can't find location of u_MVPMatrix or u_lightPos");
      return;
    }
    var currentAngle = 0.0;

    var tick = function() {
      currentAngle = animate(currentAngle);
      var mvpMatrix = new Matrix4();
      
      mvpMatrix.setPerspective(30, 1, 1, 100);
      mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

      var mMatrix = new Matrix4();
      mMatrix.setRotate(currentAngle,0,1,0);

      mvpMatrix.multiply(mMatrix);
      gl.uniformMatrix4fv(u_MVPMatrix,false,mvpMatrix.elements);
      gl.uniformMatrix4fv(u_MMatrix,false,mMatrix.elements);
      var lightPos = new Vector3([5 , 5 , 5]);
      gl.uniform3fv(u_lightPos,lightPos.elements);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);
      
      window.requestAnimationFrame(tick, canvas);
    };
    tick(); 
    
}


function initVertexBuffers(gl){
  var vertices = new Float32Array([   // Coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
  ]);

  var normals = new Float32Array([    // Normal
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
  ]);

  var indices = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
]);

  var vertexBuffer = gl.createBuffer();
  var normalBuffer = gl.createBuffer();
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

  var FSIZE = vertices.BYTES_PER_ELEMENT;
  var a_position = gl.getAttribLocation(gl.program,'a_Position');
  if(a_position < 0) {
    console.log("Can't find the position location");
    return -1;
  }
  

  gl.vertexAttribPointer(a_position,3,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(a_position);

  var a_normal = gl.getAttribLocation(gl.program,'a_Normal');
  if(a_normal < 0) {
    console.log("Can't find the normal location");
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,normals,gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_normal,3,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(a_normal);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);

return indices.length;

}

var ANGLE_STEP = 40;   // The increments of rotation angle (degrees)

var last = Date.now(); // Last time that this function was called
function animate(angle) {
  var now = Date.now();   // Calculate the elapsed time
  var elapsed = now - last;
  last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle % 360;
}