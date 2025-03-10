<script>
    import { onMount, onDestroy } from 'svelte';
    import { gsap } from 'gsap'; 
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    export let cx = 0;
    export let cy = 0;
    export let cz = 28.8;

    // Neuer Parameter, um zu prüfen ob wir uns auf der Hauptseite befinden
    export let isMainPage = true;

    // Füge eine neue Variable hinzu, die den aktuellen Abschnitt repräsentiert
    export let currentSection = 'intro'; // Exportiere diese Variable

    // Exportiere eine Funktion zur Navigation zwischen den Stationen
    export function navigateToSection(sectionId) {
        if (isTransitioning) return;
        
        let targetStation;
        switch(sectionId) {
            case "design-work":
                targetStation = 1; // ca. 20 (Design Work)
                break;
            case "code-data":
                targetStation = 6; // ca. 1 (Code & Data)
                break;
            case "website-projects":
                targetStation = 8; // ca. -7.5 (Website Projects)
                break;
            case "photo-video":
                targetStation = 10; // ca. -16.5 (Photo & Video)
                break;
            case "about-me":
                targetStation = 12; // ca. -31.5 (About me)
                break;
            default:
                targetStation = 0; // Start
                break;
        }
        
        if (targetStation !== currentStation) {
            isTransitioning = true;
            currentStation = targetStation;
            currentSection = sectionId; // Aktualisiere auch den aktuellen Abschnitt
            
            gsap.to(camera.position, {
                z: cameraStations[currentStation],
                duration: 1.5,
                ease: "power2.inOut",
                onComplete: () => {
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 200);
                }
            });
        }
    }

    // Funktion zum Aktualisieren des aktuellen Abschnitts basierend auf der Kameraposition
    function updateCurrentSection() {
        if (camera.position.z > 24) {
            currentSection = 'intro';
        } else if (camera.position.z > 1.5) {
            currentSection = 'design-work';
        } else if (camera.position.z > -7.5) {
            currentSection = 'code-data';
        } else if (camera.position.z > -13) {
            currentSection = 'website-projects';
        } else if (camera.position.z > -25) {
            currentSection = 'photo-video';
        } else {
            currentSection = 'about-me';
        }
    }

    let container;
    let scene, camera, renderer;
    let corridorLines, backWall, textMesh;
    let scrollProgress = 0;

    // Start- und Endposition der Kamera
    const cameraStartZ = 28.8; 
    const cameraEndZ = -40;

    let THREE;
    let canvas, context, textTexture;
    let textUpdateInterval;
    const greetings = ["Hello.", "你好.", "Bonjour.", "Hola.", "안녕하세요.", "Hallo."];
    let currentGreetingIndex = 0;

    // Array für alle "nicht-Cover" Bilder (z.B. Earthquake, Nass1, Bwegt1 usw.)
    let imageMeshes = [];

    // Für die Cover nutzen wir Gruppen (jede Gruppe enthält zwei Meshes)
    let coverGroups = [];

    // Raycaster und Maus-Vektor für Hover
    let raycaster, mouse;

    // Scroll-Logik
    let isTransitioning = false;
    const cameraStations = [28.8, 20, 16.5, 13, 9.5, 5.5, 1, -3.5, -7.5, -12, -16.5, -21, -27, -31.5, -36];
    let currentStation = 0;
    

    let initialPositionSet = false;

    // Funktion zum Hinzufügen des Wheel-Event-Listeners
    function addWheelListener() {
      window.addEventListener('wheel', onWheel, { passive: false });
      console.log("Wheel listener added");
    }

    // Funktion zum Entfernen des Wheel-Event-Listeners
    function removeWheelListener() {
      window.removeEventListener('wheel', onWheel);
      console.log("Wheel listener removed");
    }

    // Diese Funktion setzt den Overflow-Style basierend auf isMainPage
    function updateOverflowStyle() {
      if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = isMainPage ? 'hidden' : 'auto';
        document.body.style.overflow = isMainPage ? 'hidden' : 'auto';
      }
    }

    onMount(async () => {
      THREE = await import('three');
      initScene();
      camera.position.set(cx, cy, cz);
  initialPositionSet = true;
  
  const tolerance = 0.1;
  const index = cameraStations.findIndex(val => Math.abs(val - cz) < tolerance);
  if (index >= 0) {
    currentStation = index;
    console.log("Set currentStation to", currentStation);
  } else {
    currentStation = cameraStations.reduce((prev, curr, i) =>
      Math.abs(curr - cz) < Math.abs(cameraStations[prev] - cz) ? i : prev, 0);
    console.log("Fallback: Set currentStation to", currentStation);
  }

    // Abonniere den $page-Store, um bei URL-Änderungen die Kamera einmalig zu aktualisieren:
    const unsubscribe = page.subscribe(($page) => {
    const newCx = Number($page.url.searchParams.get('cx')) || 0;
    const newCy = Number($page.url.searchParams.get('cy')) || 0;
    const newCz = Number($page.url.searchParams.get('cz')) || 28.8;
    // Wenn die URL-Parameter sich geändert haben, setze die Kamera:
    if (camera && newCz !== cz) {
      console.log("Updating camera position from URL to", newCx, newCy, newCz);
      camera.position.set(newCx, newCy, newCz);
      // Aktualisiere auch currentStation:
      const idx = cameraStations.findIndex(val => Math.abs(val - newCz) < tolerance);
      currentStation = idx >= 0 ? idx : cameraStations.reduce((prev, curr, i) =>
        Math.abs(curr - newCz) < Math.abs(cameraStations[prev] - newCz) ? i : prev, 0);
    }
  });


      animate();

      // Nur auf der Hauptseite den Wheel-Listener hinzufügen
      if (isMainPage) {
        addWheelListener();
      }
      
      window.addEventListener('resize', onWindowResize);
      window.addEventListener('mousemove', onMouseMove, false);

      textUpdateInterval = setInterval(() => {
        currentGreetingIndex = (currentGreetingIndex + 1) % greetings.length;
        updateCanvasText();
      }, 2000);

      // Setze Overflow-Style sofort beim Mounten
      updateOverflowStyle();
    });

    onDestroy(() => {
      if (typeof window !== 'undefined') {
        removeWheelListener();
        window.removeEventListener('resize', onWindowResize);
        window.removeEventListener('mousemove', onMouseMove, false);
        
        // Stoppe den Animation-Loop
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        
        // Bereinige WebGL-Ressourcen
        if (renderer) {
          renderer.dispose();
          
          // Bereinige alle Materials und Geometries
          scene.traverse((object) => {
            if (object.isMesh) {
              object.geometry.dispose();
              
              if (object.material.map) {
                object.material.map.dispose();
              }
              object.material.dispose();
            }
          });
        }
      }
      clearInterval(textUpdateInterval);

      // Beim Zerstören der Komponente, stelle sicher, dass Overflow wieder aktiviert wird
      if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
      }
    });



    function initScene() {
      // Szene und Hintergrund
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x01031A);

      // Kamera
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000

        
      );
    //   camera.position.set(0, 0, cameraStartZ);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      // Tone Mapping & Farbraum
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      // Raycaster & Maus-Vektor
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();



      // --------------------------------------------------------
      // Flur-Linien
      const points = [
        new THREE.Vector3(-10, -5, 20),
        new THREE.Vector3(-5, -2.5, -50),
        new THREE.Vector3(10, -5, 20),
        new THREE.Vector3(5, -2.5, -50),
        new THREE.Vector3(-5, 2.5, -50),
        new THREE.Vector3(5, 2.5, -50),
        new THREE.Vector3(-5, -2.5, -50),
        new THREE.Vector3(5, -2.5, -50),
        new THREE.Vector3(-5, 2.5, -50),
        new THREE.Vector3(-5, -2.5, -50),
        new THREE.Vector3(5, 2.5, -50),
        new THREE.Vector3(5, -2.5, -50)
      ];
      const corridorGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const corridorMaterial = new THREE.LineBasicMaterial({ color: 0x707070 });
      corridorLines = new THREE.LineSegments(corridorGeometry, corridorMaterial);
      scene.add(corridorLines);

      // Rückwand
      const backWallGeo = new THREE.PlaneGeometry(10, 5);
      const backWallMat = new THREE.MeshBasicMaterial({ color: 0x010300 });
      backWall = new THREE.Mesh(backWallGeo, backWallMat);
      backWall.position.set(0, 0, -40);
      scene.add(backWall);

      // GridHelper links
    //   const gridHelper = new THREE.GridHelper(20, 5, 0x707070, 0x707070);
    //   gridHelper.rotation.z = -Math.PI / 2;
    //   gridHelper.position.set(-20, 0, -30);
    //   scene.add(gridHelper);

      // GridHelper rechts
    //   const gridHelper2 = new THREE.GridHelper(20, 20, 0x707070, 0x707070);
    //   gridHelper2.rotation.z = -Math.PI / 2;
    //   gridHelper2.position.set(20, 0, 0);
    //   scene.add(gridHelper2);




      // --------------------------------------------------------
      // 1) ERSTER TEXT (Canvas: "Hello., I'm Franz.")
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
      textMesh.position.set(0, 0, 26.5);
      scene.add(textMesh);


            // --------------------------------------------------------
      // 1) Design Work
      const canvas1 = document.createElement('canvas');
      const ratio1 = window.devicePixelRatio || 1;
      canvas1.width = 1024 * ratio1;
      canvas1.height = 512 * ratio1;
      const context1 = canvas1.getContext('2d');
      context1.scale(ratio1, ratio1);

      const textTexture1 = new THREE.CanvasTexture(canvas1);
      textTexture1.colorSpace = THREE.SRGBColorSpace;
      textTexture1.needsUpdate = true;

      function updateCanvas1Text() {
         context1.clearRect(0, 0, 1024, 512);
         context1.fillStyle = "rgba(0,0,0,0)";
         context1.fillRect(0, 0, 1024, 512);
         context1.textAlign = "center";
         context1.textBaseline = "middle";
         context1.fillStyle = "white";
         context1.font = "56px 'IBM Plex Mono'";
         const centerX = 1024 / 2;
         const centerY = 512 / 2;
         context1.fillText("Design Work", centerX, centerY);
         // context2.fillText("Projects", centerX, centerY + 30);
         textTexture1.needsUpdate = true;
      }
      updateCanvas1Text();

      const textMaterial1 = new THREE.MeshBasicMaterial({ map: textTexture1, transparent: true });
      const textGeometry1 = new THREE.PlaneGeometry(4, 2);
      const textMesh1 = new THREE.Mesh(textGeometry1, textMaterial1);
      textMesh1.position.set(0, 0.6, 18.5);
      scene.add(textMesh1);

      // --------------------------------------------------------
      // 2) Code und Data
      const canvas2 = document.createElement('canvas');
      const ratio2 = window.devicePixelRatio || 1;
      canvas2.width = 1024 * ratio2;
      canvas2.height = 512 * ratio2;
      const context2 = canvas2.getContext('2d');
      context2.scale(ratio2, ratio2);

      const textTexture2 = new THREE.CanvasTexture(canvas2);
      textTexture2.colorSpace = THREE.SRGBColorSpace;
      textTexture2.needsUpdate = true;

      function updateCanvas2Text() {
         context2.clearRect(0, 0, 1024, 512);
         context2.fillStyle = "rgba(0,0,0,0)";
         context2.fillRect(0, 0, 1024, 512);
         context2.textAlign = "center";
         context2.textBaseline = "middle";
         context2.fillStyle = "white";
         context2.font = "56px 'IBM Plex Mono'";
         const centerX = 1024 / 2;
         const centerY = 512 / 2;
         context2.fillText("Code & Data", centerX, centerY);
         // context2.fillText("Projects", centerX, centerY + 30);
         textTexture2.needsUpdate = true;
      }
      updateCanvas2Text();

      const textMaterial2 = new THREE.MeshBasicMaterial({ map: textTexture2, transparent: true });
      const textGeometry2 = new THREE.PlaneGeometry(4, 2);
      const textMesh2 = new THREE.Mesh(textGeometry2, textMaterial2);
      textMesh2.position.set(0, 0.6, -0.5);
      scene.add(textMesh2);

      // --------------------------------------------------------
      // 3) Website projects
      const canvas3 = document.createElement('canvas');
      const ratio3 = window.devicePixelRatio || 1;
      canvas3.width = 1024 * ratio3;
      canvas3.height = 512 * ratio3;
      const context3 = canvas3.getContext('2d');
      context3.scale(ratio3, ratio3);

      const textTexture3 = new THREE.CanvasTexture(canvas3);
      textTexture3.colorSpace = THREE.SRGBColorSpace;
      textTexture3.needsUpdate = true;

      function updateCanvas3Text() {
         context3.clearRect(0, 0, 1024, 512);
         context3.fillStyle = "rgba(0,0,0,0)";
         context3.fillRect(0, 0, 1024, 512);
         context3.textAlign = "center";
         context3.textBaseline = "middle";
         context3.fillStyle = "white";
         context3.font = "56px 'IBM Plex Mono'";
         const centerX = 1024 / 2;
         const centerY = 512 / 2;
         context3.fillText("Website Projects", centerX, centerY);
         // context3.fillText("Projects", centerX, centerY + 30);
         textTexture3.needsUpdate = true;
      }

      
      updateCanvas3Text();

      const textMaterial3 = new THREE.MeshBasicMaterial({ map: textTexture3, transparent: true });
      const textGeometry3 = new THREE.PlaneGeometry(4, 2);
      const textMesh3 = new THREE.Mesh(textGeometry3, textMaterial3);
      textMesh3.position.set(0, 0.6, -9);
      scene.add(textMesh3);




            // --------------------------------------------------------
      // 4) Photo & Video
      const canvas4 = document.createElement('canvas');
      const ratio4 = window.devicePixelRatio || 1;
      canvas4.width = 1024 * ratio4;
      canvas4.height = 512 * ratio4;
      const context4 = canvas4.getContext('2d');
      context4.scale(ratio4, ratio4);

      const textTexture4 = new THREE.CanvasTexture(canvas4);
      textTexture4.colorSpace = THREE.SRGBColorSpace;
      textTexture4.needsUpdate = true;

      function updateCanvas4Text() {
         context4.clearRect(0, 0, 1024, 512);
         context4.fillStyle = "rgba(0,0,0,0)";
         context4.fillRect(0, 0, 1024, 512);
         context4.textAlign = "center";
         context4.textBaseline = "middle";
         context4.fillStyle = "white";
         context4.font = "56px 'IBM Plex Mono'";
         const centerX = 1024 / 2;
         const centerY = 512 / 2;
         context4.fillText("Photo & Video", centerX, centerY);
         // context4.fillText("Videography", centerX, centerY + 30);
         textTexture4.needsUpdate = true;
      }
      updateCanvas4Text();

      const textMaterial4 = new THREE.MeshBasicMaterial({ map: textTexture4, transparent: true });
      const textGeometry4 = new THREE.PlaneGeometry(4, 2);
      const textMesh4 = new THREE.Mesh(textGeometry4, textMaterial4);
      textMesh4.position.set(0, 0.6, -18);
      scene.add(textMesh4);





// --------------------------------------------------------
      // 5) About me
      const canvas5 = document.createElement('canvas');
      const ratio5 = window.devicePixelRatio || 1;
      canvas5.width = 1024 * ratio5;
      canvas5.height = 512 * ratio5;
      const context5 = canvas5.getContext('2d');
      context5.scale(ratio5, ratio5);

      const textTexture5 = new THREE.CanvasTexture(canvas5);
      textTexture5.colorSpace = THREE.SRGBColorSpace;
      textTexture5.needsUpdate = true;

      function updateCanvas5Text() {
         context5.clearRect(0, 0, 1024, 512);
         context5.fillStyle = "rgba(0,0,0,0)";
         context5.fillRect(0, 0, 1024, 512);
         context5.textAlign = "center";
         context5.textBaseline = "middle";
         context5.fillStyle = "white";
         context5.font = "56px 'IBM Plex Mono'";
         const centerX = 1024 / 2;
         const centerY = 512 / 2;
         context5.fillText("About me", centerX, centerY);
         // context4.fillText("Videography", centerX, centerY + 30);
         textTexture5.needsUpdate = true;
      }
      updateCanvas5Text();

      const textMaterial5 = new THREE.MeshBasicMaterial({ map: textTexture5, transparent: true });
      const textGeometry5 = new THREE.PlaneGeometry(4, 2);
      const textMesh5 = new THREE.Mesh(textGeometry5, textMaterial5);
      textMesh5.position.set(0, 0.6, -28.5);
      scene.add(textMesh5);


      


      // --------------------------------------------------------
      // 3) BILDER LADEN + HOVER-TEXTUREN (Cover-Gruppen)
      const textureLoader = new THREE.TextureLoader();

      // Default-Texturen
      const cover3 = textureLoader.load('/Cover3.png');
      cover3.colorSpace = THREE.SRGBColorSpace;
      const cover2 = textureLoader.load('/Cover2.png');
      cover2.colorSpace = THREE.SRGBColorSpace;
      const cover1 = textureLoader.load('/Cover4.png');
      cover1.colorSpace = THREE.SRGBColorSpace;
      const cover4 = textureLoader.load('/Cover1.png');
      cover4.colorSpace = THREE.SRGBColorSpace;

      // Hover-Texturen (hier testweise alle = "/Karin1.png")
      const hover3 = textureLoader.load('/Karin1.png');
      hover3.colorSpace = THREE.SRGBColorSpace;
      const hover2 = textureLoader.load('/Hover2.png');
      hover2.colorSpace = THREE.SRGBColorSpace;
      const hover1 = textureLoader.load('/Hover1.png');
      hover1.colorSpace = THREE.SRGBColorSpace;
      const hover4 = textureLoader.load('/HoverKarin.png');
      hover4.colorSpace = THREE.SRGBColorSpace;

      // Funktion, die eine Cover-Gruppe erstellt (zwei Meshes übereinander)
      function createCoverGroup(defaultTex, hoverTex, x, y, z, finalX, offscreenX) {
         const group = new THREE.Group();
         group.position.set(x, y, z);
         group.scale.set(0.6, 0.6, 0.6);
         const geom = new THREE.PlaneGeometry(3, 2);
         const defaultMat = new THREE.MeshBasicMaterial({
            map: defaultTex,
            transparent: true,
            toneMapped: false,
            opacity: 1,
            color: 0xffffff
         });
         const defaultMesh = new THREE.Mesh(geom, defaultMat);
         const hoverMat = new THREE.MeshBasicMaterial({
            map: hoverTex,
            transparent: true,
            toneMapped: false,
            opacity: 0,  // startet ausgeblendet
            color: 0xffffff
         });
         const hoverMesh = new THREE.Mesh(geom, hoverMat);
         group.add(defaultMesh);
         group.add(hoverMesh);
         group.userData.defaultMesh = defaultMesh;
         group.userData.hoverMesh = hoverMesh;
         group.userData.finalX = finalX;
         group.userData.offscreenX = offscreenX;
         // Für den Raycast speichern wir einen Verweis im defaultMesh
         defaultMesh.userData.parentGroup = group;
         return group;
      }

      // Vier Cover-Gruppen erstellen
      const coverGroup1 = createCoverGroup(cover3, hover3,  3,  0.65, -5.5, 1.2,  3);
      const coverGroup2 = createCoverGroup(cover2, hover2,  3, -0.65, -5.5, 1.2,  3);
      const coverGroup3 = createCoverGroup(cover1, hover1, -3,  0.65, -5.5, -1.2, -3);
      const coverGroup4 = createCoverGroup(cover4, hover4, -3, -0.65, -5.5, -1.2, -3);

      scene.add(coverGroup1);
      scene.add(coverGroup2);
      scene.add(coverGroup3);
      scene.add(coverGroup4);

      coverGroups.push(coverGroup1, coverGroup2, coverGroup3, coverGroup4);

      // --------------------------------------------------------
    // 4) WEITERE BILDER (z. B. Earthquake, Nass1, Bwegt1)
    const pngTexture1 = textureLoader.load('/Bild2.png');
    pngTexture1.colorSpace = THREE.SRGBColorSpace;
    const pngGeometry1 = new THREE.PlaneGeometry(3, 2);
    const pngMaterial1 = new THREE.MeshBasicMaterial({
    map: pngTexture1,
    transparent: true,
    toneMapped: false
    });
    const pngMesh1 = new THREE.Mesh(pngGeometry1, pngMaterial1);
    pngMesh1.position.set(-3, 0, 15);
    pngMesh1.userData.finalX = 0;
    pngMesh1.userData.offscreenX = -3;
    // Markiere dieses Bild als Nass-Projekt:
    pngMesh1.userData.project = 'nass';
    scene.add(pngMesh1);
    imageMeshes.push(pngMesh1);

      const pngTexture2 = textureLoader.load('/Bild1.png');
      pngTexture2.colorSpace = THREE.SRGBColorSpace;
      const pngGeometry2 = new THREE.PlaneGeometry(3, 2);
      const pngMaterial2 = new THREE.MeshBasicMaterial({ map: pngTexture2, transparent: true });
      const pngMesh2 = new THREE.Mesh(pngGeometry2, pngMaterial2);
      pngMesh2.position.set(3, 0, 11.5);
      pngMesh2.userData.finalX = 0;
      pngMesh2.userData.offscreenX = 3;
      pngMesh2.userData.project = 'bwegt';
      scene.add(pngMesh2);
      imageMeshes.push(pngMesh2);

      const pngTexture3 = textureLoader.load('/Bild3.png');
      pngTexture3.colorSpace = THREE.SRGBColorSpace;
      const pngGeometry3 = new THREE.PlaneGeometry(3, 2);
      const pngMaterial3 = new THREE.MeshBasicMaterial({ map: pngTexture3, transparent: true });
      const pngMesh3 = new THREE.Mesh(pngGeometry3, pngMaterial3);
      pngMesh3.position.set(-3, 0, 8);
      pngMesh3.userData.finalX = 0;
      pngMesh3.userData.offscreenX = -3;
      scene.add(pngMesh3);
      imageMeshes.push(pngMesh3);

      const pngTexture4 = textureLoader.load('/Bild4.png');
      pngTexture4.colorSpace = THREE.SRGBColorSpace;
      const pngGeometry4 = new THREE.PlaneGeometry(3, 2);
      const pngMaterial4 = new THREE.MeshBasicMaterial({ map: pngTexture4, transparent: true });
      const pngMesh4 = new THREE.Mesh(pngGeometry4, pngMaterial4);
      pngMesh4.position.set(3, 0, 4);
      pngMesh4.userData.finalX = 0;
      pngMesh4.userData.offscreenX = 3;
      scene.add(pngMesh4);
      imageMeshes.push(pngMesh4);

      const pngTexturePC1 = textureLoader.load('/Website1.png');
      pngTexturePC1.colorSpace = THREE.SRGBColorSpace;
      const pngGeometryPC1 = new THREE.PlaneGeometry(2.8, 3.4);
      const pngMaterialPC1 = new THREE.MeshBasicMaterial({ map: pngTexturePC1, transparent: true });
      const pngMeshPC1 = new THREE.Mesh(pngGeometryPC1, pngMaterialPC1);
      pngMeshPC1.position.set(-3, 0, -13.5);
      pngMeshPC1.scale.set(0.6,0.6,0.6);
      pngMeshPC1.userData.finalX = -0.8;
      pngMeshPC1.userData.offscreenX = -3;
      scene.add(pngMeshPC1);
      imageMeshes.push(pngMeshPC1);


      const pngTexturePC2 = textureLoader.load('/Website2.png');
      pngTexturePC2.colorSpace = THREE.SRGBColorSpace;
      const pngGeometryPC2 = new THREE.PlaneGeometry(2.8, 3.4);
      const pngMaterialPC2 = new THREE.MeshBasicMaterial({ map: pngTexturePC2, transparent: true });
      const pngMeshPC2 = new THREE.Mesh(pngGeometryPC2, pngMaterialPC2);
      pngMeshPC2.position.set(3, 0, -13.5);
      pngMeshPC2.scale.set(0.6,0.6,0.6);
      pngMeshPC2.userData.finalX = 0.8;
      pngMeshPC2.userData.offscreenX = 3;
      scene.add(pngMeshPC2);
      imageMeshes.push(pngMeshPC2);



      const pngTextureFoto = textureLoader.load('/photo-video.png');
      pngTextureFoto.colorSpace = THREE.SRGBColorSpace;
      const pngGeometryFoto = new THREE.PlaneGeometry(3, 2);
      const pngMaterialFoto = new THREE.MeshBasicMaterial({ map: pngTextureFoto, transparent: true });
      const pngMeshFoto = new THREE.Mesh(pngGeometryFoto, pngMaterialFoto);
      pngMeshFoto.position.set(3, 0, -22.5);
      pngMeshFoto.userData.finalX = 0;
      pngMeshFoto.userData.offscreenX = 3;
      scene.add(pngMeshFoto);
      imageMeshes.push(pngMeshFoto);



      const pngTextureMe = textureLoader.load('/photo-video.png');
      pngTextureMe.colorSpace = THREE.SRGBColorSpace;
      const pngGeometryMe = new THREE.PlaneGeometry(3, 2);
      const pngMaterialMe = new THREE.MeshBasicMaterial({ map: pngTextureMe, transparent: true });
      const pngMeshMe = new THREE.Mesh(pngGeometryMe, pngMaterialMe);
      pngMeshMe.position.set(3, 0, -33);
      pngMeshMe.userData.finalX = 0;
      pngMeshMe.userData.offscreenX = 3;
      scene.add(pngMeshMe);
      imageMeshes.push(pngMeshMe);
   }









   function handleCanvasClick(event) {
  // Normalisierte Mauskoordinaten berechnen
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  // Überprüfe sowohl Cover-Gruppen als auch die imageMeshes (für einzelne Bilder)
  const clickableObjects = [
    ...coverGroups.map(group => group.userData.defaultMesh),
    ...imageMeshes
  ];
  const intersects = raycaster.intersectObjects(clickableObjects, false);

  if (intersects.length > 0) {
    const clickedObj = intersects[0].object;
    if (intersects.length > 0) {
    const clickedObj = intersects[0].object;
    if (clickedObj.userData.project === 'nass') {
      openNassProject();
    } else if (clickedObj.userData.project === 'bwegt') {
      openBwegtProject();
    }
    }
  }
}

function openBwegtProject() {
  const { x, y, z } = camera.position;
  goto(`/project/bwegt?cx=${x}&cy=${y}&cz=${z}`);
}

function openNassProject() {
  const { x, y, z } = camera.position;
  goto(`/project/nass?cx=${x}&cy=${y}&cz=${z}`);
}

   // ----------------------------------------------------------------------------
   // Aktualisiert den Canvas-Text ("Hello..., I'm Franz...")
   // ----------------------------------------------------------------------------
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
         "an Interaction Designer passionated",
         "about crafting intuitive and enganging digital",
         "experience, bringing digital worlds to life",
         "through user-centered design."
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

   // ----------------------------------------------------------------------------
   // SCROLL-LOGIK
   // ----------------------------------------------------------------------------
   function onWheel(event) {
      event.preventDefault();
      console.log("Wheel event in Stage component");
      console.log("Before scroll: currentStation =", currentStation, "camera z =", camera.position.z);
      if (isTransitioning) return;

      if (event.deltaY > 0 && currentStation < cameraStations.length - 1) {
         currentStation++;
         isTransitioning = true;
         gsap.to(camera.position, {
            z: cameraStations[currentStation],
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                updateCurrentSection(); // Hier den aktuellen Abschnitt aktualisieren
                console.log("After scroll (forward): currentStation =", currentStation, "camera z =", camera.position.z);
               setTimeout(() => {
                  isTransitioning = false;
               }, 200);
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
                updateCurrentSection(); // Hier den aktuellen Abschnitt aktualisieren
                console.log("After scroll (backward): currentStation =", currentStation, "camera z =", camera.position.z);
               setTimeout(() => {
                  isTransitioning = false;
               }, 200);
            }
         });
      }
   }

   // ----------------------------------------------------------------------------
   // MOUSEMOVE -> Raycasting -> HOVER-LOGIK (für Cover-Gruppen)
   // ----------------------------------------------------------------------------
   function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  // Klickbare Objekte: sowohl Cover-Gruppen (defaultMesh) als auch einzelne Bilder
  const clickableObjects = [
    ...coverGroups.map(group => group.userData.defaultMesh),
    ...imageMeshes
  ];
  const intersects = raycaster.intersectObjects(clickableObjects, false);

  // Hier den Cursor setzen:
  if (intersects.length > 0 && ['nass', 'bwegt'].includes(intersects[0].object.userData.project)) {
  container.style.cursor = 'pointer';
} else {
  container.style.cursor = 'default';
}

  // Dein bestehender Hover-Logik-Code
  if (intersects.length === 0) {
    coverGroups.forEach(group => {
      setCoverGroupState(group, "default");
    });
  } else {
    const hoveredDefault = intersects[0].object;
    const hoveredGroup = hoveredDefault.userData.parentGroup;
    coverGroups.forEach(group => {
      if (group === hoveredGroup) {
        setCoverGroupState(group, "hover");
      } else {
        setCoverGroupState(group, "gray");
      }
    });
  }
}


   // Setzt den Zustand einer Cover-Gruppe:
   // "hover": Hover-Gruppen: hoverMesh.opacity → 1, defaultMesh.opacity → 0.5, Farbe Weiß
   // "gray": Andere: hoverMesh.opacity → 0, defaultMesh.opacity → 1, Farbe grau (0.5)
   // "default": Standard (kein Hover): hoverMesh.opacity → 0, defaultMesh.opacity → 1, Farbe Weiß
   function setCoverGroupState(group, state) {
      if (state === "hover") {
         gsap.to(group.userData.hoverMesh.material, { opacity: 1, duration: 0.6, ease: "power1.inOut" });
         gsap.to(group.userData.defaultMesh.material, { opacity: 0, duration: 0.6, ease: "power1.inOut" });
         gsap.to(group.userData.defaultMesh.material.color, { r: 1, g: 1, b: 1, duration: 0.6, ease: "power1.inOut" });
      } else if (state === "gray") {
         gsap.to(group.userData.hoverMesh.material, { opacity: 0, duration: 0.6, ease: "power1.inOut" });
         gsap.to(group.userData.defaultMesh.material, { opacity: 1, duration: 0.6, ease: "power1.inOut" });
         gsap.to(group.userData.defaultMesh.material.color, { r: 0.3, g: 0.3, b: 0.3, duration: 0.6, ease: "power1.inOut" });
      } else if (state === "default") {
         gsap.to(group.userData.hoverMesh.material, { opacity: 0, duration: 0.6, ease: "power1.inOut" });
         gsap.to(group.userData.defaultMesh.material, { opacity: 1, duration: 0.6, ease: "power1.inOut" });
         gsap.to(group.userData.defaultMesh.material.color, { r: 1, g: 1, b: 1, duration: 0.6, ease: "power1.inOut" });
      }
   }

   // ----------------------------------------------------------------------------
   // Distanz-basiertes Opacity-Fading (für alle Bilder)
   // ----------------------------------------------------------------------------
   function updateAllImages() {
      const dMin = 2;
      const dMax = 20;
      imageMeshes.forEach(mesh => {
         const dist = Math.abs(camera.position.z - mesh.position.z);
         let opacity;
         if (dist <= dMin) {
            opacity = 1;
         } else if (dist >= dMax) {
            opacity = 0;
         } else {
            const t = (dist - dMin) / (dMax - dMin);
            opacity = 0.7 - t * (1 - 0.1);
         }
         mesh.material.opacity = opacity;
      });
   }

   // ----------------------------------------------------------------------------
   // Distanz-basiertes X-Sliding (für alle Bilder)
   // ----------------------------------------------------------------------------
   function updateImagePositions() {
      const threshold = 3;
      imageMeshes.forEach(mesh => {
         const dist = Math.abs(camera.position.z - mesh.position.z);
         if (dist < threshold) {
            gsap.to(mesh.position, { x: mesh.userData.finalX, duration: 1.2, ease: "power1.out" });
         } else {
            gsap.to(mesh.position, { x: mesh.userData.offscreenX, duration: 1.2, ease: "power1.out" });
         }
      });
   }
   function updateCoverGroupPositions() {
  const threshold = 3;
  coverGroups.forEach(group => {
    const dist = Math.abs(camera.position.z - group.position.z);
    if (dist < threshold) {
      gsap.to(group.position, { x: group.userData.finalX, duration: 1.2, ease: "power1.out" });
    } else {
      gsap.to(group.position, { x: group.userData.offscreenX, duration: 1.2, ease: "power1.out" });
    }
  });
}

   // ----------------------------------------------------------------------------
   // Animation-Loop
   // ----------------------------------------------------------------------------
   let animationId; // Speichern der requestAnimationFrame ID

   function animate() {
      animationId = requestAnimationFrame(animate);
      updateAllImages();
      updateImagePositions();
      updateCoverGroupPositions();
      updateCurrentSection(); // Aktualisiere den aktuellen Abschnitt
      renderer.render(scene, camera);
   }

   // ----------------------------------------------------------------------------
   // onWindowResize: Anpassen von Kamera und Renderer
   // ----------------------------------------------------------------------------
   function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
   }
</script>

<style>
   @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap');

   /* Mache die Overflow-Eigenschaft abhängig von isMainPage */
   :global(html, body) {
      margin: 0;
      padding: 0;
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


<div
  id="stage-container"
  bind:this={container}
  role="button"
  tabindex="0"
  on:click={handleCanvasClick}
  on:keydown={(e) => { if(e.key === 'Enter' || e.key === ' ') handleCanvasClick(e); }}>
</div>
