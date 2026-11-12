# R3F Starter Workbench

Local, lightweight Three.js playground built with React, React Three Fiber, Drei, Zustand, and Vite.

## Commands

```bash
cd /home/trav/Projects/r3f-starter
npm install
npm run dev
```

Open http://localhost:5173 on Omarchy, or http://192.168.12.133:5173 on a device on the same reachable network (IP may change).

```bash
npm run build
npm run preview
```

## Controls

- Drag the scene to orbit the camera; scroll or pinch to zoom.
- Click or tap the cube (or use **Change cube**) to toggle its state.
- Pause/resume animation, change rotation speed, show/hide the grid, reset the view.
- Keyboard: Space = pause/resume, R = reset camera (when not typing).

## Where to extend

- `src/App.jsx`: Scene objects, Zustand store, sidebar controls.
- `src/styles.css`: UI styles.
- `src/main.jsx`: React entry point.

This project is independent of the Bissing Roku remote and specimen gallery.
