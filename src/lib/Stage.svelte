<script>
    import { onMount, onDestroy } from 'svelte';
    import { gsap } from 'gsap'; // Stelle sicher, dass GSAP installiert ist
  
    let container;
    let scene, camera, renderer;
    let corridorLines, backWall, textMesh;
    let scrollProgress = 0;
  
    const cameraStartZ = 20;
    const cameraEndZ = -40;
    const wallStartScale = 1;
    const wallEndScale = 8;
  
    let THREE;
    let canvas, context, textTexture;
    let textUpdateInterval;
    const greetings = ["Hello.", "你好.", "Bonjour.", "Hola.", "안녕하세요.", "Hallo."];
    let currentGreetingIndex = 0;
    
    // Globales Array für Bild-Meshes
    let imageMeshes = [];
  
    onMount(async () => {
      THREE = await import('three');
      initScene();
      animate();
      
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('resize', onWindowResize);
      
      textUpdateInterval = setInterval(() => {
        currentGreetingIndex = (currentGreetingIndex + 1) % greetings.length;
        updateCanvasText();
      }, 2000);
    });
    
    onDestroy(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('wheel', onWheel, { passive: false });
        window.removeEventListener('resize', onWindowResize);
      }
      clearInterval(textUpdateInterval);
    });
    
    function initScene() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x01031A);
    
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, cameraStartZ);
    
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
    
      // --- FLUR-Linien & Rückwand (wie gehabt) ---
      const points = [
        // Die Punkte werden paarweise zu Liniensegmenten verbunden:
        // Punkt 1-2: Obere linke Diagonale vom vorderen Bereich zur linken Wand hinten
        // new THREE.Vector3(-10, 5, 20),  // Vorderer, äußerer linker Punkt (oben)
        // new THREE.Vector3(-5, 2.5, -50), // Hinterer, innerer linker Punkt (etwas unten)

        // Punkt 3-4: Obere rechte Diagonale vom vorderen Bereich zur rechten Wand hinten
        // new THREE.Vector3(10, 5, 20),   // Vorderer, äußerer rechter Punkt (oben)
        // new THREE.Vector3(5, 2.5, -50),  // Hinterer, innerer rechter Punkt (etwas unten)

        // Punkt 5-6: Untere linke Diagonale vom vorderen Bereich zur linken Wand hinten
        new THREE.Vector3(-10, -5, 20), // Vorderer, äußerer linker Punkt (unten)
        new THREE.Vector3(-5, -2.5, -50),// Hinterer, innerer linker Punkt (etwas oben)

        // Punkt 7-8: Untere rechte Diagonale vom vorderen Bereich zur rechten Wand hinten
        new THREE.Vector3(10, -5, 20),  // Vorderer, äußerer rechter Punkt (unten)
        new THREE.Vector3(5, -2.5, -50), // Hinterer, innerer rechter Punkt (etwas oben)

        // Punkt 9-10: Obere Kante der Rückwand (von linker zur rechter Seite)
        new THREE.Vector3(-5, 2.5, -50), // Linker Punkt oben an der Rückwand
        new THREE.Vector3(5, 2.5, -50),  // Rechter Punkt oben an der Rückwand

        // Punkt 11-12: Untere Kante der Rückwand (von linker zur rechter Seite)
        new THREE.Vector3(-5, -2.5, -50),// Linker Punkt unten an der Rückwand
        new THREE.Vector3(5, -2.5, -50), // Rechter Punkt unten an der Rückwand

        // Punkt 13-14: Linke Kante der Rückwand (von oben nach unten)
        new THREE.Vector3(-5, 2.5, -50), // Obere linke Ecke der Rückwand
        new THREE.Vector3(-5, -2.5, -50),// Untere linke Ecke der Rückwand

        // Punkt 15-16: Rechte Kante der Rückwand (von oben nach unten)
        new THREE.Vector3(5, 2.5, -50),  // Obere rechte Ecke der Rückwand
        new THREE.Vector3(5, -2.5, -50)  // Untere rechte Ecke der Rückwand

      ];
      const corridorGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const corridorMaterial = new THREE.LineBasicMaterial({ color: 0x707070 });
      corridorLines = new THREE.LineSegments(corridorGeometry, corridorMaterial);
      scene.add(corridorLines);
    
      const backWallGeo = new THREE.PlaneGeometry(10, 5);
      const backWallMat = new THREE.MeshBasicMaterial({ color: 0x010300 });
      backWall = new THREE.Mesh(backWallGeo, backWallMat);
      backWall.position.set(0, 0, -50);
      scene.add(backWall);

          // Erstelle einen GridHelper, der ein Raster mit einer Breite von 20 Einheiten 
// und 10 Unterteilungen zeigt. Du kannst die Farben (für die Mittellinie und das Raster) anpassen.
const gridHelper = new THREE.GridHelper(20, 5, 0x707070, 0x707070);  
// Drehe den GridHelper, damit er horizontal (auf dem Boden) liegt.
gridHelper.rotation.z = -Math.PI / 2;
// Positioniere ihn so, dass er zwischen den beiden unteren Linien liegt.
// Zum Beispiel, wenn deine unteren Linien bei y = -5 liegen, kannst du den GridHelper auf y = -5 setzen.
gridHelper.position.set(-20, 0, -30); // Passe z und x an, damit er in deinen Flur passt
scene.add(gridHelper);

const gridHelper2 = new THREE.GridHelper(20, 20, 0x707070, 0x707070);
// Drehe den GridHelper, damit er horizontal (auf dem Boden) liegt.
gridHelper2.rotation.z = -Math.PI / 2;
// Positioniere ihn so, dass er zwischen den beiden unteren Linien liegt.
// Zum Beispiel, wenn deine unteren Linien bei y = -5 liegen, kannst du den GridHelper auf y = -5 setzen.
gridHelper2.position.set(20, 0, 0); // Passe z und x an, damit er in deinen Flur passt
scene.add(gridHelper2);
    
      // --- 3D-Text (wie gehabt) ---
      canvas = document.createElement('canvas');
      const ratio = window.devicePixelRatio || 1;
      canvas.width = 1024 * ratio;
      canvas.height = 512 * ratio;
      context = canvas.getContext('2d');
      context.scale(ratio, ratio);
      textTexture = new THREE.CanvasTexture(canvas);
      updateCanvasText();
      const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
      const textGeometry = new THREE.PlaneGeometry(4, 2);
      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(0, 0, cameraStartZ - 1.7);
      scene.add(textMesh);
    
      // --- Bild als Plane mit PNG-Transparenz (Erstes Bild) ---
      const textureLoader = new THREE.TextureLoader();
    
      const pngTexture = textureLoader.load('/Bwegt1.png');
      pngTexture.encoding = THREE.sRGBEncoding;
      const pngGeometry = new THREE.PlaneGeometry(3, 2);
      const pngMaterial = new THREE.MeshBasicMaterial({ map: pngTexture, transparent: true });
      const pngMesh = new THREE.Mesh(pngGeometry, pngMaterial);
      // Starte offscreen (x = offscreenX) und setze die finalen Werte:
      pngMesh.position.set(-3, 0, 15);
      pngMesh.userData.finalX = 0;      // Zielposition
      pngMesh.userData.offscreenX = -3;    // Ausgangsposition
      scene.add(pngMesh);
      imageMeshes.push(pngMesh);
    
      // --- Bild als Plane mit PNG-Transparenz (Zweites Bild) ---
      const pngTexture2 = textureLoader.load('/Nass1.png');
      pngTexture2.encoding = THREE.sRGBEncoding;
      const pngGeometry2 = new THREE.PlaneGeometry(3, 2);
      const pngMaterial2 = new THREE.MeshBasicMaterial({ map: pngTexture2, transparent: true });
      const pngMesh2 = new THREE.Mesh(pngGeometry2, pngMaterial2);
      pngMesh2.position.set(3, 0, 11.5);
      pngMesh2.userData.finalX = 0;
      pngMesh2.userData.offscreenX = 3;
      scene.add(pngMesh2);
      imageMeshes.push(pngMesh2);

      const pngTexture3 = textureLoader.load('/Bwegt1.png');
      pngTexture3.encoding = THREE.sRGBEncoding;
      const pngGeometry3 = new THREE.PlaneGeometry(3, 2);
      const pngMaterial3 = new THREE.MeshBasicMaterial({ map: pngTexture3, transparent: true });
      const pngMesh3 = new THREE.Mesh(pngGeometry3, pngMaterial3);
      // Starte offscreen (x = offscreenX) und setze die finalen Werte:
      pngMesh3.position.set(-3, 0, 7.5);
      pngMesh3.userData.finalX = 0;      // Zielposition
      pngMesh3.userData.offscreenX = -3;    // Ausgangsposition
      scene.add(pngMesh3);
      imageMeshes.push(pngMesh3);

      const pngTexture4 = textureLoader.load('/Bwegt1.png');
      pngTexture4.encoding = THREE.sRGBEncoding;
      const pngGeometry4 = new THREE.PlaneGeometry(3, 2);
      const pngMaterial4 = new THREE.MeshBasicMaterial({ map: pngTexture4, transparent: true });
      const pngMesh4 = new THREE.Mesh(pngGeometry4, pngMaterial4);
      // Starte offscreen (x = offscreenX) und setze die finalen Werte:
      pngMesh4.position.set(3, 0, 3.5);
      pngMesh4.userData.finalX = 0;      // Zielposition
      pngMesh4.userData.offscreenX = 3;    // Ausgangsposition
      scene.add(pngMesh4);
      imageMeshes.push(pngMesh4);
    }


    
    
    function updateCanvasText() {
      context.clearRect(0, 0, 1024, 512);
      context.fillStyle = "rgba(0,0,0,0)";
      context.fillRect(0, 0, 1024, 512);
    
      context.textAlign = "left";
      context.textBaseline = "middle";
      context.fillStyle = "white";
    
      const lines = [
        greetings[currentGreetingIndex],
        "i'm",
        "Franz.",
        "",
        "Feel free to browse",
        "through my work in",
        "3 dimensional Space.",
        "Click to open project."
      ];
    
      let maxWidth = 0;
      for (let i = 0; i < lines.length; i++) {
        if (i < 3) {
          context.font = "56px 'IBM Plex Mono'";
        } else {
          context.font = "32px 'IBM Plex Mono'";
        }
        const w = context.measureText(lines[i]).width;
        if (w > maxWidth) maxWidth = w;
      }
    
      const margin = (1024 - maxWidth) / 2;
      let currentY = 60;
      for (let i = 0; i < lines.length; i++) {
        if (i < 3) {
          context.font = "56px 'IBM Plex Mono'";
          context.fillText(lines[i], margin, currentY);
          currentY += 60;
        } else {
          context.font = "32px 'IBM Plex Mono'";
          context.fillText(lines[i], margin, currentY);
          currentY += 48;
        }
      }
    
      textTexture.needsUpdate = true;
    }
    
    
    let isTransitioning = false;
const cameraStations = [20, 16.5, 13, 9.5, 5.5]; // Beispielwerte (Z-Positionen)
let currentStation = 0;

function onWheel(event) {
  event.preventDefault();
  
  if (isTransitioning) return; // Ignoriere weitere Scroll-Events während einer Animation
  
  if (event.deltaY > 0 && currentStation < cameraStations.length - 1) {
    currentStation++;
    isTransitioning = true;
    gsap.to(camera.position, {
      z: cameraStations[currentStation],
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        isTransitioning = false;
      }
    });
  } else if (event.deltaY < 0 && currentStation > 0) {
    currentStation--;
    isTransitioning = true;
    gsap.to(camera.position, {
      z: cameraStations[currentStation],
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        isTransitioning = false;
      }
    });
  }
}

    
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Funktion zum Aktualisieren der Bild-Opacities
    function updateAllImages() {
      const dMin = 2;
      const dMax = 3;
    
      imageMeshes.forEach(mesh => {
        const dist = Math.abs(camera.position.z - mesh.position.z);
        let opacity;
        if (dist <= dMin) {
          opacity = 1;
        } else if (dist >= dMax) {
          opacity = 0;
        } else {
          const t = (dist - dMin) / (dMax - dMin);
          opacity = 1 - t * (1 - 0.1);
        }
        mesh.material.opacity = opacity;
      });
    }
    
    // NEW: Funktion zur Aktualisierung der x-Position basierend auf Kameradistanz
    function updateImagePositions() {
      const threshold = 3; // Wenn Kamera innerhalb 3 Einheiten vom Bild ist, soll es hereinfahren
      imageMeshes.forEach(mesh => {
        const dist = Math.abs(camera.position.z - mesh.position.z);
        if (dist < threshold) {
          // In Fokus: tween zum finalX
          gsap.to(mesh.position, { x: mesh.userData.finalX, duration: 1.2, ease: "power1.out" });
        } else {
          // Nicht im Fokus: tween zur offscreenX
          gsap.to(mesh.position, { x: mesh.userData.offscreenX, duration: 1.2, ease: "power1.out" });
        }
      });
    }
    
    function animate() {
      requestAnimationFrame(animate);
      updateAllImages();
      updateImagePositions(); // Aufruf der neuen Funktion
      renderer.render(scene, camera);
    }



    
  </script>
    
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap');
    
    :global(html, body) {
      margin: 0;
      padding: 0;
      overflow: hidden;
      height: 100%;
    }
    #stage-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
  </style>
    
  <div id="stage-container" bind:this={container}></div>
  