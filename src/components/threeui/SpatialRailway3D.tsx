import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Compass,
  Eye,
  Navigation,
  Radio,
  RotateCcw,
  Train,
  AlertTriangle,
  Play,
  Pause,
  Sun,
  Moon,
  Zap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ThreeUIShaderButton } from './ThreeUIShaderButton';
import { ThreeUITiltCard } from './ThreeUITiltCard';

interface SpatialRailway3DProps {
  speedMultiplier?: number;
  blockActive?: boolean;
  onToggleBlock?: () => void;
  onSelectTrainWimt?: (trainId: string, speedKmH: number) => void;
}

export const SpatialRailway3D: React.FC<SpatialRailway3DProps> = ({
  speedMultiplier = 1,
  blockActive = false,
  onToggleBlock,
  onSelectTrainWimt,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Camera presets: 'orbit' | 'cab' | 'chase' | 'overhead'
  const [cameraMode, setCameraMode] = useState<'orbit' | 'cab' | 'chase' | 'overhead'>('chase');
  const [themeMode, setThemeMode] = useState<'bright' | 'cyber'>('bright');
  const [isPaused, setIsPaused] = useState(false);
  const [trainSpeedKmH, setTrainSpeedKmH] = useState(130);
  const [tcasStatus, setTcasStatus] = useState<'NORMAL' | 'WARNING' | 'EMERGENCY_HALT'>('NORMAL');
  const [signalAspect, setSignalAspect] = useState<'GREEN' | 'DOUBLE_YELLOW' | 'RED'>('GREEN');

  // Three.js internal references
  const threeRefs = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    trainGroup?: THREE.Group;
    coachGroup?: THREE.Group;
    kavachDome?: THREE.Mesh;
    kavachRing?: THREE.Mesh;
    particles?: THREE.Points;
    headlight?: THREE.SpotLight;
    curve?: THREE.CatmullRomCurve3;
    animationId?: number;
    t: number;
    isDragging: boolean;
    prevMousePos: { x: number; y: number };
    spherical: { radius: number; theta: number; phi: number };
  }>({
    t: 0,
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    spherical: { radius: 35, theta: Math.PI / 4, phi: Math.PI / 3 },
  });

  // Handle Block Active change (Kavach TCAS response)
  useEffect(() => {
    if (blockActive) {
      setTcasStatus('EMERGENCY_HALT');
      setSignalAspect('RED');
      setTrainSpeedKmH(0);
    } else {
      setTcasStatus('NORMAL');
      setSignalAspect('GREEN');
      setTrainSpeedKmH(130);
    }
  }, [blockActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Renderer Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x334155, 0.9);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 250;
    dirLight.shadow.camera.left = -60;
    dirLight.shadow.camera.right = 60;
    dirLight.shadow.camera.top = 60;
    dirLight.shadow.camera.bottom = -60;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // 3. Procedural Curved Railway Path (CatmullRom spline through CGL-MAS corridor)
    const curvePoints = [
      new THREE.Vector3(-140, 0, -50),
      new THREE.Vector3(-90, 0, -30),
      new THREE.Vector3(-40, 0, -5),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(45, 0, 10),
      new THREE.Vector3(90, 0, 35),
      new THREE.Vector3(140, 0, 70),
      new THREE.Vector3(190, 0, 95),
      new THREE.Vector3(240, 0, 100),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5);

    // 4. Track Corridor Geometries (Ballast, Sleepers, Steel Rails, Catenary Masts)
    const trackGroup = new THREE.Group();

    // Ground Plane with grid texture
    const groundGeo = new THREE.PlaneGeometry(600, 600);
    const groundMat = new THREE.MeshStandardMaterial({
      color: themeMode === 'cyber' ? 0x090d16 : 0xf1f5f9,
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.65;
    ground.receiveShadow = true;
    trackGroup.add(ground);

    // Ground Grid Helper for cyber aesthetic
    const gridHelper = new THREE.GridHelper(
      500,
      100,
      themeMode === 'cyber' ? 0x06b6d4 : 0x3b82f6,
      themeMode === 'cyber' ? 0x1e293b : 0xe2e8f0
    );
    gridHelper.position.y = -0.64;
    trackGroup.add(gridHelper);

    // Ballast Bed along spline
    const ballastGeo = new THREE.TubeGeometry(curve, 200, 2.8, 8, false);
    const ballastMat = new THREE.MeshStandardMaterial({
      color: themeMode === 'cyber' ? 0x1e293b : 0x64748b,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ballastMesh = new THREE.Mesh(ballastGeo, ballastMat);
    ballastMesh.scale.set(1, 0.25, 1);
    ballastMesh.position.y = -0.3;
    ballastMesh.receiveShadow = true;
    trackGroup.add(ballastMesh);

    // Dual Steel Rail Tubes (Left and Right)
    const railMat = new THREE.MeshStandardMaterial({
      color: themeMode === 'cyber' ? 0x38bdf8 : 0xc0c7d0,
      metalness: 0.92,
      roughness: 0.18,
    });

    const leftRailPoints = [];
    const rightRailPoints = [];
    const sleeperCount = 280;
    const sleeperSpacing = 1 / sleeperCount;
    const gauge = 1.676 * 0.5; // Indian Broad Gauge 1676mm scaled

    for (let i = 0; i <= 200; i++) {
      const u = i / 200;
      const pt = curve.getPointAt(u);
      const tangent = curve.getTangentAt(u);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      leftRailPoints.push(pt.clone().add(normal.clone().multiplyScalar(gauge)));
      rightRailPoints.push(pt.clone().add(normal.clone().multiplyScalar(-gauge)));
    }

    const leftRailCurve = new THREE.CatmullRomCurve3(leftRailPoints);
    const rightRailCurve = new THREE.CatmullRomCurve3(rightRailPoints);

    const leftRailMesh = new THREE.Mesh(new THREE.TubeGeometry(leftRailCurve, 200, 0.09, 6, false), railMat);
    const rightRailMesh = new THREE.Mesh(new THREE.TubeGeometry(rightRailCurve, 200, 0.09, 6, false), railMat);
    leftRailMesh.position.y = 0.08;
    rightRailMesh.position.y = 0.08;
    leftRailMesh.castShadow = true;
    rightRailMesh.castShadow = true;
    trackGroup.add(leftRailMesh);
    trackGroup.add(rightRailMesh);

    // Concrete Sleepers (Ties)
    const sleeperGeo = new THREE.BoxGeometry(2.6, 0.12, 0.4);
    const sleeperMat = new THREE.MeshStandardMaterial({
      color: themeMode === 'cyber' ? 0x334155 : 0x94a3b8,
      roughness: 0.8,
      metalness: 0.1,
    });

    for (let i = 0; i < sleeperCount; i++) {
      const u = i * sleeperSpacing;
      const pt = curve.getPointAt(u);
      const tangent = curve.getTangentAt(u);

      const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
      sleeper.position.copy(pt);
      sleeper.position.y = -0.02;
      sleeper.rotation.y = Math.atan2(tangent.x, tangent.z) + Math.PI / 2;
      sleeper.castShadow = true;
      sleeper.receiveShadow = true;
      trackGroup.add(sleeper);
    }

    // Overhead OHE Catenary Masts & Contact Wire
    const mastGeo = new THREE.CylinderGeometry(0.08, 0.08, 5, 8);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    const mastCount = 20;
    const wirePoints = [];

    for (let i = 0; i <= mastCount; i++) {
      const u = i / mastCount;
      const pt = curve.getPointAt(u);
      const tangent = curve.getTangentAt(u);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      // Mast pole
      const mast = new THREE.Mesh(mastGeo, mastMat);
      const mastPos = pt.clone().add(normal.clone().multiplyScalar(2.2));
      mast.position.set(mastPos.x, 2.5, mastPos.z);
      mast.castShadow = true;
      trackGroup.add(mast);

      // Cantilever arm over track
      const armGeo = new THREE.BoxGeometry(2.4, 0.06, 0.06);
      const arm = new THREE.Mesh(armGeo, mastMat);
      arm.position.set(pt.x, 4.8, pt.z);
      arm.rotation.y = Math.atan2(tangent.x, tangent.z) + Math.PI / 2;
      trackGroup.add(arm);

      wirePoints.push(new THREE.Vector3(pt.x, 4.5, pt.z));
    }

    // Overhead wire
    const wireCurve = new THREE.CatmullRomCurve3(wirePoints);
    const wireMesh = new THREE.Mesh(new THREE.TubeGeometry(wireCurve, 100, 0.02, 4, false), wireMat);
    trackGroup.add(wireMesh);

    scene.add(trackGroup);

    // 5. Build 3D Vande Bharat Express (Articulated Locomotive & Coaches)
    const trainGroup = new THREE.Group();

    // Locomotive Body
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Pearl White
      metalness: 0.35,
      roughness: 0.25,
    });
    const blueStripeMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Navy Blue Livery Stripe
      metalness: 0.5,
      roughness: 0.2,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.1,
    });

    // Main Locomotive Carriage (Length: 9, Width: 2.1, Height: 2.0)
    const locoBody = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.0, 9.0), bodyMat);
    locoBody.position.set(0, 1.3, 0);
    locoBody.castShadow = true;
    trainGroup.add(locoBody);

    // Aerodynamic Sloped Bullet Nose
    const noseGeo = new THREE.ConeGeometry(1.35, 3.2, 4);
    const noseMesh = new THREE.Mesh(noseGeo, bodyMat);
    noseMesh.rotation.x = -Math.PI / 2;
    noseMesh.rotation.y = Math.PI / 4;
    noseMesh.position.set(0, 1.25, 5.5);
    noseMesh.scale.set(1.1, 1, 0.85);
    noseMesh.castShadow = true;
    trainGroup.add(noseMesh);

    // Windshield Glass
    const windshieldGeo = new THREE.BoxGeometry(1.8, 0.7, 1.2);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(0, 1.8, 4.6);
    windshield.rotation.x = -Math.PI / 5;
    trainGroup.add(windshield);

    // Vande Bharat Signature Blue Ribbon Stripe
    const stripeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 9.5), blueStripeMat);
    stripeLeft.position.set(-1.06, 1.2, 0.2);
    trainGroup.add(stripeLeft);

    const stripeRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 9.5), blueStripeMat);
    stripeRight.position.set(1.06, 1.2, 0.2);
    trainGroup.add(stripeRight);

    // Roof Pantograph
    const pantoGroup = new THREE.Group();
    const pantoBarGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.8, 6);
    const pantoBar1 = new THREE.Mesh(pantoBarGeo, mastMat);
    pantoBar1.rotation.z = Math.PI / 4;
    pantoBar1.position.set(-0.5, 0.7, 0);
    pantoGroup.add(pantoBar1);

    const pantoBar2 = new THREE.Mesh(pantoBarGeo, mastMat);
    pantoBar2.rotation.z = -Math.PI / 4;
    pantoBar2.position.set(0.5, 0.7, 0);
    pantoGroup.add(pantoBar2);

    const headStrip = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.2), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    headStrip.position.set(0, 1.35, 0);
    pantoGroup.add(headStrip);

    pantoGroup.position.set(0, 2.3, -2.5);
    trainGroup.add(pantoGroup);

    // High-Intensity Forward Headlight Projector
    const headlight = new THREE.SpotLight(0xfffaed, 8.0, 55, Math.PI / 7, 0.4, 1.5);
    headlight.position.set(0, 1.2, 6.2);
    const headlightTarget = new THREE.Object3D();
    headlightTarget.position.set(0, 0, 35);
    trainGroup.add(headlight);
    trainGroup.add(headlightTarget);
    headlight.target = headlightTarget;

    // Glowing LED Lenses on Train Nose
    const lensGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 12);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftLens = new THREE.Mesh(lensGeo, lensMat);
    leftLens.rotation.x = Math.PI / 2;
    leftLens.position.set(-0.6, 1.1, 6.1);
    trainGroup.add(leftLens);

    const rightLens = new THREE.Mesh(lensGeo, lensMat);
    rightLens.rotation.x = Math.PI / 2;
    rightLens.position.set(0.6, 1.1, 6.1);
    trainGroup.add(rightLens);

    // 6. ThreeUI Signature: Kavach TCAS Holographic Forcefield Dome & Cross-Beam Ring
    const kavachGeo = new THREE.SphereGeometry(7.0, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const kavachMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Cyan
      transparent: true,
      opacity: 0.18,
      wireframe: true,
      emissive: 0x0891b2,
      emissiveIntensity: 0.4,
    });
    const kavachDome = new THREE.Mesh(kavachGeo, kavachMat);
    kavachDome.position.set(0, 0.2, 2.0);
    trainGroup.add(kavachDome);

    // ThreeUI Cross-Beam Radar Scanning Ring
    const ringGeo = new THREE.RingGeometry(6.2, 6.6, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const kavachRing = new THREE.Mesh(ringGeo, ringMat);
    kavachRing.rotation.x = -Math.PI / 2;
    kavachRing.position.set(0, 0.1, 2.0);
    trainGroup.add(kavachRing);

    scene.add(trainGroup);

    // 7. Coupled Articulated Coach
    const coachGroup = new THREE.Group();
    const coachBody = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.0, 9.2), bodyMat);
    coachBody.position.set(0, 1.3, 0);
    coachBody.castShadow = true;
    coachGroup.add(coachBody);

    const coachStripeL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 9.2), blueStripeMat);
    coachStripeL.position.set(-1.06, 1.2, 0);
    coachGroup.add(coachStripeL);

    const coachStripeR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 9.2), blueStripeMat);
    coachStripeR.position.set(1.06, 1.2, 0);
    coachGroup.add(coachStripeR);

    // Rear Marker Lamps (Red LEDs)
    const redLampMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tailLampL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), redLampMat);
    tailLampL.position.set(-0.75, 1.5, -4.65);
    coachGroup.add(tailLampL);

    const tailLampR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), redLampMat);
    tailLampR.position.set(0.75, 1.5, -4.65);
    coachGroup.add(tailLampR);

    scene.add(coachGroup);

    // 8. ThreeUI Signal Flow Field Particles (Communication telemetry particles)
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const pt = curve.getPointAt(u);
      particlePositions[i * 3] = pt.x + (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 1] = 1.0 + Math.random() * 4.0;
      particlePositions[i * 3 + 2] = pt.z + (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.22,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Store references
    threeRefs.current.renderer = renderer;
    threeRefs.current.scene = scene;
    threeRefs.current.camera = camera;
    threeRefs.current.trainGroup = trainGroup;
    threeRefs.current.coachGroup = coachGroup;
    threeRefs.current.kavachDome = kavachDome;
    threeRefs.current.kavachRing = kavachRing;
    threeRefs.current.particles = particles;
    threeRefs.current.headlight = headlight;
    threeRefs.current.curve = curve;

    // 9. Interactive Mouse Drag / Orbit Controls
    const onMouseDown = (e: MouseEvent) => {
      threeRefs.current.isDragging = true;
      threeRefs.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!threeRefs.current.isDragging) return;
      const deltaX = e.clientX - threeRefs.current.prevMousePos.x;
      const deltaY = e.clientY - threeRefs.current.prevMousePos.y;
      threeRefs.current.prevMousePos = { x: e.clientX, y: e.clientY };

      threeRefs.current.spherical.theta -= deltaX * 0.008;
      threeRefs.current.spherical.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.05, threeRefs.current.spherical.phi - deltaY * 0.008)
      );
    };

    const onMouseUp = () => {
      threeRefs.current.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      threeRefs.current.spherical.radius = Math.max(
        12,
        Math.min(80, threeRefs.current.spherical.radius + e.deltaY * 0.05)
      );
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel);

    // 10. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 11. Main Animation Loop
    const animate = (currentTime: number = performance.now()) => {
      const state = threeRefs.current;
      if (!state.isDragging && !isPaused) {
        // Advance train along spline
        const speedFactor = 0.00015 * speedMultiplier * (trainSpeedKmH / 130);
        state.t = (state.t + speedFactor) % 1.0;
      }

      const t = state.t;
      const pt = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);

      // Position locomotive
      if (trainGroup) {
        trainGroup.position.copy(pt);
        const lookTarget = pt.clone().add(tangent);
        trainGroup.lookAt(lookTarget);

        // Slight centrifugal roll into curves
        const rollAngle = -tangent.x * 0.15;
        trainGroup.rotateZ(rollAngle);
      }

      // Position coupled coach just behind locomotive
      if (coachGroup) {
        const coachT = (t - 0.038 + 1.0) % 1.0;
        const coachPt = curve.getPointAt(coachT);
        const coachTangent = curve.getTangentAt(coachT);
        coachGroup.position.copy(coachPt);
        coachGroup.lookAt(coachPt.clone().add(coachTangent));
        coachGroup.rotateZ(-coachTangent.x * 0.15);
      }

      // Animate Kavach TCAS cross-beam ring
      if (kavachRing) {
        kavachRing.rotation.z += 0.03;
      }

      // Dynamic Kavach Forcefield alert colors
      if (kavachDome) {
        if (blockActive) {
          (kavachDome.material as THREE.MeshStandardMaterial).color.setHex(0xef4444);
          (kavachDome.material as THREE.MeshStandardMaterial).emissive.setHex(0xdc2626);
        } else {
          (kavachDome.material as THREE.MeshStandardMaterial).color.setHex(0x06b6d4);
          (kavachDome.material as THREE.MeshStandardMaterial).emissive.setHex(0x0891b2);
        }
      }

      // Animate signal flow particles
      if (particles) {
        const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          let y = posAttr.getY(i);
          y += Math.sin(currentTime * 0.002 + i) * 0.008;
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
      }

      // Camera views
      if (camera && trainGroup) {
        if (cameraMode === 'chase') {
          const behind = pt.clone().sub(tangent.clone().multiplyScalar(18)).add(new THREE.Vector3(0, 8, 0));
          camera.position.lerp(behind, 0.08);
          camera.lookAt(pt.clone().add(new THREE.Vector3(0, 2, 0)));
        } else if (cameraMode === 'cab') {
          const cabEye = pt.clone().add(new THREE.Vector3(0, 2.2, 0)).add(tangent.clone().multiplyScalar(4.5));
          camera.position.copy(cabEye);
          camera.lookAt(pt.clone().add(tangent.clone().multiplyScalar(40)));
        } else if (cameraMode === 'overhead') {
          camera.position.lerp(new THREE.Vector3(pt.x, 55, pt.z + 1), 0.08);
          camera.lookAt(pt);
        } else {
          // 'orbit' mode
          const { radius, theta, phi } = state.spherical;
          const x = pt.x + radius * Math.sin(phi) * Math.sin(theta);
          const y = pt.y + radius * Math.cos(phi);
          const z = pt.z + radius * Math.sin(phi) * Math.cos(theta);
          camera.position.lerp(new THREE.Vector3(x, y, z), 0.1);
          camera.lookAt(pt.clone().add(new THREE.Vector3(0, 1.5, 0)));
        }
      }

      renderer.render(scene, camera);
      state.animationId = requestAnimationFrame(animate);
    };

    threeRefs.current.animationId = requestAnimationFrame(animate);

    return () => {
      if (threeRefs.current.animationId) cancelAnimationFrame(threeRefs.current.animationId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [cameraMode, speedMultiplier, trainSpeedKmH, isPaused, blockActive, themeMode]);

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden font-sans select-none">
      {/* 1. 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* 2. ThreeUI Top Bar HUD: Train Identity & Camera Mode Selectors */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-30">
        {/* Train Rake Badge */}
        <div className="pointer-events-auto flex items-center gap-3 threeui-glass px-4 py-2 rounded-2xl shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 font-mono">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm text-slate-900">
                20643 VANDE BHARAT
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                KAVACH TCAS ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono leading-tight">
              CHENNAI CENTRAL (MAS) ⇄ COIMBATORE JN (CBE)
            </p>
          </div>
        </div>

        {/* Camera Preset Switcher (ThreeUI Floating Segmented Pill) */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-1 threeui-glass p-1.5 rounded-2xl shadow-lg font-mono text-xs">
          <button
            onClick={() => setCameraMode('chase')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              cameraMode === 'chase'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Chase Drone</span>
          </button>
          <button
            onClick={() => setCameraMode('cab')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              cameraMode === 'cab'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>Cab FPV</span>
          </button>
          <button
            onClick={() => setCameraMode('orbit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              cameraMode === 'orbit'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Orbit 360</span>
          </button>
          <button
            onClick={() => setCameraMode('overhead')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              cameraMode === 'overhead'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Overhead</span>
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-slate-700 hover:text-slate-900 bg-white/70 hover:bg-white shadow-xs"
            title={isPaused ? "Resume Simulation" : "Pause Simulation"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
            <span>{isPaused ? "Play" : "Pause"}</span>
          </button>

          {/* Day / Cyber Theme Switcher */}
          <button
            onClick={() => setThemeMode(themeMode === 'bright' ? 'cyber' : 'bright')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-slate-700 hover:text-slate-900 bg-white/70 hover:bg-white shadow-xs"
            title="Toggle Visual Theme"
          >
            {themeMode === 'bright' ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            <span className="capitalize">{themeMode}</span>
          </button>
        </div>
      </div>

      {/* 3. ThreeUI Tactical CRT Telemetry Window (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-30 pointer-events-auto max-w-sm w-full hidden md:block">
        <ThreeUITiltCard dark maxTilt={8} className="p-4 border border-cyan-500/30 shadow-2xl">
          <div className="threeui-crt p-3 rounded-xl bg-slate-950/90 text-cyan-400 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-900/50">
              <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                <span>KAVACH TCAS RADAR // V3.2</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                tcasStatus === 'EMERGENCY_HALT'
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {tcasStatus}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-cyan-900/40">
                <div className="text-slate-400 text-[9px] uppercase">Speedometer</div>
                <div className="text-xl font-black text-white mt-0.5">
                  {trainSpeedKmH} <span className="text-xs text-cyan-400 font-normal">km/h</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-cyan-900/40">
                <div className="text-slate-400 text-[9px] uppercase">Signal Aspect</div>
                <div className="flex items-center gap-1.5 mt-1 font-bold">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    signalAspect === 'GREEN' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-ping'
                  }`} />
                  <span className={signalAspect === 'GREEN' ? 'text-emerald-300' : 'text-rose-400'}>
                    {signalAspect}
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-cyan-900/40">
                <div className="text-slate-400 text-[9px] uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Traction Supply</span>
                </div>
                <div className="text-sm font-bold text-amber-300 mt-0.5">25.4 kV AC</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-cyan-900/40">
                <div className="text-slate-400 text-[9px] uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Safe Braking Dist</span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5">1,420 m</div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 leading-tight">
              Cross-beam radar tracking distance to track obstruction at TBM-CMP crossover.
            </div>
          </div>
        </ThreeUITiltCard>
      </div>

      {/* 4. ThreeUI Interactive Action Console (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-30 pointer-events-auto flex flex-col sm:flex-row items-center gap-3">
        {/* Simulate Block / Normal Toggle with ThreeUI Induction Glow */}
        <ThreeUIShaderButton
          variant="induction"
          icon={AlertTriangle}
          onClick={onToggleBlock}
          badge={blockActive ? 'ACTIVE' : 'READY'}
        >
          {blockActive ? 'CLEAR MAINTENANCE BLOCK' : 'INJECT TRACK BLOCK'}
        </ThreeUIShaderButton>

        {/* Schedule & Telemetry Trigger */}
        <ThreeUIShaderButton
          variant="lumen"
          icon={Train}
          onClick={() => onSelectTrainWimt && onSelectTrainWimt('20643', trainSpeedKmH)}
          badge="NTES"
        >
          WIMT Live Schedule
        </ThreeUIShaderButton>
      </div>
    </div>
  );
};
