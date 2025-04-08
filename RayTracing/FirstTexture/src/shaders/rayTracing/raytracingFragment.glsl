#ifdef GL_ES
precision mediump float;
#endif

varying highp vec2 vTextureCoord;

void main(){  
  gl_FragColor = vec4(vTextureCoord.x,vTextureCoord.y,0.0,1.0);
}