/* ==========================================================================
   TROODON PARK HOTEL — THREE.JS 3D HERO CANVAS
   Interactive 3D Sacred Amber Crystal & Golden Sertão Particles
   ========================================================================== */

(function initThreeHeroScene() {
  const canvas = document.getElementById('hero3dCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- Lighting ---
  const ambientLight = new THREE.AmbientLight(0xd8cbb8, 0.85);
  scene.add(ambientLight);

  const goldLight = new THREE.PointLight(0xd49653, 3.5, 50);
  goldLight.position.set(12, 10, 15);
  scene.add(goldLight);

  const sunLight = new THREE.DirectionalLight(0xdfb877, 1.8);
  sunLight.position.set(-10, 15, 20);
  scene.add(sunLight);

  // --- 3D Central Troodon Amber Fossil Geometry ---
  const crystalGroup = new THREE.Group();
  scene.add(crystalGroup);

  // Outer Icosahedron / Gemstone
  const geometry = new THREE.IcosahedronGeometry(5.2, 0);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xd49653,
    emissive: 0x613d18,
    roughness: 0.18,
    metalness: 0.35,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    transmission: 0.65,
    ior: 1.52,
    thickness: 2.5,
    wireframe: false
  });
  const crystalMesh = new THREE.Mesh(geometry, material);
  crystalGroup.add(crystalMesh);

  // Inner Golden Wireframe Core
  const wireGeometry = new THREE.IcosahedronGeometry(4.8, 1);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xdfb877,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
  crystalGroup.add(wireMesh);

  // Orbiting Golden Rings (representing Paleontological Timeline / Earth Stratum)
  const ringGeo = new THREE.TorusGeometry(7.2, 0.08, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xdfb877,
    transparent: true,
    opacity: 0.6
  });
  const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
  ringMesh1.rotation.x = Math.PI / 3;
  crystalGroup.add(ringMesh1);

  const ringMesh2 = new THREE.Mesh(ringGeo, ringMat);
  ringMesh2.rotation.y = Math.PI / 2.5;
  ringMesh2.rotation.x = Math.PI / 4;
  crystalGroup.add(ringMesh2);

  // Position the 3D crystal slightly to the right for heroic composition
  crystalGroup.position.set(8.5, 0, 0);

  // --- Golden Atmospheric Dust Particles ---
  const particleCount = 280;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleScales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 50;
    particlePositions[i + 1] = (Math.random() - 0.5) * 35;
    particlePositions[i + 2] = (Math.random() - 0.5) * 40;
    particleScales[i / 3] = Math.random() * 2 + 1;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xdfb877,
    size: 0.22,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // --- Mouse Interactivity ---
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // --- Resize Handler ---
  function onWindowResize() {
    if (!canvas) return;
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;
    camera.aspect = width / height;

    // Adjust position on small screens
    if (width < 900) {
      crystalGroup.position.set(0, 4, -5);
      crystalGroup.scale.set(0.65, 0.65, 0.65);
    } else {
      crystalGroup.position.set(7.5, 0, 0);
      crystalGroup.scale.set(1, 1, 1);
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onWindowResize);
  onWindowResize();

  // --- Animation Loop ---
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse easing
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    // Rotate 3D crystal
    crystalMesh.rotation.y = elapsedTime * 0.25;
    crystalMesh.rotation.x = elapsedTime * 0.15;

    wireMesh.rotation.y = -elapsedTime * 0.3;
    wireMesh.rotation.z = elapsedTime * 0.2;

    ringMesh1.rotation.z = elapsedTime * 0.18;
    ringMesh2.rotation.z = -elapsedTime * 0.22;

    // Mouse parallax reaction
    crystalGroup.rotation.y = currentMouseX * 0.4;
    crystalGroup.rotation.x = -currentMouseY * 0.3;

    // Gentle float
    crystalGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.6;

    // Dust particles drift
    particles.rotation.y = elapsedTime * 0.04;
    particles.rotation.x = elapsedTime * 0.02;

    renderer.render(scene, camera);
  }

  animate();
})();
