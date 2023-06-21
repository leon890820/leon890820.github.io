let PI = 3.1415926;
function map(n,x0,x1,y0,y1){
    return (y1-y0)*(n-x0)/(x1-x0) + y0;
}

function loadSphere(renderer,light,time,resolution,transform){
    sphere = Sphere.sphere(resolution,transform);
    console.log(time);
    material = buildSphereMaterial( [ 0.5 , 0.9 , 0.8 ] , [ 1 , 1 , 1 ] , light, time , "./src/shaders/sphereShader/sphereVertex.glsl", "./src/shaders/sphereShader/sphereFragment.glsl");

    material.then((data) => {
        let meshRender = new MeshRender(renderer.gl, sphere, data);
        renderer.addMeshRender(meshRender);
    });
    
}

function loadEarth(renderer,light,resolution,transform){
    sphere = Sphere.sphere(resolution,transform);
    var image = new Image();
    var roughness = new Image();
    var colorMap = new Texture();

    image.onload = function(){           
        colorMap.CreateImageTexture(renderer.gl, image);              
    }

    roughness.onload = function(){      
        var roughnessMap = new Texture();     
        roughnessMap.CreateImageTexture(renderer.gl, roughness);      
        
        let Translation = [transform.modelTransX, transform.modelTransY, transform.modelTransZ];
        let Scale = [transform.modelScaleX, transform.modelScaleY, transform.modelScaleZ];
        material = buildBRDFMaterial( colorMap ,roughnessMap, [ 1 , 1 , 1 ] , light, Translation,Scale , "./src/shaders/brdfShader/brdfVertex.glsl", "./src/shaders/brdfShader/brdfFragment.glsl");

        material.then((data) => {
            let meshRender = new MeshRender(renderer.gl, sphere, data);
            renderer.addMeshRender(meshRender);
        });
    }

    image.src = "assets/earth/earth_color_20K.png"
    
    roughness.src = "assets/earth/earth_roughness.png"
    //image.crossOrigin = "anonymous"
    //image.onload = function(){loadTex};

    
    



}



