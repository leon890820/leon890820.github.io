#ifdef GL_ES
precision mediump float;
#endif




// Phong related variables
uniform vec3 color;
uniform vec3 uKs;
uniform vec3 uLightPos;
uniform vec3 uCameraPos;
uniform vec3 uLightIntensity;


varying highp vec3 vFragPos;
varying highp vec3 vNormal;


#define PI 3.141592653589793
#define PI2 6.283185307179586





vec3 blinnPhong() {
  vec3 c = color;
  c = pow(c, vec3(2.2));

  vec3 ambient = 0.2 * c;

  vec3 lightDir = normalize(uLightPos);
  vec3 normal = normalize(vNormal);
  float diff = max(dot(lightDir, normal), 0.0);
  vec3 light_atten_coff =
      uLightIntensity / pow(length(uLightPos - vFragPos), 2.0);
  vec3 diffuse = diff * light_atten_coff * c;

  vec3 viewDir = normalize(uCameraPos - vFragPos);
  vec3 halfDir = normalize((lightDir + viewDir));
  float spec = pow(max(dot(halfDir, normal), 0.0), 32.0);
  vec3 specular = uKs * light_atten_coff * spec;

  vec3 radiance = (ambient + diffuse + specular);
  vec3 phongColor = pow(radiance, vec3(1.0 / 2.2));
  return phongColor;
}

void main(void) {
  //vec3 xTangent = dFdx( vFragPos );
  //vec3 yTangent = dFdy( vFragPos );

  vec3 phongColor = blinnPhong();

  gl_FragColor = vec4(phongColor , 1.0);
  //gl_FragColor = vec4(phongColor, 1.0);
}