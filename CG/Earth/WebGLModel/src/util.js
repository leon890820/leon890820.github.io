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