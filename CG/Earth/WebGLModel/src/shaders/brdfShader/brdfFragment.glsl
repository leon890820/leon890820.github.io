#ifdef GL_ES
precision mediump float;
#endif

// Phong related variables
uniform sampler2D uSampler;
uniform sampler2D uRoughness;
uniform vec3 uKs;
uniform vec3 uLightPos;
uniform vec3 uCameraPos;
uniform vec3 uLightIntensity;

varying highp vec2 vTextureCoord;
varying highp vec3 vFragPos;
varying highp vec3 vNormal;

#define PI 3.141592653589793
#define PI2 6.283185307179586

varying vec4 vPositionFromLight;


float DistributionGGX(vec3 N, vec3 H, float roughness)
{
   // TODO: To calculate GGX NDF here

    float a = roughness*roughness;
    float a2 = a*a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;

    float nom   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / max(denom, 0.0001);
}



float GeometrySchlickGGX(float NdotV, float roughness)
{
    // TODO: To calculate Smith G1 here

    float a = roughness;
    float k = (a * a) / 2.0;

    float nom = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}

float Fd_Lambert() {
    return 1.0 / PI;
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    // TODO: To calculate Smith G here

    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}

vec3 fresnelSchlick(vec3 F0, vec3 V, vec3 H)
{
    // TODO: To calculate Schlick F here
    return F0 + (1.0 - F0) * pow(clamp(1.0 - max(dot(H, V), 0.0), 0.0, 1.0), 5.0);
}

float map(float n,float x0,float x1,float y0,float y1){
    return (y1-y0)*(n-x0)/(x1-x0) + y0;
}

vec3 brdf(){
    float perceptualRoughness = 1.0;
    
    vec3 Lo = vec3(0.0);
    vec3 albedo = texture2D(uSampler, vTextureCoord).rgb;  
    float roughness = texture2D(uRoughness, vTextureCoord).r;
    roughness = map(roughness , 0.0 , 1.0 , 0.8 , 0.3);
    albedo = pow(albedo, vec3(2.2));
    float uMetallic = 1.0;
    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, albedo, uMetallic);

    vec3 L = normalize(uLightPos);   
    vec3 N = normalize(vNormal);
    vec3 V = normalize(uCameraPos - vFragPos);
    vec3 H = normalize(V + L);
    float NdotV = max(dot(N, V), 0.0);

    float NDF = DistributionGGX(N, H, roughness);   
    float G   = GeometrySmith(N, V, L, roughness);
    vec3 F = fresnelSchlick(F0, V, H);
    vec3 numerator    = NDF * G * F; 
    float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);
    vec3 Fmicro = numerator / max(denominator, 0.001); 
    
    float NdotL = max(dot(N, L), 0.0);  

    vec3 radiance = vec3(0.8,0.8,0.8);

    vec3 Fd = albedo*Fd_Lambert();

    vec3 BRDF = Fmicro  + Fd;
    Lo += BRDF * radiance * NdotL;
    vec3 color = Lo;
  
    //color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0/2.2)); 
    

    return color;

}


vec3 blinnPhong() {
  vec3 color = texture2D(uSampler, vTextureCoord).rgb;
  color = pow(color, vec3(2.2));

  vec3 ambient = 0.05 * color;

  vec3 lightDir = normalize(uLightPos);
  vec3 normal = normalize(vNormal);
  float diff = max(dot(lightDir, normal), 0.0);
  vec3 light_atten_coff =
      uLightIntensity / pow(length(uLightPos - vFragPos), 2.0);
  vec3 diffuse = diff  * color * vec3(0.6,0.6,0.6);

  vec3 viewDir = normalize(uCameraPos - vFragPos);
  vec3 halfDir = normalize((lightDir + viewDir));
  float spec = pow(max(dot(halfDir, normal), 0.0), 32.0);
  vec3 specular = vec3(0.3,0.3,0.3) * light_atten_coff * spec;

  vec3 radiance = (ambient + diffuse + specular);
  vec3 phongColor = pow(radiance, vec3(1.0 / 2.2));
  return phongColor;
}

void main(void) {

  float visibility;
  vec3 shadowCoord = (vPositionFromLight.xyz / vPositionFromLight.w +1.0) * 0.5;
  //visibility = useShadowMap(uShadowMap, vec4(shadowCoord, 1.0));
  //visibility = PCF(uShadowMap, vec4(shadowCoord, 1.0));
  //visibility = PCSS(uShadowMap, vec4(shadowCoord, 1.0));

  vec3 phongColor = brdf();

  gl_FragColor = vec4(phongColor , 1.0);
  //gl_FragColor = vec4(phongColor, 1.0);
}