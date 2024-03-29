var cameraPosition = [100, 100, 100]

//生成的纹理的分辨率，纹理必须是标准的尺寸 256*256 1024*1024  2048*2048
var resolution = 2048;

main();

let then = 0;
var last = Date.now();

function main(){
    console.log("Start WebGL");
    const fpsElem = document.querySelector("#fps");
    const canvas = document.querySelector('#glcanvas');
	canvas.width = window.screen.width;
	canvas.height = window.screen.height;
	const gl = canvas.getContext('webgl');	
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

    //console.log(gl);

    // Add camera
	const camera = new THREE.PerspectiveCamera(75, gl.canvas.clientWidth / gl.canvas.clientHeight, 1e-2, 1000);
	camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);

	// Add resize listener
	function setSize(width, height) {
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
	setSize(canvas.clientWidth, canvas.clientHeight);
	window.addEventListener('resize', () => setSize(canvas.clientWidth, canvas.clientHeight));

	// Add camera control
	const cameraControls = new THREE.OrbitControls(camera, canvas);
	cameraControls.enableZoom = true;
	cameraControls.enableRotate = true;
	cameraControls.enablePan = true;
	cameraControls.rotateSpeed = 0.3;
	cameraControls.zoomSpeed = 1.0;
	cameraControls.panSpeed = 0.8;
	cameraControls.target.set(0, 0, 0);

    let lightPos = [0, 80, 80];
	let focalPoint = [0, 0, 0];
	let lightUp = [0, 1, 0]


    // Add renderer
	const renderer = new WebGLRenderer(gl, camera);
    const directionLight = new DirectionalLight(5000, [1, 1, 1], lightPos, focalPoint, lightUp, true, renderer.gl);
    renderer.addLight(directionLight);

	let floorTransform = setTransform(0, 0, -30, 4, 4, 4);
	let obj1Transform = setTransform(0, 0, 0, 100, 100, 100);
	let obj2Transform = setTransform(40, 0, -40, 10, 10, 10);

	//loadOBJ(renderer, 'assets/mary/', 'Marry', 'PhongMaterial', obj2Transform);
	//loadOBJ(renderer, 'assets/mary/', 'Marry', 'PhongMaterial', obj2Transform);
	//loadOBJ(renderer, 'assets/floor/', 'floor', 'PhongMaterial', floorTransform);
	//loadSphere(renderer,directionLight,Date.now(),100,obj1Transform);
	loadEarth(renderer,directionLight,100,obj1Transform);


    function createGUI() {
		const gui = new dat.gui.GUI();
		// const panelModel = gui.addFolder('Model properties');
		// panelModelTrans.add(GUIParams, 'x').name('X');
		// panelModel.open();
	}
	createGUI();
	var s = Sphere.sphere(10,setTransform(0,0,0,1,1,1));

    function mainLoop(now) {
		cameraControls.update();
        const fps = calcFPS(now);
        fpsElem.textContent = fps.toFixed(1); 
		renderer.render();
		currentAngle = animate(currentAngle);
		updateLightPos(directionLight);
		requestAnimationFrame(mainLoop);
	}
	requestAnimationFrame(mainLoop);

}
var currentAngle = 0;


function updateLightPos(light){
	var angle = currentAngle* PI/180;
	light.lightPos = [Math.cos(angle)*500,60 + Math.sin(2*angle)*20,Math.sin(angle)*500];
}

 // Last time that this function was called
var ANGLE_STEP = 20;
function animate(angle) {
  var now = Date.now();   // Calculate the elapsed time
  var elapsed = now - last;
  last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  
  return newAngle % 360;
}

function setTransform(t_x, t_y, t_z, s_x, s_y, s_z) {
	return {
		modelTransX: t_x,
		modelTransY: t_y,
		modelTransZ: t_z,
		modelScaleX: s_x,
		modelScaleY: s_y,
		modelScaleZ: s_z,
	};
}

function calcFPS(now){
    
    now *= 0.001;                          // convert to seconds
    const deltaTime = now - then;          // compute time since last frame
    then = now;                            // remember time for next frame
    const fps = 1 / deltaTime;  
    return fps;

}