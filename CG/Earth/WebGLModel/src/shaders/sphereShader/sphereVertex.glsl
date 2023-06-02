attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;


varying highp vec3 vFragPos;
varying highp vec3 vNormal;


void pR(inout vec2 p, float a) {
	p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

float displace(vec3 p){
    pR(p.yz, sin(2.0 * uTime));
    return (sin(5.0 *p.x + 4.0 * uTime) * sin(10.0*p.y + sin(2.0 * uTime)) * sin(15.0*p.z + 6.0 * uTime));
}

void main(void) {

  vFragPos = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz;
  vNormal = (uModelMatrix * vec4(aNormalPosition, 0.0)).xyz;

  vec3 position = aVertexPosition + aNormalPosition*displace(aVertexPosition)*0.15;

  //vTextureCoord = aTextureCoord;
  //vPositionFromLight = uLightMVP * vec4(aVertexPosition, 1.0);
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix *
                vec4(position, 1.0);
  //gl_Position = vPositionFromLight;
}