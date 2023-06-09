function handleButtonClick() {
  window.open("https://cjkproduction.com", "_blank");
}
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 20);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define the number of cubes and the size range
const numCubes = 100;
const minSize = 0.1;
const maxSize = 3;

// Define the geometry and material for the cubes
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

// Create the cubes and add them to the scene
const cubes = [];
for (let i = 0; i < numCubes; i++) {
    const size = Math.random() * (maxSize - minSize) + minSize;
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(
        Math.random() * 40 - 20,
        Math.random() * 40 - 20,
        Math.random() * 40 - 20
    );
    cube.scale.set(size, size, size);
    cube.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        emissive: 0x00ff00,
        emissiveIntensity: 0,
    });
    cubes.push(cube);
    scene.add(cube);
}

// Add lighting to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 0, 50);
scene.add(pointLight);

// Camera panning
let targetCameraPosition = new THREE.Vector3(0, 0, 0);
const cameraPanningSpeed = 0.05;

renderer.domElement.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    targetCameraPosition.set(x * 10, y * 10, camera.position.z);
});

// Raycaster and mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('mousemove', (event) => {
    // Calculate the normalized device coordinates of the mouse
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the mouse position and camera
    raycaster.setFromCamera(mouse, camera);

    // Find the intersecting cube, if any
    const intersects = raycaster.intersectObjects(cubes);
    if (intersects.length > 0) {
        // A cube is being hovered over
        const hoveredCube = intersects[0].object;
        hoveredCube.material.emissiveIntensity = 0.5;

        // Scale down and rotate the hovered cube
        hoveredCube.userData.defaultScale = hoveredCube.userData.defaultScale || hoveredCube.scale.clone(); // Store default scale if not already set
        hoveredCube.scale.copy(hoveredCube.userData.defaultScale).multiplyScalar(0.8);
        hoveredCube.rotation.x += 0.01;
        hoveredCube.rotation.y += 0.01;
    } else {
        // No cube is being hovered over
        cubes.forEach((cube) => {
            cube.material.emissiveIntensity = 0;
            if (cube.userData.defaultScale) {
                // Return the cube to its default scale and rotation
                cube.scale.copy(cube.userData.defaultScale);
                cube.rotation.set(0, 0, 0);
                delete cube.userData.defaultScale;
            }
        });
    }
});

// Click event listener
renderer.domElement.addEventListener('click', (event) => {
    // Generate a random color
    const randomColor = Math.random() * 0xffffff;

    // Set the background color of the renderer to the random color
    renderer.setClearColor(randomColor);

    cubes.forEach((cube) => {
        cube.position.set(
            Math.random() * 40 - 20,
            Math.random() * 40 - 20,
            Math.random() * 40 - 20
        );
    });
});

// Animate function
const animate = function () {
    requestAnimationFrame(animate);

    // Camera panning
    camera.position.lerp(targetCameraPosition, cameraPanningSpeed);

    // Rotate cubes
    scene.rotation.x += 0.001;
    scene.rotation.y += 0.001;

    renderer.render(scene, camera);
};
animate();
