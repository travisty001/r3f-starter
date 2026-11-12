import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, OrbitControls, RoundedBox } from '@react-three/drei';
import { create } from 'zustand';
import * as THREE from 'three';

const initialScene = {
  active: false,
  paused: false,
  speed: 1,
  showGrid: true,
};

const useScene = create((set) => ({
  ...initialScene,
  cameraResetKey: 0,
  toggleActive: () => set((state) => ({ active: !state.active })),
  togglePaused: () => set((state) => ({ paused: !state.paused })),
  setSpeed: (speed) => set({ speed }),
  setShowGrid: (showGrid) => set({ showGrid }),
  resetCamera: () => set((state) => ({ cameraResetKey: state.cameraResetKey + 1 })),
  resetAll: () => set((state) => ({ ...initialScene, cameraResetKey: state.cameraResetKey + 1 })),
}));

function RotatingCube() {
  const mesh = useRef(null);
  const active = useScene((state) => state.active);
  const paused = useScene((state) => state.paused);
  const speed = useScene((state) => state.speed);
  const toggleActive = useScene((state) => state.toggleActive);

  useFrame((_, elapsedDelta) => {
    if (!mesh.current) return;
    const delta = Math.min(elapsedDelta, 0.05);
    if (!paused) {
      mesh.current.rotation.x += delta * 0.32 * speed;
      mesh.current.rotation.y += delta * 0.64 * speed;
    }
    const nextScale = THREE.MathUtils.damp(
      mesh.current.scale.x,
      active ? 1.26 : 1,
      7,
      delta
    );
    mesh.current.scale.setScalar(nextScale);
  });

  return (
    <RoundedBox
      ref={mesh}
      args={[1.7, 1.7, 1.7]}
      radius={0.1}
      smoothness={4}
      onClick={(event) => {
        event.stopPropagation();
        toggleActive();
      }}
    >
      <meshStandardMaterial
        color={active ? '#ffa96d' : '#7bb9f5'}
        metalness={0.22}
        roughness={0.34}
        emissive={active ? '#9c391e' : '#183f6c'}
        emissiveIntensity={0.13}
      />
    </RoundedBox>
  );
}

function CameraControls() {
  const controls = useRef(null);
  const cameraResetKey = useScene((state) => state.cameraResetKey);

  useEffect(() => {
    controls.current?.reset();
  }, [cameraResetKey]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.075}
      enablePan={false}
      minDistance={2.8}
      maxDistance={13}
      minPolarAngle={0.16}
      maxPolarAngle={Math.PI - 0.16}
    />
  );
}

function Scene() {
  const showGrid = useScene((state) => state.showGrid);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [3.3, 2.4, 5.2], fov: 48 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} />
      <directionalLight position={[-5, 2, -3]} intensity={0.85} color="#84a7ef" />
      <RotatingCube />
      {showGrid && (
        <Grid
          position={[0, -1.45, 0]}
          args={[20, 20]}
          cellSize={0.65}
          cellThickness={0.55}
          cellColor="#344352"
          sectionSize={3.25}
          sectionThickness={0.9}
          sectionColor="#5b6a79"
          fadeDistance={18}
          fadeStrength={1.5}
          infiniteGrid
        />
      )}
      <CameraControls />
    </Canvas>
  );
}

function ControlsPanel() {
  const active = useScene((state) => state.active);
  const paused = useScene((state) => state.paused);
  const speed = useScene((state) => state.speed);
  const showGrid = useScene((state) => state.showGrid);
  const toggleActive = useScene((state) => state.toggleActive);
  const togglePaused = useScene((state) => state.togglePaused);
  const setSpeed = useScene((state) => state.setSpeed);
  const setShowGrid = useScene((state) => state.setShowGrid);
  const resetCamera = useScene((state) => state.resetCamera);
  const resetAll = useScene((state) => state.resetAll);

  return (
    <aside className="control-panel" aria-label="3D scene controls">
      <div className="panel-heading">
        <span className="eyebrow">WORKSPACE / 01</span>
        <h2>Scene controls</h2>
        <p>Adjust the scene without editing code.</p>
      </div>

      <div className="control-group">
        <span className="control-label">Object state</span>
        <div className="state-row">
          <span className={'status-dot ' + (active ? 'active' : '')} />
          <span>{active ? 'Active · warm' : 'Default · cool'}</span>
        </div>
        <button
          className="button button-primary"
          type="button"
          onClick={toggleActive}
          aria-pressed={active}
        >
          Change cube state
        </button>
      </div>

      <div className="control-group">
        <span className="control-label">Animation</span>
        <button
          className="button"
          type="button"
          onClick={togglePaused}
          aria-pressed={paused}
        >
          {paused ? 'Resume rotation' : 'Pause rotation'}
        </button>
        <div className="slider-label">
          <label htmlFor="speed">Rotation speed</label>
          <output htmlFor="speed">{speed.toFixed(1)}×</output>
        </div>
        <input
          id="speed"
          className="speed-slider"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
        />
        <div className="slider-limits"><span>0×</span><span>2×</span></div>
      </div>

      <div className="control-group">
        <span className="control-label">Viewport</span>
        <label className="switch-row">
          <span>Show reference grid</span>
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(event) => setShowGrid(event.target.checked)}
          />
        </label>
        <button className="button" type="button" onClick={resetCamera}>
          Reset camera
        </button>
      </div>

      <button className="reset-link" type="button" onClick={resetAll}>
        Restore defaults
      </button>
    </aside>
  );
}

export default function App() {
  const togglePaused = useScene((state) => state.togglePaused);
  const resetCamera = useScene((state) => state.resetCamera);
  const active = useScene((state) => state.active);
  const paused = useScene((state) => state.paused);

  useEffect(() => {
    function onKeyDown(event) {
      const tag = event.target?.tagName;
      if (event.altKey || event.ctrlKey || event.metaKey || ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(tag)) return;
      if (event.code === 'Space') {
        event.preventDefault();
        togglePaused();
      } else if (event.key?.toLowerCase() === 'r') {
        resetCamera();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [resetCamera, togglePaused]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <div className="brand-name">R3F <span>/</span> STARTER</div>
        </div>
        <div className="header-right">
          <span className="stack-label">THREE.JS · REACT · ZUSTAND</span>
          <span className="local-badge"><span /> LOCAL</span>
        </div>
      </header>

      <main className="workspace">
        <section className="viewer" aria-label="Interactive 3D scene">
          <div className="scene-heading">
            <div>
              <span className="eyebrow">LIVE VIEWPORT</span>
              <h1>3D Workbench</h1>
            </div>
            <span className="scene-index">SCENE 01</span>
          </div>

          <div className="canvas-wrap">
            <Scene />
            <div className="canvas-topline">
              <span className="tiny-dot" />
              {paused ? 'ANIMATION PAUSED' : 'RENDERING'}
            </div>
            <div className="canvas-caption">
              <strong>{active ? 'ACTIVE MESH' : 'INTERACTIVE MESH'}</strong>
              <span>Drag to orbit · Scroll or pinch to zoom · Click cube to change state</span>
            </div>
          </div>
          <div className="viewer-footer">
            <span>01 <span className="footer-muted">/ 01 OBJECT</span></span>
            <span>SPACE <span className="footer-muted">PAUSE</span> &nbsp; R <span className="footer-muted">RESET VIEW</span></span>
          </div>
        </section>
        <ControlsPanel />
      </main>
      <footer className="app-footer">R3F STARTER WORKBENCH <span>BUILT FOR LOCAL DEVELOPMENT</span></footer>
    </div>
  );
}
