attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

varying highp vec2 vTextureCoord;



void main(void) {

  vTextureCoord = aTextureCoord;
  gl_Position = vec4(aVertexPosition, 1.0);

}