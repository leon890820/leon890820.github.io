class EmissiveMaterial extends Material{
    constructor(lightIntensity,lightColor){
        super({
            'uLigIntensity' : {type:'1f',value:lightIntensity},
            'uLightColor': {type : '3fv',value:lightColor}
        },[],LightCubeVertexShader,LightCubeFragmentShader);

        this.lightIntensity = lightIntensity;
        this.lightColor = lightColor;
    }
    GetIntensity(){
        return[this.lightIntensity*this.lightColor[0],this.lightIntensity*this.lightColor[1],this.lightIntensity*this.lightColor[2]];
    }
}