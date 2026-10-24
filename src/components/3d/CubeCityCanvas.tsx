import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BusinessItem } from '../../types';
import { MOCK_BUSINESSES } from '../../data/mockData';
import { RotateCw, ZoomIn, ZoomOut, Eye, Sparkles } from 'lucide-react';

interface CubeCityCanvasProps {
  onSelectBusiness?: (business: BusinessItem) => void;
  selectedBusinessId?: string | null;
  interactive?: boolean;
  className?: string;
  autoRotateSpeed?: number;
}

export const CubeCityCanvas: React.FC<CubeCityCanvasProps> = ({
  onSelectBusiness,
  selectedBusinessId,
  interactive = true,
  className = '',
  autoRotateSpeed = 0.5,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredStall, setHoveredStall] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // References to keep mutable values without triggering re-renders
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsStateRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    theta: Math.PI / 4,
    phi: Math.PI / 3.4,
    distance: 14,
    targetDistance: 14,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect Software WebGL per Three.js skill directives
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAF7F2');
    scene.fog = new THREE.FogExp2('#FAF7F2', 0.025);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Studio 3-Point Lighting Rig
    const ambientLight = new THREE.AmbientLight('#FFF5EB', 0.7);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight('#FFF0E5', '#E2E8F0', 0.6);
    scene.add(hemiLight);

    const dirKeyLight = new THREE.DirectionalLight('#FFF3E0', 1.8);
    dirKeyLight.position.set(10, 18, 12);
    if (!isSoftwareGl) {
      dirKeyLight.castShadow = true;
      dirKeyLight.shadow.mapSize.width = 1024;
      dirKeyLight.shadow.mapSize.height = 1024;
      dirKeyLight.shadow.camera.near = 0.5;
      dirKeyLight.shadow.camera.far = 40;
      dirKeyLight.shadow.bias = -0.0005;
      const d = 10;
      dirKeyLight.shadow.camera.left = -d;
      dirKeyLight.shadow.camera.right = d;
      dirKeyLight.shadow.camera.top = d;
      dirKeyLight.shadow.camera.bottom = -d;
    }
    scene.add(dirKeyLight);

    const fillLight = new THREE.DirectionalLight('#E0F2FE', 0.8);
    fillLight.position.set(-12, 10, -10);
    scene.add(fillLight);

    // 4. Ground Foundation with Contact Shadow
    const groundGeo = new THREE.CylinderGeometry(8.5, 9, 0.4, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.85,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.2;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    // Subtle Road Grid ring
    const roadRingGeo = new THREE.RingGeometry(4.2, 5.8, 36);
    const roadRingMat = new THREE.MeshStandardMaterial({
      color: '#F1F5F9',
      roughness: 0.9,
      side: THREE.DoubleSide,
    });
    const roadRing = new THREE.Mesh(roadRingGeo, roadRingMat);
    roadRing.rotation.x = -Math.PI / 2;
    roadRing.position.y = 0.01;
    scene.add(roadRing);

    // Soft radial contact shadow
    const shadowGeo = new THREE.PlaneGeometry(16, 16);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const gradient = sCtx.createRadialGradient(64, 64, 20, 64, 64, 60);
    gradient.addColorStop(0, 'rgba(0,0,0,0.22)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = gradient;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.42;
    scene.add(shadowPlane);

    // 5. Procedural Voxel Market Stalls (Composite 3-12 parts THREE.Group)
    const stallsGroup = new THREE.Group();
    scene.add(stallsGroup);

    const interactiveObjects: THREE.Object3D[] = [];
    const stallDataMap = new Map<THREE.Object3D, BusinessItem>();

    // Central Mirzapur Monument Clock Pillar (Cube architecture)
    const centerGroup = new THREE.Group();
    const pillarBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.4, 1.2),
      new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.4 })
    );
    pillarBase.position.y = 0.2;
    pillarBase.castShadow = !isSoftwareGl;
    centerGroup.add(pillarBase);

    const pillarTower = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 2.4, 0.8),
      new THREE.MeshStandardMaterial({ color: '#FF6A3D', roughness: 0.3, metalness: 0.1 })
    );
    pillarTower.position.y = 1.4;
    pillarTower.castShadow = !isSoftwareGl;
    centerGroup.add(pillarTower);

    // Spire peak
    const pillarTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: '#FFA63D', metalness: 0.6, roughness: 0.2 })
    );
    pillarTop.position.y = 2.8;
    centerGroup.add(pillarTop);

    // Glowing lantern accent
    const lantern = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshStandardMaterial({ color: '#FFE082', emissive: '#FF9800', emissiveIntensity: 0.6 })
    );
    lantern.position.y = 3.3;
    centerGroup.add(lantern);
    scene.add(centerGroup);

    // Helper to build a procedural architectural cube shop
    const buildCubeStall = (item: BusinessItem, angle: number, radius: number) => {
      const stall = new THREE.Group();
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      stall.position.set(x, 0, z);
      stall.lookAt(0, 0, 0);

      // Part 1: Stall Foundation Block
      const baseGeo = new THREE.BoxGeometry(1.6, 0.25, 1.4);
      const baseMat = new THREE.MeshStandardMaterial({ color: '#F1F5F9', roughness: 0.7 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.125;
      baseMesh.castShadow = !isSoftwareGl;
      baseMesh.receiveShadow = !isSoftwareGl;
      stall.add(baseMesh);

      // Part 2: Main Store Cabin Block
      const cabinGeo = new THREE.BoxGeometry(1.4, 1.2, 1.1);
      const cabinMat = new THREE.MeshStandardMaterial({
        color: item.cubeColor || '#FF6A3D',
        roughness: 0.35,
        metalness: 0.15,
      });
      const cabinMesh = new THREE.Mesh(cabinGeo, cabinMat);
      cabinMesh.position.set(0, 0.85, -0.15);
      cabinMesh.castShadow = !isSoftwareGl;
      stall.add(cabinMesh);

      // Part 3: Front Store Counter & Showcase Voxel
      const counterGeo = new THREE.BoxGeometry(1.3, 0.55, 0.5);
      const counterMat = new THREE.MeshStandardMaterial({
        color: item.cubeAccent || '#FFA63D',
        roughness: 0.4,
      });
      const counterMesh = new THREE.Mesh(counterGeo, counterMat);
      counterMesh.position.set(0, 0.4, 0.4);
      counterMesh.castShadow = !isSoftwareGl;
      stall.add(counterMesh);

      // Part 4: Striped Voxel Awning / Roof Overhang
      const roofOverhangGeo = new THREE.BoxGeometry(1.65, 0.18, 1.5);
      const roofMat = new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.5,
      });
      const roofMesh = new THREE.Mesh(roofOverhangGeo, roofMat);
      roofMesh.position.set(0, 1.5, 0.05);
      roofMesh.castShadow = !isSoftwareGl;
      stall.add(roofMesh);

      // Part 5: Canopy Colored Accent Bevel
      const canopyLip = new THREE.Mesh(
        new THREE.BoxGeometry(1.65, 0.1, 0.2),
        new THREE.MeshStandardMaterial({ color: item.cubeColor, roughness: 0.3 })
      );
      canopyLip.position.set(0, 1.45, 0.75);
      stall.add(canopyLip);

      // Part 6: Illuminated Floating Billboard Marker Voxel
      const signMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.4, 0.12),
        new THREE.MeshStandardMaterial({
          color: '#1E293B',
          roughness: 0.2,
          emissive: item.cubeColor,
          emissiveIntensity: 0.2,
        })
      );
      signMesh.position.set(0, 1.85, 0.2);
      stall.add(signMesh);

      // Part 7: Tiny floating decorative mini-cubes (The Ra.One cube aesthetic)
      const miniCubeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const miniCubeMat = new THREE.MeshStandardMaterial({
        color: item.cubeAccent || '#FFD54F',
        metalness: 0.7,
        roughness: 0.2,
      });
      for (let i = 0; i < 3; i++) {
        const mini = new THREE.Mesh(miniCubeGeo, miniCubeMat);
        mini.position.set(
          (Math.random() - 0.5) * 1.2,
          2.1 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.8
        );
        mini.userData = { initialY: mini.position.y, speed: 1.5 + Math.random() * 1.5 };
        stall.add(mini);
      }

      // Invisible Raycast Hit Box for comfortable touch & click
      const hitBoxGeo = new THREE.BoxGeometry(1.8, 2.2, 1.8);
      const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      hitBox.position.set(0, 1.1, 0);
      hitBox.userData = { business: item, stallRef: stall };
      stall.add(hitBox);

      interactiveObjects.push(hitBox);
      stallDataMap.set(hitBox, item);
      stallsGroup.add(stall);

      return stall;
    };

    // Distribute demonstration businesses around the circular bazar layout
    const businessesToPlace = MOCK_BUSINESSES.slice(0, 8);
    const angleStep = (Math.PI * 2) / businessesToPlace.length;
    businessesToPlace.forEach((biz, idx) => {
      buildCubeStall(biz, idx * angleStep, 4.8);
    });

    // 6. Floating Ambient Cube Cloud Particles (Signature 3D Cube identity)
    const cubeCount = isSoftwareGl ? 20 : 60;
    const cloudGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: '#FF8A5B',
      roughness: 0.3,
      metalness: 0.4,
    });
    const instancedCubes = new THREE.InstancedMesh(cloudGeo, cloudMat, cubeCount);
    const dummy = new THREE.Object3D();
    const cubeOrigins: { x: number; y: number; z: number; speed: number; rotSpeed: number }[] = [];

    for (let i = 0; i < cubeCount; i++) {
      const rad = 2 + Math.random() * 5.5;
      const th = Math.random() * Math.PI * 2;
      const x = Math.cos(th) * rad;
      const y = 1.2 + Math.random() * 3.5;
      const z = Math.sin(th) * rad;
      const speed = 0.5 + Math.random() * 1.2;
      const rotSpeed = 0.8 + Math.random() * 1.5;

      cubeOrigins.push({ x, y, z, speed, rotSpeed });
      dummy.position.set(x, y, z);
      const s = 0.5 + Math.random() * 0.8;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      instancedCubes.setMatrixAt(i, dummy.matrix);
    }
    instancedCubes.instanceMatrix.needsUpdate = true;
    instancedCubes.frustumCulled = false;
    scene.add(instancedCubes);

    // 7. Raycaster for Hover & Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(clickMouse, camera);
      const hits = raycaster.intersectObjects(interactiveObjects, false);
      if (hits.length > 0) {
        const hitBiz = stallDataMap.get(hits[0].object);
        if (hitBiz && onSelectBusiness) {
          onSelectBusiness(hitBiz);
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // Touch & Drag Orbit Controls
    const handlePointerDown = (e: PointerEvent) => {
      controlsStateRef.current.isDragging = true;
      controlsStateRef.current.prevX = e.clientX;
      controlsStateRef.current.prevY = e.clientY;
    };

    const handlePointerDrag = (e: PointerEvent) => {
      if (!controlsStateRef.current.isDragging) return;
      const dx = e.clientX - controlsStateRef.current.prevX;
      const dy = e.clientY - controlsStateRef.current.prevY;
      controlsStateRef.current.prevX = e.clientX;
      controlsStateRef.current.prevY = e.clientY;

      controlsStateRef.current.theta -= dx * 0.008;
      controlsStateRef.current.phi = Math.max(
        0.3,
        Math.min(Math.PI / 2.1, controlsStateRef.current.phi - dy * 0.008)
      );
    };

    const handlePointerUp = () => {
      controlsStateRef.current.isDragging = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerDrag);
    window.addEventListener('pointerup', handlePointerUp);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    // 8. Main Animation Loop with exponential damping & software guard
    let animFrameId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Auto-rotation if enabled and not currently dragging
      if (isRotating && !controlsStateRef.current.isDragging) {
        controlsStateRef.current.theta += autoRotateSpeed * 0.3 * delta;
      }

      // Smooth camera position damping
      const ctrl = controlsStateRef.current;
      ctrl.distance = THREE.MathUtils.damp(ctrl.distance, ctrl.targetDistance, 8, delta);

      camera.position.x = ctrl.distance * Math.sin(ctrl.phi) * Math.sin(ctrl.theta);
      camera.position.y = ctrl.distance * Math.cos(ctrl.phi);
      camera.position.z = ctrl.distance * Math.sin(ctrl.phi) * Math.cos(ctrl.theta);
      camera.lookAt(0, 0.8, 0);

      // Animate floating cube particles
      for (let i = 0; i < cubeCount; i++) {
        const item = cubeOrigins[i];
        const yOffset = Math.sin(elapsed * item.speed + i) * 0.3;
        dummy.position.set(item.x, item.y + yOffset, item.z);
        dummy.rotation.x = elapsed * item.rotSpeed * 0.5;
        dummy.rotation.y = elapsed * item.rotSpeed;
        dummy.updateMatrix();
        instancedCubes.setMatrixAt(i, dummy.matrix);
      }
      instancedCubes.instanceMatrix.needsUpdate = true;

      // Raycast hover check
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, false);
      if (intersects.length > 0) {
        const targetBiz = stallDataMap.get(intersects[0].object);
        if (targetBiz && targetBiz.nameBn !== hoveredStall) {
          setHoveredStall(targetBiz.nameBn);
          container.style.cursor = 'pointer';
        }
      } else {
        if (hoveredStall !== null) {
          setHoveredStall(null);
          container.style.cursor = 'default';
        }
      }

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    };

    animFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerDrag);
      window.removeEventListener('pointerup', handlePointerUp);

      groundGeo.dispose();
      groundMat.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [isRotating, autoRotateSpeed]);

  const handleZoom = (delta: number) => {
    controlsStateRef.current.targetDistance = Math.max(8, Math.min(22, controlsStateRef.current.targetDistance + delta));
    setZoomLevel(controlsStateRef.current.targetDistance);
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-[#FAF7F2] select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full min-h-[360px]" />

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-orange-100 text-xs font-medium text-neutral-800">
        <span className="w-2 h-2 rounded-full bg-[#FF6A3D] animate-ping" />
        <span className="font-semibold text-[#FF6A3D]">মির্জাপুর ৩ডি ভক্সেল বাজার</span>
        <span className="text-neutral-400">|</span>
        <span className="text-neutral-600">ঘুরে দেখুন স্টলগুলো</span>
      </div>

      {/* Hover Tooltip / Stall Indicator */}
      {hoveredStall && (
        <div className="absolute top-4 right-4 z-10 px-4 py-2 rounded-2xl bg-neutral-900/90 text-white backdrop-blur-md shadow-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-[#FFA63D]" />
          <span>দোকান: <span className="text-[#FF9E79] font-bold">{hoveredStall}</span></span>
          <span className="text-[10px] text-white/60 bg-white/10 px-1.5 py-0.5 rounded">ক্লিক করে বিস্তারিত</span>
        </div>
      )}

      {/* Bottom Minimalist Controls Dock */}
      {interactive && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md shadow-md border border-neutral-100">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
              isRotating ? 'bg-orange-50 text-[#FF6A3D] font-medium' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
            title={isRotating ? 'অটো-ঘূর্ণন বন্ধ করুন' : 'অটো-ঘূর্ণন শুরু করুন'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span className="text-[11px]">{isRotating ? 'অটো-ঘূর্ণন' : 'স্থির'}</span>
          </button>

          <div className="h-4 w-px bg-neutral-200 mx-1" />

          <button
            onClick={() => handleZoom(-2)}
            className="p-1.5 rounded-xl text-neutral-600 hover:text-[#FF6A3D] hover:bg-orange-50 transition-colors"
            title="জুম ইন"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(2)}
            className="p-1.5 rounded-xl text-neutral-600 hover:text-[#FF6A3D] hover:bg-orange-50 transition-colors"
            title="জুম আউট"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-neutral-200 mx-1" />

          <span className="text-[10px] text-neutral-500 font-medium px-1">
            ড্র্যাগ করে ৩৬০° ভিউ
          </span>
        </div>
      )}
    </div>
  );
};
