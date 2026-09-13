import * as THREE from 'three';

export interface WarpSpeedInstance {
  group: THREE.Group;
  update: (trainSpeedKmH: number) => void;
  dispose: () => void;
}

export function createWarpSpeedTrails(count = 250): WarpSpeedInstance {
  const group = new THREE.Group();
  group.name = 'ThreeUI_WarpSpeed_Trails';

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 6);
  const colors = new Float32Array(count * 6);
  const palette = [
    new THREE.Color(0x38bdf8), // Cyan
    new THREE.Color(0x818cf8), // Indigo
    new THREE.Color(0xec4899), // Pink neon
    new THREE.Color(0xffffff), // Pure white
  ];

  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 8 + 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.6 + 2;
    const z = (Math.random() - 0.5) * 80;
    const length = Math.random() * 12 + 4;

    positions[i * 6] = x;
    positions[i * 6 + 1] = y;
    positions[i * 6 + 2] = z;
    positions[i * 6 + 3] = x;
    positions[i * 6 + 4] = y;
    positions[i * 6 + 5] = z + length;

    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 6] = col.r;
    colors[i * 6 + 1] = col.g;
    colors[i * 6 + 2] = col.b;
    colors[i * 6 + 3] = col.r;
    colors[i * 6 + 4] = col.g;
    colors[i * 6 + 5] = col.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    linewidth: 2,
  });

  const lineSegments = new THREE.LineSegments(geometry, material);
  group.add(lineSegments);

  const update = (trainSpeedKmH: number) => {
    // Only activate visible relativistic streaks above 70 km/h
    const ratio = Math.max(0, (trainSpeedKmH - 70) / 90);
    material.opacity = ratio * 0.75;
    if (ratio <= 0.01) return;

    const step = (trainSpeedKmH / 40) * 1.5;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i += 1) {
      arr[i * 6 + 2] -= step;
      arr[i * 6 + 5] -= step;
      if (arr[i * 6 + 2] < -60) {
        arr[i * 6 + 2] = 40;
        arr[i * 6 + 5] = 40 + (Math.random() * 14 + 6);
      }
    }
    posAttr.needsUpdate = true;
  };

  const dispose = () => {
    geometry.dispose();
    material.dispose();
  };

  return { group, update, dispose };
}
