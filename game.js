import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 5);
scene.add(directionalLight);

// Sky
scene.background = new THREE.Color(0x87ceeb); // Sky blue

// Ground
const groundGeometry = new THREE.PlaneGeometry(500, 500);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, side: THREE.DoubleSide }); // Forest green
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to be flat
scene.add(ground);

// Simple Airplane Placeholder
const airplane = new THREE.Group();
const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 2, 8);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xdadada });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.rotation.x = Math.PI / 2;
airplane.add(body);

const wingGeometry = new THREE.BoxGeometry(3, 0.1, 1);
const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xb50000 });
const wing = new THREE.Mesh(wingGeometry, wingMaterial);
wing.position.y = 0;
wing.position.z = -0.5;
airplane.add(wing);

scene.add(airplane);

// Keyboard state
const keyboard = {};
window.addEventListener('keydown', (e) => (keyboard[e.code] = true));
window.addEventListener('keyup', (e) => (keyboard[e.code] = false));

const movementSpeed = 0.1;
const rotationSpeed = 0.02;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Airplane movement
    if (keyboard['ArrowUp'] || keyboard['KeyW']) {
        airplane.position.y += movementSpeed;
    }
    if (keyboard['ArrowDown'] || keyboard['KeyS']) {
        airplane.position.y -= movementSpeed;
    }
    if (keyboard['ArrowLeft'] || keyboard['KeyA']) {
        airplane.position.x -= movementSpeed;
        airplane.rotation.z += rotationSpeed;
    }
    if (keyboard['ArrowRight'] || keyboard['KeyD']) {
        airplane.position.x += movementSpeed;
        airplane.rotation.z -= rotationSpeed;
    }

    // Always move forward
    airplane.position.z -= movementSpeed * 2;
     if (airplane.position.z < -250) {
        airplane.position.z = 250;
    }
    
    // Reset rotation slowly
    airplane.rotation.z *= 0.95;


    // Camera follows the airplane
    const idealOffset = new THREE.Vector3(0, 2, 8);
    idealOffset.applyQuaternion(airplane.quaternion);
    const idealLookat = new THREE.Vector3(0, 0, -10);
    idealLookat.applyQuaternion(airplane.quaternion);
    
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(airplane.position).add(idealOffset);

    const lookatPosition = new THREE.Vector3();
    lookatPosition.copy(airplane.position).add(idealLookat);

    camera.position.lerp(cameraPosition, 0.1);
    camera.lookAt(lookatPosition);


    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
