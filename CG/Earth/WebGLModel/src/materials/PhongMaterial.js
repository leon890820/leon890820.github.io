class PhongMaterial extends Material {

    constructor(color, specular, light, translate, scale, vertexShader, fragmentShader) {
        let lightMVP = light.CalcLightMVP(translate, scale);
        let lightIntensity = light.mat.GetIntensity();

        super({
            // Phong
            'uSampler': { type: 'texture', value: color },
            'uKs': { type: '3fv', value: specular },
            'uLightIntensity': { type: '3fv', value: lightIntensity },
            // Shadow
            'uLightMVP': { type: 'matrix4fv', value: lightMVP },

        }, [], vertexShader, fragmentShader);
    }
}

async function buildPhongMaterial(color, specular, light, translate, scale, vertexPath, fragmentPath) {


    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);
    //console.log(specular);
    return new PhongMaterial(color, specular, light, translate, scale, vertexShader, fragmentShader);

}

class SphereMaterial extends Material{
    constructor(color,specular,light,time,vertexShader,fragmentShader){
        let lightIntensity = light.mat.GetIntensity();
        super({
            // Phong
            'color': { type: '3fv', value: color },
            'uKs': { type: '3fv', value: specular },
            'uLightIntensity': { type: '3fv', value: lightIntensity },
            'uTime': { type: '1f', value: time },
        }, [], vertexShader, fragmentShader);
    }

}

async function buildSphereMaterial(color,specular, light,time, vertexPath, fragmentPath) {

    
    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);
    
    
    return new SphereMaterial(color,specular, light,time, vertexShader, fragmentShader);

}



class BRDFMaterial extends Material {

    constructor(color, roughness ,specular, light, translate, scale, vertexShader, fragmentShader) {
        let lightMVP = light.CalcLightMVP(translate, scale);
        let lightIntensity = light.mat.GetIntensity();

        super({
            // Phong
            'uSampler': { type: 'texture', value: color },
            'uRoughness': { type: 'texture', value: roughness },
            'uKs': { type: '3fv', value: specular },
            'uLightIntensity': { type: '3fv', value: lightIntensity },
            // Shadow
            'uLightMVP': { type: 'matrix4fv', value: lightMVP },

        }, [], vertexShader, fragmentShader);
    }
}

async function buildBRDFMaterial(color, roughness ,specular, light, translate, scale, vertexPath, fragmentPath) {


    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);
    //console.log(specular);
    return new BRDFMaterial(color, roughness ,specular, light, translate, scale, vertexShader, fragmentShader);

}

