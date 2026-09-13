import * as THREE from 'three';

export interface NavICConstellationInstance {
  group: THREE.Group;
  update: (speed?: number) => void;
  dispose: () => void;
}

export function createNavICConstellation(radius = 45): NavICConstellationInstance {
  const group = new THREE.Group();
  group.name = 'NavIC_ISRO_Constellation';
  group.position.set(0, 60, -30);

  const particleCount = 6000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const colorBright = new THREE.Color(0x38bdf8); // Sky blue
  const colorDim = new THREE.Color(0x6366f1); // Indigo

  let validIndex = 0;
  for (let index = 0; index < particleCount; index += 1) {
    const phi = Math.acos(-1 + (2 * index) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    const noise =
      Math.sin(x * 0.15) * Math.cos(y * 0.15) * Math.sin(z * 0.15) + Math.cos(x * 0.3) * 0.4;
    if (noise <= -0.15) continue;

    const distortion = 1 + noise * 0.08;
    positions[validIndex * 3] = x * distortion;
    positions[validIndex * 3 + 1] = y * distortion;
    positions[validIndex * 3 + 2] = z * distortion;

    const mixedColor = colorDim.clone().lerp(colorBright, noise > 0.4 ? 1 : 0.25);
    colors[validIndex * 3] = mixedColor.r;
    colors[validIndex * 3 + 1] = mixedColor.g;
    colors[validIndex * 3 + 2] = mixedColor.b;
    validIndex += 1;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions.slice(0, validIndex * 3), 3)
  );
  particleGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors.slice(0, validIndex * 3), 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const pointsMesh = new THREE.Points(particleGeometry, particleMaterial);
  group.add(pointsMesh);

  // Orbital Rings
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
  });

  const orbitGeometries: THREE.BufferGeometry[] = [];
  const satelliteMeshes: THREE.Mesh[] = [];

  for (let index = 0; index < 5; index += 1) {
    const geometry = new THREE.BufferGeometry();
    const points: number[] = [];
    const orbitRadius = radius * (1.05 + index * 0.08);

    for (let point = 0; point <= 80; point += 1) {
      const angle = (point / 80) * Math.PI * 2;
      points.push(
        Math.cos(angle) * orbitRadius,
        Math.sin(angle) * orbitRadius,
        Math.sin(angle * 3) * 1.5
      );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    orbitGeometries.push(geometry);

    const line = new THREE.Line(geometry, orbitMaterial);
    line.rotation.x = (index * Math.PI) / 3.5;
    line.rotation.y = (index * Math.PI) / 4;
    group.add(line);

    // NavIC Satellite Node
    const satGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.4);
    const satMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
    });
    const satMesh = new THREE.Mesh(satGeometry, satMaterial);
    const nodeAngle = (index * Math.PI) / 2.5;
    satMesh.position.set(Math.cos(nodeAngle) * orbitRadius, Math.sin(nodeAngle) * orbitRadius, 0);
    line.add(satMesh);
    satelliteMeshes.push(satMesh);
  }

  const update = (speed = 1) => {
    group.rotation.y += 0.001 * speed;
    group.rotation.x += 0.0004 * speed;
  };

  const dispose = () => {
    particleGeometry.dispose();
    particleMaterial.dispose();
    orbitMaterial.dispose();
    orbitGeometries.forEach((g) => g.dispose());
  };

  return { group, update, dispose };
}
