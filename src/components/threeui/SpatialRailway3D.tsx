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
  ShieldCheck,
  Sliders,
  X,
  Layers,
  Activity,
  Maximize2
} from 'lucide-react';
import { ThreeUIShaderButton } from './ThreeUIShaderButton';
import { ThreeUITiltCard } from './ThreeUITiltCard';
import { ThreeUILaser, type ThreeUILaserVariant } from './ThreeUILaser';
import { ThreeUIPredictiveArc } from './ThreeUIPredictiveArc';
import { createNavICConstellation, type NavICConstellationInstance } from './ThreeUINavICConstellation';
import { createWarpSpeedTrails, type WarpSpeedInstance } from './ThreeUIWarpSpeed';

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

  // ThreeUI Pro Studio State
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [laserVariant, setLaserVariant] = useState<ThreeUILaserVariant>('atmospheric-blade');
  const [laserSpeed, setLaserSpeed] = useState(1.2);
  const [laserDensity, setLaserDensity] = useState(1.0);
  const [laserHue, setLaserHue] = useState(0);
  const [showNavIC, setShowNavIC] = useState(true);
  const [showWarpTrails, setShowWarpTrails] = useState(true);
  const [crtFilterActive, setCrtFilterActive] = useState(true);

  // Three.js internal references
  const threeRefs = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    trainGroup?: THREE.Group;
    coachGroup?: THREE.Group;
    kavachDome?: THREE.Mesh;
    kavachRing?: THREE.Mesh;
    forwardLiDAR?: THREE.Group;
    navicConstellation?: NavICConstellationInstance;
    warpTrails?: WarpSpeedInstance;
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

  // Toggle NavIC Constellation visibility
  useEffect(() => {
    if (threeRefs.current.navicConstellation) {
      threeRefs.current.navicConstellation.group.visible = showNavIC;
    }
  }, [showNavIC]);

  // Toggle Warp Speed Trails visibility
  useEffect(() => {
    if (threeRefs.current.warpTrails) {
      threeRefs.current.warpTrails.group.visible = showWarpTrails;
    }
  }, [showWarpTrails]);

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

    const leftRailMesh = new THREE.Mesh(new THREE.TubeGeometry(leftRailCurve, 200, 0.07, 6, false), railMat);
    const rightRailMesh = new THREE.Mesh(new THREE.TubeGeometry(rightRailCurve, 200, 0.07, 6, false), railMat);
    leftRailMesh.position.y = 0.08;
    rightRailMesh.position.y = 0.08;
    trackGroup.add(leftRailMesh);
    trackGroup.add(rightRailMesh);

    // Prestressed Concrete Sleepers along path
    const sleeperGeo = new THREE.BoxGeometry(gauge * 2.5, 0.14, 0.28);
    const sleeperMat = new THREE.MeshStandardMaterial({
      color: themeMode === 'cyber' ? 0x334155 : 0x94a3b8,
      roughness: 0.9,
    });
    const sleeperInstanced = new THREE.InstancedMesh(sleeperGeo, sleeperMat, sleeperCount);
    sleeperInstanced.castShadow = true;
    sleeperInstanced.receiveShadow = true;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < sleeperCount; i++) {
      const u = i * sleeperSpacing;
      const pt = curve.getPointAt(u);
      const tangent = curve.getTangentAt(u);
      const angleY = Math.atan2(tangent.x, tangent.z);

      dummy.position.copy(pt);
      dummy.position.y = -0.02;
      dummy.rotation.set(0, angleY + Math.PI / 2, 0);
      dummy.updateMatrix();
      sleeperInstanced.setMatrixAt(i, dummy.matrix);
    }
    sleeperInstanced.instanceMatrix.needsUpdate = true;
    trackGroup.add(sleeperInstanced);

    // Overhead 25 kV AC Catenary Masts (OHE Cantilever Portals)
    const mastGeo = new THREE.CylinderGeometry(0.12, 0.15, 7.5, 8);
    const mastMat = new THREE.MeshStandardMaterial({
      color: themeMode === 'cyber' ? 0x0ea5e9 : 0x475569,
      metalness: 0.8,
    });
    const mastArmGeo = new THREE.BoxGeometry(3.6, 0.12, 0.12);

    for (let i = 0; i < 22; i++) {
      const u = i / 21;
      const pt = curve.getPointAt(u);
      const tangent = curve.getTangentAt(u);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const mastGroup = new THREE.Group();
      const mastPost = new THREE.Mesh(mastGeo, mastMat);
      mastPost.position.y = 3.75;
      mastPost.castShadow = true;
      mastGroup.add(mastPost);

      const mastArm = new THREE.Mesh(mastArmGeo, mastMat);
      mastArm.position.set(-1.4, 6.8, 0);
      mastGroup.add(mastArm);

      mastGroup.position.copy(pt).add(normal.multiplyScalar(4.0));
      mastGroup.rotation.y = Math.atan2(tangent.x, tangent.z);
      trackGroup.add(mastGroup);
    }

    scene.add(trackGroup);

    // 5. Authentic Vande Bharat Express 20643 (Wired Train Model)
    const trainGroup = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.15,
    });
    const blueStripeMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8, // Royal Blue
      roughness: 0.3,
      metalness: 0.6,
    });
    const cabGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.88,
    });

    // Aerodynamic Nose Cone
    const noseGeo = new THREE.ConeGeometry(1.25, 3.4, 16);
    const nose = new THREE.Mesh(noseGeo, bodyMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 1.25, 4.8);
    nose.scale.set(1.0, 0.78, 1.0);
    nose.castShadow = true;
    trainGroup.add(nose);

    // Main Locomotive Body Car
    const bodyGeo = new THREE.BoxGeometry(2.1, 2.0, 8.4);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 1.3, 0);
    body.castShadow = true;
    trainGroup.add(body);

    // Aerodynamic Windshield Visor
    const visorGeo = new THREE.BoxGeometry(1.7, 0.7, 1.2);
    const visor = new THREE.Mesh(visorGeo, cabGlassMat);
    visor.position.set(0, 1.65, 4.2);
    visor.rotation.x = -Math.PI / 7;
    trainGroup.add(visor);

    // Vande Bharat Signature Blue Livery Stripe
    const stripeL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 8.4), blueStripeMat);
    stripeL.position.set(-1.06, 1.2, 0);
    trainGroup.add(stripeL);

    const stripeR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 8.4), blueStripeMat);
    stripeR.position.set(1.06, 1.2, 0);
    trainGroup.add(stripeR);

    // Pantograph Assembly on Roof
    const pantoGroup = new THREE.Group();
    const pantoMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 });
    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8), pantoMat);
    arm1.rotation.z = Math.PI / 4;
    arm1.position.set(0.5, 0.8, 0);
    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8), pantoMat);
    arm2.rotation.z = -Math.PI / 4;
    arm2.position.set(-0.5, 0.8, 0);
    const headBar = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.2), pantoMat);
    headBar.position.set(0, 1.5, 0);
    pantoGroup.add(arm1);
    pantoGroup.add(arm2);
    pantoGroup.add(headBar);
    pantoGroup.position.set(0, 2.3, -2.5);
    trainGroup.add(pantoGroup);

    // High-Intensity Forward Headlight Projector
    const headlight = new THREE.SpotLight(0xfffaed, 8.0, 60, Math.PI / 7, 0.4, 1.5);
    headlight.position.set(0, 1.2, 6.2);
    const headlightTarget = new THREE.Object3D();
    headlightTarget.position.set(0, 0, 40);
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

    // 7. ThreeUI Pro Forward LiDAR Laser Projector (Ahead of train on track)
    const forwardLiDAR = new THREE.Group();
    forwardLiDAR.name = 'Kavach_LiDAR_Forward_Scanner';
    
    // Laser Beam Fan Flat Geometry
    const laserBeamGeo = new THREE.PlaneGeometry(3.2, 34);
    const laserBeamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const laserBeamMesh = new THREE.Mesh(laserBeamGeo, laserBeamMat);
    laserBeamMesh.rotation.x = -Math.PI / 2;
    laserBeamMesh.position.set(0, 0.12, 23);
    forwardLiDAR.add(laserBeamMesh);

    // Transverse Scanning Laser Pulses
    for (let i = 0; i < 4; i++) {
      const pulseGeo = new THREE.BoxGeometry(3.6, 0.05, 0.4);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.position.set(0, 0.15, 10 + i * 7.5);
      forwardLiDAR.add(pulseMesh);
    }
    trainGroup.add(forwardLiDAR);

    // 8. ThreeUI Pro Relativistic Warp Speed Slipstream Trails
    const warpTrails = createWarpSpeedTrails(200);
    trainGroup.add(warpTrails.group);
    threeRefs.current.warpTrails = warpTrails;

    scene.add(trainGroup);

    // 9. Coupled Articulated Coach
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

    // 10. ThreeUI NavIC ISRO Constellation Orbital Mesh (In 3D Sky)
    const navicConstellation = createNavICConstellation(55);
    scene.add(navicConstellation.group);
    threeRefs.current.navicConstellation = navicConstellation;

    // 11. ThreeUI Signal Flow Field Particles (Communication telemetry particles)
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

    // Store refs
    threeRefs.current.renderer = renderer;
    threeRefs.current.scene = scene;
    threeRefs.current.camera = camera;
    threeRefs.current.trainGroup = trainGroup;
    threeRefs.current.coachGroup = coachGroup;
    threeRefs.current.kavachDome = kavachDome;
    threeRefs.current.kavachRing = kavachRing;
    threeRefs.current.forwardLiDAR = forwardLiDAR;
    threeRefs.current.particles = particles;
    threeRefs.current.headlight = headlight;
    threeRefs.current.curve = curve;

    // 12. Interactive Mouse Drag / Orbit Controls
    const onMouseDown = (e: MouseEvent) => {
      if (cameraMode !== 'orbit') return;
      threeRefs.current.isDragging = true;
      threeRefs.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!threeRefs.current.isDragging || cameraMode !== 'orbit') return;
      const deltaX = e.clientX - threeRefs.current.prevMousePos.x;
      const deltaY = e.clientY - threeRefs.current.prevMousePos.y;

      threeRefs.current.spherical.theta -= deltaX * 0.005;
      threeRefs.current.spherical.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.05, threeRefs.current.spherical.phi - deltaY * 0.005)
      );

      threeRefs.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      threeRefs.current.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (cameraMode !== 'orbit') return;
      threeRefs.current.spherical.radius = Math.max(
        10,
        Math.min(100, threeRefs.current.spherical.radius + e.deltaY * 0.05)
      );
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: true });

    // 13. Responsive Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 14. 60 FPS Render Loop with ThreeUI Pro Animations
    let lastTime = performance.now();

    const animate = (now: number) => {
      threeRefs.current.animationId = requestAnimationFrame(animate);

      const delta = (now - lastTime) * 0.001;
      lastTime = now;

      if (!isPaused && curve) {
        // Advance train position along CatmullRom spline
        const speed = (trainSpeedKmH / 130) * 0.015 * speedMultiplier;
        threeRefs.current.t = (threeRefs.current.t + speed * delta) % 1.0;
      }

      const t = threeRefs.current.t;
      const currentPos = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);

      // Articulated train orientation
      trainGroup.position.copy(currentPos);
      const lookAtPos = currentPos.clone().add(tangent);
      trainGroup.lookAt(lookAtPos);

      // Trailing coach position (offset behind train)
      const coachT = (t - 0.045 + 1.0) % 1.0;
      const coachPos = curve.getPointAt(coachT);
      const coachTangent = curve.getTangentAt(coachT);
      coachGroup.position.copy(coachPos);
      coachGroup.lookAt(coachPos.clone().add(coachTangent));

      // Animate Kavach TCAS holographic dome & radar ring
      if (kavachRing) {
        kavachRing.rotation.z += 0.035;
      }
      if (kavachDome) {
        const pulse = 0.16 + Math.sin(now * 0.004) * 0.06;
        (kavachDome.material as THREE.MeshStandardMaterial).opacity =
          blockActive ? 0.45 : pulse;
      }

      // Animate ThreeUI Pro NavIC Constellation
      if (navicConstellation) {
        navicConstellation.update(speedMultiplier);
      }

      // Animate ThreeUI Pro Warp Speed Trails
      if (warpTrails) {
        warpTrails.update(trainSpeedKmH);
      }

      // Animate Forward LiDAR pulses
      if (forwardLiDAR) {
        forwardLiDAR.children.forEach((child, idx) => {
          if (idx > 0) {
            // Pulse meshes
            child.position.z = 8 + ((now * 0.02 + idx * 8) % 30);
          }
        });
      }

      // Animate signal flow field particles
      if (particles) {
        particles.rotation.y += 0.0008;
      }

      // Camera Presets
      if (cameraMode === 'chase') {
        const offset = tangent.clone().multiplyScalar(-18).add(new THREE.Vector3(0, 8.5, 0));
        camera.position.lerp(currentPos.clone().add(offset), 0.08);
        camera.lookAt(currentPos.clone().add(tangent.clone().multiplyScalar(10)));
      } else if (cameraMode === 'cab') {
        const cabOffset = new THREE.Vector3(0, 1.8, 5.2).applyQuaternion(trainGroup.quaternion);
        camera.position.copy(currentPos.clone().add(cabOffset));
        const forwardLook = currentPos.clone().add(tangent.clone().multiplyScalar(40));
        forwardLook.y += 1.5;
        camera.lookAt(forwardLook);
      } else if (cameraMode === 'overhead') {
        camera.position.lerp(new THREE.Vector3(currentPos.x, 65, currentPos.z + 10), 0.05);
        camera.lookAt(currentPos.x, 0, currentPos.z);
      } else if (cameraMode === 'orbit') {
        const { radius, theta, phi } = threeRefs.current.spherical;
        const x = currentPos.x + radius * Math.sin(phi) * Math.sin(theta);
        const y = currentPos.y + radius * Math.cos(phi);
        const z = currentPos.z + radius * Math.sin(phi) * Math.cos(theta);
        camera.position.set(x, y, z);
        camera.lookAt(currentPos.x, currentPos.y + 1.5, currentPos.z);
      }

      renderer.render(scene, camera);
    };

    threeRefs.current.animationId = requestAnimationFrame(animate);

    return () => {
      if (threeRefs.current.animationId) {
        cancelAnimationFrame(threeRefs.current.animationId);
      }
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);

      if (navicConstellation) navicConstellation.dispose();
      if (warpTrails) warpTrails.dispose();

      renderer.dispose();
    };
  }, [cameraMode, themeMode, speedMultiplier, isPaused, trainSpeedKmH, blockActive]);

  return (
    <div className="relative w-full h-[750px] lg:h-[820px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* CRT Scanline Overlay Filter */}
      {crtFilterActive && (
        <div className="absolute inset-0 pointer-events-none z-10 opacity-30 mix-blend-overlay bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      )}

      {/* 1. Header Overlay: Corridor Status & ThreeUI Pro Studio Badge */}
      <div className="absolute top-6 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-cyan-500 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 relative" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>MAS-MYS CORRIDOR // SECTION 14-C</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-mono">
                3D SPATIAL TWIN
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Vande Bharat Express 20643 • Dynamic Block Signalling
            </div>
          </div>
        </div>

        {/* Action Controls & Pro Studio Launcher */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* ThreeUI Pro Studio Trigger Button */}
          <button
            onClick={() => setIsStudioOpen(!isStudioOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition-all shadow-lg bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white hover:scale-105 active:scale-95 border border-cyan-300/40"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
            <span>THREEUI PRO STUDIO</span>
          </button>

          {/* Camera Reset */}
          <button
            onClick={() => {
              setCameraMode('chase');
              threeRefs.current.spherical = { radius: 35, theta: Math.PI / 4, phi: Math.PI / 3 };
            }}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-all shadow-sm"
            title="Reset Perspective"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Camera & Simulation Mode Switcher (Floating Top-Center) */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto hidden sm:flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/70 dark:border-slate-800 shadow-xl text-xs">
        <button
          onClick={() => setCameraMode('chase')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
            cameraMode === 'chase'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
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
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Cab Driver FPV</span>
        </button>

        <button
          onClick={() => setCameraMode('orbit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
            cameraMode === 'orbit'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>3D Free Orbit</span>
        </button>

        <button
          onClick={() => setCameraMode('overhead')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
            cameraMode === 'overhead'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Overhead</span>
        </button>

        {/* Play / Pause Toggle */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 bg-white/70 dark:bg-slate-800/70 hover:bg-white shadow-xs"
          title={isPaused ? 'Resume Simulation' : 'Pause Simulation'}
        >
          {isPaused ? (
            <Play className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Pause className="w-3.5 h-3.5 text-amber-500" />
          )}
          <span>{isPaused ? 'Play' : 'Pause'}</span>
        </button>

        {/* Day / Cyber Theme Switcher */}
        <button
          onClick={() => setThemeMode(themeMode === 'bright' ? 'cyber' : 'bright')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 bg-white/70 dark:bg-slate-800/70 hover:bg-white shadow-xs"
          title="Toggle Visual Theme"
        >
          {themeMode === 'bright' ? (
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className="capitalize">{themeMode}</span>
        </button>
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
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  tcasStatus === 'EMERGENCY_HALT'
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
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
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      signalAspect === 'GREEN'
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-rose-500 animate-ping'
                    }`}
                  />
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
              Cross-beam radar & forward LiDAR scanning distance to track obstruction at TBM-CMP crossover.
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

      {/* 5. ThreeUI Pro Studio Floating Drawer / Modal */}
      {isStudioOpen && (
        <div className="absolute inset-y-4 right-4 z-40 w-full max-w-md bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-6 shadow-2xl overflow-y-auto flex flex-col justify-between text-white animate-in slide-in-from-right-8 duration-300">
          <div className="space-y-6">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-cyan-900/60">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-base tracking-wide text-cyan-300">
                    THREEUI PRO STUDIO
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Authentic MengTo/threeui GLSL Shaders & Mechanics
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsStudioOpen(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section A: Authentic GLSL Laser Playground */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1. GLSL LASER RADAR ENGINE</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  RAYMARCHED
                </span>
              </div>

              {/* Live Laser Canvas Preview */}
              <div className="h-44 w-full rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900/90 shadow-inner relative group">
                <ThreeUILaser
                  variant={laserVariant}
                  speed={laserSpeed}
                  density={laserDensity}
                  hue={laserHue}
                  className="w-full h-full"
                />
                <div className="absolute top-2 left-3 text-[10px] font-mono text-cyan-300/80 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-xs pointer-events-none">
                  INTERACTIVE MOUSE TRACKING ACTIVE
                </div>
              </div>

              {/* Laser Variant Selector Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(
                  [
                    ['atmospheric-blade', 'Atmospheric Blade'],
                    ['vanishing-array', 'Vanishing Array'],
                    ['prism-aperture', 'Prism Aperture'],
                    ['halftone-relay', 'Halftone Relay'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setLaserVariant(id)}
                    className={`p-2 rounded-xl font-mono text-xs font-bold text-left transition-all border ${
                      laserVariant === id
                        ? 'bg-cyan-600/30 border-cyan-400 text-cyan-200 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Laser Controls Sliders */}
              <div className="space-y-2 pt-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Beam Speed: {laserSpeed.toFixed(1)}x</span>
                  <span>Density: {laserDensity.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={laserSpeed}
                    onChange={(e) => setLaserSpeed(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0.4"
                    max="2.0"
                    step="0.1"
                    value={laserDensity}
                    onChange={(e) => setLaserDensity(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-slate-400 pt-1">
                  <span>Spectrum Shift: {laserHue}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={laserHue}
                  onChange={(e) => setLaserHue(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Section B: Predictive Arc Braking Trajectory */}
            <div className="space-y-3 pt-4 border-t border-cyan-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. PREDICTIVE ARC SBD ENVELOPE</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  PARABOLIC MATH
                </span>
              </div>

              {/* Live ThreeUI Predictive Arc Canvas */}
              <div className="h-44 w-full">
                <ThreeUIPredictiveArc
                  speed={1.2}
                  archHeight={0.65}
                  label="KAVACH SBD COLLISION ENVELOPE"
                  metricValue="1,420 m Safe Margin"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Section C: Spatial Digital Twin Scene Toggles */}
            <div className="space-y-3 pt-4 border-t border-cyan-900/40">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>3. 3D DIGITAL TWIN SHADER TOGGLES</span>
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setShowNavIC(!showNavIC)}
                  className={`p-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-between border transition-all ${
                    showNavIC
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>NavIC Mesh</span>
                  <span>{showNavIC ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => setShowWarpTrails(!showWarpTrails)}
                  className={`p-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-between border transition-all ${
                    showWarpTrails
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>Warp Streaks</span>
                  <span>{showWarpTrails ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => setCrtFilterActive(!crtFilterActive)}
                  className={`p-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-between border transition-all col-span-2 ${
                    crtFilterActive
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>ThreeUI Authentic CRT Scanline Filter</span>
                  <span>{crtFilterActive ? 'ACTIVE' : 'BYPASS'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-cyan-900/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Source: github.com/MengTo/threeui</span>
            <span className="text-cyan-400">WebGL 2.0 / GLSL</span>
          </div>
        </div>
      )}
    </div>
  );
};
