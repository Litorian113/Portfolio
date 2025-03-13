<script>
    import { onMount, onDestroy } from 'svelte';
    import { gsap } from 'gsap'; 
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { ProjectMeshFactory } from '$lib/meshes/ProjectMeshFactory.js';
    import { CoverGroupFactory } from '$lib/meshes/CoverGroupFactory.js';
    import { ParticleSystem } from '$lib/effects/ParticleSystem.js';

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

    // Variablen für die Factories
    let projectMeshFactory;
    let coverGroupFactory;

    // Partikelsystem-Variable hinzufügen
    let particleSystem;

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
      
      // Verzögere die Initialisierung, damit der Browser zuerst die Fenstergröße bestimmen kann
      setTimeout(() => {
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

        // Touch-Events für mobile Geräte
        if (typeof window !== 'undefined') {
          container.addEventListener('touchstart', handleTouchStart, { passive: false });
          container.addEventListener('touchmove', handleTouchMove, { passive: false });
          container.addEventListener('touchend', handleTouchEnd, { passive: false });
        }
      }, 10);
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

        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);

        // Partikelsystem aufräumen
        if (particleSystem) {
          particleSystem.dispose();
        }
      }
      clearInterval(textUpdateInterval);

      // Beim Zerstören der Komponente, stelle sicher, dass Overflow wieder aktiviert wird
      if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
      }
    });

    // Zunächst fügen wir neue Variablen für den Typewriter-Effekt hinzu
    // Diese in den Script-Teil einfügen
    let typingInProgress = false;
    let subtitleProgress = [0, 0, 0, 0, 0]; // Fortschritt des Typewriter-Effekts für alle 5 Stationen
    let titleOpacities = [0.4, 0.4, 0.4, 0.4, 0.4]; // Standard-Opacity für Überschriften
    let subtitleTexts = [
      ['A selection of interaction design projects', 'created during my studies at HfG Schwäbisch Gmünd.'],
      ['A collection of coded projects from my', 'studies and personal explorations.'],
      ['Freelance web projects developed for', 'small and medium-sized businesses.'],
      ['Visual work from years of experience as a', 'professional photographer, spanning commercial', 'and personal projects.'],
      ['A glimpse into who I am and', 'what drives my creative journey.']
    ];

    // Füge diese Variable zu den bestehenden Variablen für den Typewriter-Effekt hinzu
    let subtitleOpacities = [1, 1, 1, 1, 1]; // Opacity für jeden Untertext

    // 1. Diese Variablen müssen außerhalb von initScene() deklariert werden:
    let context1, context2, context3, context4, context5;
    let textTexture1, textTexture2, textTexture3, textTexture4, textTexture5;

    // Füge diese Variablen im Script-Bereich hinzu
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0; // Zeit für Geschwindigkeitsmessung
    let isSwiping = false; // Flag, um zu verfolgen, ob ein Swipe im Gange ist

    // Touch-Handler-Funktionen
    function handleTouchStart(event) {
      touchStartY = event.touches[0].clientY;
      touchStartTime = Date.now();
      isSwiping = true;
    }

    function handleTouchMove(event) {
      if (isSwiping) {
        // Optional: Verhindern des Scroll-Verhaltens der Seite
        event.preventDefault();
      }
    }

    function handleTouchEnd(event) {
      if (!isSwiping) return;
      
      isSwiping = false;
      touchEndY = event.changedTouches[0].clientY;
      const touchDiff = touchStartY - touchEndY;
      const touchTime = Date.now() - touchStartTime;
      
      // Berechne Swipe-Geschwindigkeit (Pixel pro Millisekunde)
      const swipeVelocity = Math.abs(touchDiff) / touchTime;
      
      // Minimaler Schwellenwert für Swipe-Erkennung (50px oder hohe Geschwindigkeit)
      if (Math.abs(touchDiff) > 50 || swipeVelocity > 0.5) {
        // Emuliere ein Mausrad-Event für die bestehende onWheel-Funktion
        const wheelEvent = { 
          deltaY: touchDiff, 
          preventDefault: () => {} 
        };
        onWheel(wheelEvent);
      }
    }

    // Optional: Erkennung, ob wir auf einem mobilen Gerät sind
    function isMobileDevice() {
      return (typeof window !== 'undefined' && window.innerWidth <= 768) || 
            (typeof navigator !== 'undefined' && 
            (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)));
    }

    // Füge diese Variablen zu den vorhandenen hinzu
    let isMobile = false;
    let currentTextures = {
      bild1: null,
      bild2: null, 
      bild3: null,
      bild4: null
    };
    
    // Diese Funktion zum Überprüfen der Gerätegröße
    function checkDeviceSize() {
      const wasAlreadyMobile = isMobile;
      isMobile = window.innerWidth <= 768;
      
      // Wenn sich der Status geändert hat, lade die Bilder neu
      if (wasAlreadyMobile !== isMobile && scene) {
        loadAppropriateTextures();
      }
    }
    
    // Verbesserte Version der loadAppropriateTextures-Funktion:
function loadAppropriateTextures() {
  if (!THREE || !scene) return;
  
  const textureLoader = new THREE.TextureLoader();
  const texturePaths = {
    desktop: {
      bild1: '/Bild1.png',
      bild2: '/Bild2.png',
      bild3: '/Bild3.png',
      bild4: '/Bild4.png'
    },
    mobile: {
      bild1: '/mobile/Bild1-mobile.png',
      bild2: '/mobile/Bild2-mobile.png',
      bild3: '/mobile/Bild3-mobile.png',
      bild4: '/mobile/Bild4-mobile.png'
    }
  };
  
  // Wähle die richtigen Pfade basierend auf Gerätegröße
  const paths = isMobile ? texturePaths.mobile : texturePaths.desktop;
  
  // Strukturierte Map für Projekt-zu-Textur-Beziehungen
  const projectTextureMap = {
    'nass': { texture: 'bild1', meshIndex: imageMeshes.findIndex(m => m.userData.project === 'nass') },
    'bwegt': { texture: 'bild2', meshIndex: imageMeshes.findIndex(m => m.userData.project === 'bwegt') },
    'iceAgeMammals': { texture: 'bild3', meshIndex: imageMeshes.findIndex(m => m.userData.project === 'iceAgeMammals') },
    'hybridWallet': { texture: 'bild4', meshIndex: imageMeshes.findIndex(m => m.userData.project === 'hybridWallet') }
  };
  
  // Texturen für alle Projekte aktualisieren
  Object.entries(projectTextureMap).forEach(([project, info]) => {
    const { texture, meshIndex } = info;
    if (meshIndex >= 0) {
      const mesh = imageMeshes[meshIndex];
      
      // Lade die neue Textur
      textureLoader.load(paths[texture], newTexture => {
        newTexture.colorSpace = THREE.SRGBColorSpace;
        
        if (isMobile) {
          // Für mobile Geräte: Passe die Geometrie an das 9:16 Seitenverhältnis an
          const oldPosition = mesh.position.clone();
          const userData = {...mesh.userData};
          
          // Erstelle neue hochformatige Geometrie mit 9:16 Verhältnis
          // Bei Breite 2 wird Höhe: 2 * (16/9) = 3.56
          const newGeometry = new THREE.PlaneGeometry(2, 2 * (16/9));
          
          // Neue Material mit der angepassten Textur
          const newMaterial = new THREE.MeshBasicMaterial({ 
            map: newTexture,
            transparent: true,
            toneMapped: false
          });
          
          // Ersetze die alte Geometrie und Material
          mesh.geometry.dispose();
          mesh.material.dispose();
          mesh.geometry = newGeometry;
          mesh.material = newMaterial;
          
          // Position und Daten wiederherstellen
          mesh.position.copy(oldPosition);
          // Bei Hochformat-Bildern leicht nach oben verschieben, damit sie besser im Blickfeld sind
          mesh.position.y = 0.5; 
          mesh.userData = userData;
          
        } else {
          // Für Desktop: Setze nur die Textur und stelle Originalproportionen wieder her
          // Sichere die alte Position und Daten
          const oldPosition = mesh.position.clone();
          const userData = {...mesh.userData};
          
          // Erstelle neue Querformat-Geometrie (3:2)
          const newGeometry = new THREE.PlaneGeometry(3, 2);
          
          // Neue Material mit der angepassten Textur
          const newMaterial = new THREE.MeshBasicMaterial({ 
            map: newTexture,
            transparent: true,
            toneMapped: false
          });
          
          // Ersetze die alte Geometrie und Material
          mesh.geometry.dispose();
          mesh.material.dispose();
          mesh.geometry = newGeometry;
          mesh.material = newMaterial;
          
          // Position und Daten wiederherstellen
          mesh.position.copy(oldPosition);
          mesh.position.y = 0; // Y-Position zurücksetzen
          mesh.userData = userData;
        }
        
        // Speichere die aktuelle Textur
        currentTextures[texture] = newTexture;
      });
    }
  });
}

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

      // Für mobile Geräte: Reduziere die Render-Qualität für bessere Performance
      if (isMobileDevice()) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      } else {
        renderer.setPixelRatio(window.devicePixelRatio);
      }

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

      // Factories initialisieren
      projectMeshFactory = new ProjectMeshFactory(scene, isMobile);
      coverGroupFactory = new CoverGroupFactory(scene, isMobile);

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
      context1 = canvas1.getContext('2d'); // KEINE lokale Variable!
      context1.scale(ratio1, ratio1);

      textTexture1 = new THREE.CanvasTexture(canvas1); // KEINE lokale Variable!
      textTexture1.colorSpace = THREE.SRGBColorSpace;
      
      updateCanvas1Text(); // Initialen Text setzen

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
      context2 = canvas2.getContext('2d'); // KEINE lokale Variable!
      context2.scale(ratio2, ratio2);

      textTexture2 = new THREE.CanvasTexture(canvas2); // KEINE lokale Variable!
      textTexture2.colorSpace = THREE.SRGBColorSpace;
      
      updateCanvas2Text(); // Initialen Text setzen

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
      context3 = canvas3.getContext('2d'); // KEINE lokale Variable!
      context3.scale(ratio3, ratio3);

      textTexture3 = new THREE.CanvasTexture(canvas3); // KEINE lokale Variable!
      textTexture3.colorSpace = THREE.SRGBColorSpace;
      
      updateCanvas3Text(); // Initialen Text setzen

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
      context4 = canvas4.getContext('2d'); // KEINE lokale Variable!
      context4.scale(ratio4, ratio4);

      textTexture4 = new THREE.CanvasTexture(canvas4); // KEINE lokale Variable!
      textTexture4.colorSpace = THREE.SRGBColorSpace;
      
      updateCanvas4Text(); // Initialen Text setzen

      const textMaterial4 = new THREE.MeshBasicMaterial({ 
        map: textTexture4, 
        transparent: true,
        alphaTest: 0.01 // Füge alphaTest hinzu
      });
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
      context5 = canvas5.getContext('2d'); // KEINE lokale Variable!
      context5.scale(ratio5, ratio5);

      textTexture5 = new THREE.CanvasTexture(canvas5); // KEINE lokale Variable!
      textTexture5.colorSpace = THREE.SRGBColorSpace;
      
      updateCanvas5Text(); // Initialen Text setzen

      const textMaterial5 = new THREE.MeshBasicMaterial({ 
        map: textTexture5, 
        transparent: true,
        alphaTest: 0.01 // Füge alphaTest hinzu
      });
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
      coverGroup1.userData.project = 'earthquake'; // Oben links: game statt iceAgeMammals
      
      const coverGroup2 = createCoverGroup(cover2, hover2,  3, -0.65, -5.5, 1.2,  3);
      coverGroup2.userData.project = 'migrants'; // Oben rechts: earthquake statt hybridWallet
      
      const coverGroup3 = createCoverGroup(cover1, hover1, -3,  0.65, -5.5, -1.2, -3);
      coverGroup3.userData.project = 'game'; // Unten links: karincruises statt nass
      
      const coverGroup4 = createCoverGroup(cover4, hover4, -3, -0.65, -5.5, -1.2, -3);
      coverGroup4.userData.project = 'karincruises'; // Unten rechts: migrants statt bwegt

      scene.add(coverGroup1);
      scene.add(coverGroup2);
      scene.add(coverGroup3);
      scene.add(coverGroup4);

      coverGroups.push(coverGroup1, coverGroup2, coverGroup3, coverGroup4);

      // --------------------------------------------------------
    // 4) WEITERE BILDER (z. B. Earthquake, Nass1, Bwegt1)
    // Verwende den bereits existierenden textureLoader statt ihn neu zu deklarieren
    // const textureLoader = new THREE.TextureLoader(); <- Diese Zeile entfernen!

    // Prüfe die aktuelle Gerätegröße
    checkDeviceSize();
    
    // Wähle die richtigen Pfade basierend auf Gerätegröße
    const texturePaths = isMobile ? 
      {
        bild1: '/mobile/Bild1-mobile.png',
        bild2: '/mobile/Bild2-mobile.png',
        bild3: '/mobile/Bild3-mobile.png',
        bild4: '/mobile/Bild4-mobile.png'
      } : 
      {
        bild1: '/Bild1.png',
        bild2: '/Bild2.png',
        bild3: '/Bild3.png',
        bild4: '/Bild4.png'
      };
    
    // Lade die initialen Texturen
    const pngTexture1 = textureLoader.load(texturePaths.bild1);
    pngTexture1.colorSpace = THREE.SRGBColorSpace;
    currentTextures.bild1 = pngTexture1;
    
    const pngTexture2 = textureLoader.load(texturePaths.bild2);
    pngTexture2.colorSpace = THREE.SRGBColorSpace;
    currentTextures.bild2 = pngTexture2;
    
    const pngTexture3 = textureLoader.load(texturePaths.bild3);
    pngTexture3.colorSpace = THREE.SRGBColorSpace;
    currentTextures.bild3 = pngTexture3;
    
    const pngTexture4 = textureLoader.load(texturePaths.bild4);
    pngTexture4.colorSpace = THREE.SRGBColorSpace;
    currentTextures.bild4 = pngTexture4;
    
    // Erstelle die Mesh-Objekte mit der entsprechenden Geometrie je nach Gerätegröße
    const aspectRatio = isMobile ? 9/16 : 3/2;
    const width = isMobile ? 2 : 3;
    const height = isMobile ? 2 * (16/9) : 2;  // 9:16 Verhältnis für Mobile

    const pngGeometry1 = new THREE.PlaneGeometry(width, height);
    const pngMaterial1 = new THREE.MeshBasicMaterial({
      map: pngTexture1,
      transparent: true,
      toneMapped: false
    });
    const pngMesh1 = new THREE.Mesh(pngGeometry1, pngMaterial1);
    pngMesh1.position.set(-3, 0, 15);
    pngMesh1.userData.finalX = 0;
    pngMesh1.userData.offscreenX = -3;
    pngMesh1.userData.project = 'nass'; // Nass-Projekt
    scene.add(pngMesh1);
    imageMeshes.push(pngMesh1);
    
    const pngGeometry2 = new THREE.PlaneGeometry(3, 2);
    const pngMaterial2 = new THREE.MeshBasicMaterial({ 
      map: pngTexture2, 
      transparent: true 
    });
    const pngMesh2 = new THREE.Mesh(pngGeometry2, pngMaterial2);
    pngMesh2.position.set(3, 0, 11.5);
    pngMesh2.userData.finalX = 0;
    pngMesh2.userData.offscreenX = 3;
    pngMesh2.userData.project = 'bwegt'; // Bwegt-Projekt
    scene.add(pngMesh2);
    imageMeshes.push(pngMesh2);
    
    const pngGeometry3 = new THREE.PlaneGeometry(3, 2);
    const pngMaterial3 = new THREE.MeshBasicMaterial({ 
      map: currentTextures.bild3, 
      transparent: true 
    });
    const pngMesh3 = new THREE.Mesh(pngGeometry3, pngMaterial3);
    pngMesh3.position.set(-3, 0, 8);
    pngMesh3.userData.finalX = 0;
    pngMesh3.userData.offscreenX = -3;
    pngMesh3.userData.project = 'iceAgeMammals'; // IceAgeMammals-Projekt
    scene.add(pngMesh3);
    imageMeshes.push(pngMesh3);

    const pngGeometry4 = new THREE.PlaneGeometry(3, 2);
    const pngMaterial4 = new THREE.MeshBasicMaterial({ 
      map: currentTextures.bild4, 
      transparent: true 
    });
    const pngMesh4 = new THREE.Mesh(pngGeometry4, pngMaterial4);
    pngMesh4.position.set(3, 0, 4);
    pngMesh4.userData.finalX = 0;
    pngMesh4.userData.offscreenX = 3;
    pngMesh4.userData.project = 'hybridWallet'; // HybridWallet-Projekt
    scene.add(pngMesh4);
    imageMeshes.push(pngMesh4);


    if (isMobile) {
  pngMesh1.scale.set(0.55, 0.55, 0.55);
  pngMesh2.scale.set(0.55, 0.55, 0.55);
  pngMesh3.scale.set(0.55, 0.55, 0.55);
  pngMesh4.scale.set(0.55, 0.55, 0.55);

}
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



      const pngTextureFoto = textureLoader.load('/foto-cover.png');
      pngTextureFoto.colorSpace = THREE.SRGBColorSpace;
      const pngGeometryFoto = new THREE.PlaneGeometry(3, 2);
      const pngMaterialFoto = new THREE.MeshBasicMaterial({ 
        map: pngTextureFoto, 
        transparent: true,
        alphaTest: 0.01 // Diese Zeile hinzufügen
      });
      const pngMeshFoto = new THREE.Mesh(pngGeometryFoto, pngMaterialFoto);
      pngMeshFoto.position.set(3, 0, -22.5);
      pngMeshFoto.userData.finalX = 0;
      pngMeshFoto.userData.offscreenX = 3;
      pngMeshFoto.userData.project = 'photovideo'; // Dieser Eintrag ist neu
      scene.add(pngMeshFoto);
      imageMeshes.push(pngMeshFoto);

      const pngTextureMe = textureLoader.load('/photo-video.png');
      pngTextureMe.colorSpace = THREE.SRGBColorSpace;
      const pngGeometryMe = new THREE.PlaneGeometry(3, 2);
      const pngMaterialMe = new THREE.MeshBasicMaterial({ 
        map: pngTextureMe, 
        transparent: true,
        alphaTest: 0.01 // Diese Zeile hinzufügen
      });
      const pngMeshMe = new THREE.Mesh(pngGeometryMe, pngMaterialMe);
      pngMeshMe.position.set(3, 0, -33);
      pngMeshMe.userData.finalX = 0;
      pngMeshMe.userData.offscreenX = 3;
      pngMeshMe.userData.project = 'aboutme'; // Dieser Eintrag ist neu
      scene.add(pngMeshMe);
      imageMeshes.push(pngMeshMe);
      
      // Partikelsystem initialisieren
      particleSystem = new ParticleSystem(THREE, scene, {
        particleCount: isMobileDevice() ? 1000 : 2000, // Weniger Partikel auf Mobilgeräten
        particleColor: 0x333344,
        particleSize: 0.3,
        particleOpacity: 0.6
      });
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
    const projectName = clickedObj.userData.parentGroup ? 
                        clickedObj.userData.parentGroup.userData.project : 
                        clickedObj.userData.project;
    
    // Aktualisierte Projekt-Zuordnungen mit den zwei neuen Projekten
    if (projectName === 'nass') {
      openNassProject();
    } else if (projectName === 'bwegt') {
      openBwegtProject();
    } else if (projectName === 'game') {
      openGameProject();
    } else if (projectName === 'earthquake') {
      openEarthquakeProject();
    } else if (projectName === 'karincruises') {
      openKarinCruisesProject();
    } else if (projectName === 'migrants') {
      openMigrantsProject();
    } else if (projectName === 'iceAgeMammals') {
      openIceAgeMammalsProject();
    } else if (projectName === 'hybridWallet') {
      openHybridWalletProject();
    } else if (projectName === 'photovideo') {
      openPhotoVideoProject();
    } else if (projectName === 'aboutme') {
      openAboutMeProject();
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

function openIceAgeMammalsProject() {
  const { x, y, z } = camera.position;
  goto(`/project/iceAgeMammals?cx=${x}&cy=${y}&cz=${z}`);
}

function openHybridWalletProject() {
  const { x, y, z } = camera.position;
  goto(`/project/hybridWallet?cx=${x}&cy=${y}&cz=${z}`);
}

function openGameProject() {
  const { x, y, z } = camera.position;
  goto(`/project/game?cx=${x}&cy=${y}&cz=${z}`);
}

function openEarthquakeProject() {
  const { x, y, z } = camera.position;
  goto(`/project/earthquake?cx=${x}&cy=${y}&cz=${z}`);
}

function openKarinCruisesProject() {
  const { x, y, z } = camera.position;
  goto(`/project/karincruises?cx=${x}&cy=${y}&cz=${z}`);
}

function openMigrantsProject() {
  const { x, y, z } = camera.position;
  goto(`/project/migrants?cx=${x}&cy=${y}&cz=${z}`);
}

function openPhotoVideoProject() {
  const { x, y, z } = camera.position;
  goto(`/project/photovideo?cx=${x}&cy=${y}&cz=${z}`);
}

function openAboutMeProject() {
  const { x, y, z } = camera.position;
  goto(`/project/aboutme?cx=${x}&cy=${y}&cz=${z}`);
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
      
      // Schatten-Eigenschaften für besseren Kontrast
      context.shadowColor = "rgba(0, 0, 0, 0.6)";
      context.shadowBlur = 8;
      context.shadowOffsetX = 1;
      context.shadowOffsetY = 1;
      
      context.fillStyle = "white";
      // Rest der Funktion bleibt unverändert...
      
      const lines = [
         greetings[currentGreetingIndex],
         "i'm",
         "Franz.",
         "",
         "a product-design student passionated",
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
      
      // Am Ende die Shadow-Eigenschaft zurücksetzen
      context.shadowColor = "transparent";
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
  // Klickbare Objekte: sowohl Cover-Gruppen als auch einzelne Bilder
  const clickableObjects = [
    ...coverGroups.map(group => group.userData.defaultMesh),
    ...imageMeshes
  ];
  const intersects = raycaster.intersectObjects(clickableObjects, false);

  // Hier den Cursor setzen:
  if (intersects.length > 0) {
    const projectName = intersects[0].object.userData.parentGroup ? 
                        intersects[0].object.userData.parentGroup.userData.project : 
                        intersects[0].object.userData.project;
    
    // Alle Projekttypen einschließlich der neuen
    if (['nass', 'bwegt', 'iceAgeMammals', 'hybridWallet', 
          'game', 'earthquake', 'karincruises', 'migrants',
          'photovideo', 'aboutme'].includes(projectName)) {
      container.style.cursor = 'pointer';
    } else {
      container.style.cursor = 'default';
    }
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
  updateCurrentSection();
  updateTitleOpacitiesAndStartTyping(); // Neue Funktion hinzufügen
  if (particleSystem) {
    particleSystem.animate();
  }
  renderer.render(scene, camera);
}

   // ----------------------------------------------------------------------------
   // onWindowResize: Anpassen von Kamera und Renderer
   // ----------------------------------------------------------------------------
   function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Textmesh-Größen anpassen
  adjustTextMeshSizes();
  
  // Canvas-Texturen aktualisieren
  recreateCanvasTextures();
  
  // Prüfe auf Änderungen der Bildschirmgröße und lade ggf. andere Texturen
  checkDeviceSize();
}

// Neue Funktion zur Anpassung der TextMesh-Größen
function adjustTextMeshSizes() {
  // Basis-Skalierung
  const baseScale = 0.6;
  
  // Breakpoints definieren
  let scale = baseScale;
  if (window.innerWidth <= 768) {
    // Mobile Geräte
    scale = baseScale * 0.8;
  } else if (window.innerWidth <= 1024) {
    // Tablets
    scale = baseScale * 0.9;
  }
  
  // Alle TextMeshes im Scene-Graph finden und anpassen
  scene.traverse((object) => {
    // Suche nach den TextMesh-Objekten
    if (object.isMesh && object.material && object.material.map && 
        (object.material.map === textTexture1 || 
         object.material.map === textTexture2 ||
         object.material.map === textTexture3 ||
         object.material.map === textTexture4 ||
         object.material.map === textTexture5)) {
      
      // Passe die Skalierung an
      object.scale.set(scale, scale, scale);
    }
  });
}

// Funktion zum Neuerstellen der Canvas-Texturen bei Größenänderung
function recreateCanvasTextures() {
  // Alle Canvas-Texturen neu erstellen mit angepassten Größen
  updateCanvas1Text();
  updateCanvas2Text();
  updateCanvas3Text();
  updateCanvas4Text();
  updateCanvas5Text();
}

// Hilfsfunktion zur Berechnung responsiver Größen
// Füge diese Funktion im Script-Bereich hinzu
function getResponsiveSize(baseSize) {
  // Basis-Breite für die Referenzgrößen
  const baseWidth = 1920;
  // Minimal erlaubte Größe (verhindert zu kleine Texte)
  const minScale = 0.7;
  
  let scale = Math.max(window.innerWidth / baseWidth, minScale);
  return Math.floor(baseSize * scale);
}

   // Füge diese Funktion im Script-Teil hinzu:
let previousStation = -1;

function updateTitleOpacitiesAndStartTyping() {
  // Mapping der Kamerastationen zu den zugehörigen Titel-Indizes
  const stationToTitleMap = [
    { station: 1, titleIndex: 0 },  // Design Work
    { station: 6, titleIndex: 1 },  // Code & Data
    { station: 8, titleIndex: 2 },  // Website Projects
    { station: 10, titleIndex: 3 }, // Photo & Video
    { station: 12, titleIndex: 4 }  // About me
  ];

  // Findet den aktuell aktiven Titelindex basierend auf der Station
  const activeMatch = stationToTitleMap.find(item => item.station === currentStation);
  const activeIndex = activeMatch ? activeMatch.titleIndex : -1;
  
  // Aktualisiere alle Title-Opacities
  for (let i = 0; i < titleOpacities.length; i++) {
    titleOpacities[i] = (i === activeIndex) ? 1.0 : 0.4;
  }
  
  // Stationswechsel erkennen
  if (previousStation !== currentStation) {
    // Station wurde gewechselt, jetzt:
    console.log(`Station gewechselt: ${previousStation} -> ${currentStation}`);
    
    // 1. Alten Typewriter stoppen
    typingInProgress = false;
    
    // 2. Alle vorherigen Untertitel ausblenden
    const prevMatch = stationToTitleMap.find(item => item.station === previousStation);
    if (prevMatch) {
      const prevIndex = prevMatch.titleIndex;
      // Sofort ausblenden ohne Animation
      subtitleOpacities[prevIndex] = 0;
      // Sofort den Fortschritt zurücksetzen
      subtitleProgress[prevIndex] = 0;
    }
    
    // 3. Wenn eine aktive Station vorhanden ist
    if (activeIndex >= 0) {
      // Sofort einblenden ohne Animation
      subtitleOpacities[activeIndex] = 1;
      // Sofort den Fortschritt zurücksetzen
      subtitleProgress[activeIndex] = 0;
      
      // Mit leichter Verzögerung den Typewriter starten
      setTimeout(() => {
        if (currentStation === stationToTitleMap.find(item => item.titleIndex === activeIndex)?.station) {
          startTypewriterEffect(activeIndex);
        }
      }, 300);
    }
    
    // Aktualisiere die vorherige Station
    previousStation = currentStation;
  } 
  // Wenn keine Station gewechselt wurde, aber der Text noch nicht gestartet ist
  else if (activeIndex >= 0 && subtitleProgress[activeIndex] === 0 && !typingInProgress) {
    startTypewriterEffect(activeIndex);
  }
  
  // Immer alle Canvas-Texte aktualisieren
  updateCanvas1Text();
  updateCanvas2Text();
  updateCanvas3Text();
  updateCanvas4Text();
  updateCanvas5Text();
}

// Die fadeIn/fadeOut Funktionen können wir entfernen oder vereinfacht lassen:
function fadeInSubtitle(index) {
  subtitleOpacities[index] = 1;
}

function fadeOutSubtitle(index) {
  subtitleOpacities[index] = 0;
  subtitleProgress[index] = 0;
}

// Füge diese Typewriter-Funktionen hinzu:
function startTypewriterEffect(sectionIndex) {
  typingInProgress = true;
  
  // Berechne die Gesamtlänge des zu schreibenden Textes
  const totalLength = subtitleTexts[sectionIndex].reduce((sum, text) => sum + text.length, 0);
  
  // Setze den Fortschritt zurück
  subtitleProgress[sectionIndex] = 0;
  
  // Starte das Typing
  typeNextCharacter(sectionIndex, totalLength);
}

function typeNextCharacter(sectionIndex, totalLength) {
  if (subtitleProgress[sectionIndex] < totalLength) {
    subtitleProgress[sectionIndex]++;
    
    // Aktualisiere den entsprechenden Canvas
    switch(sectionIndex) {
      case 0: updateCanvas1Text(); break;
      case 1: updateCanvas2Text(); break;
      case 2: updateCanvas3Text(); break;
      case 3: updateCanvas4Text(); break;
      case 4: updateCanvas5Text(); break;
    }
    
    // Zufällige Verzögerung für realistischeren Typewriter-Effekt
    const delay = 20 + Math.random() * 30;
    setTimeout(() => typeNextCharacter(sectionIndex, totalLength), delay);
  } else {
    typingInProgress = false;
  }
}

// 2. Die updateCanvas-Funktionen aus initScene() nach außen verschieben:
function updateCanvas1Text() {
  context1.clearRect(0, 0, 1024, 512);
  context1.fillStyle = "rgba(0,0,0,0)";
  context1.fillRect(0, 0, 1024, 512);
  context1.textAlign = "left"; // Auf "center" ändern
  context1.textBaseline = "middle";
  
  // Schatten-Eigenschaften für Titel
  context1.shadowColor = "rgba(0, 0, 0, 0.5)";
  context1.shadowBlur = 5;
  context1.shadowOffsetX = 1;
  context1.shadowOffsetY = 1;
  
  // Hauptüberschrift mit dynamischer Opacity
  const titleFontSize = getResponsiveSize(42);
  const subtitleFontSize = getResponsiveSize(24);
  context1.fillStyle = `rgba(255,255,255,${titleOpacities[0]})`;
  context1.font = `${titleFontSize}px 'IBM Plex Mono'`;
  
  // Horizontale Position in die Mitte des Canvas setzen
  const centerX = 1024 / 4.5;
  // Vertikale Position anpassen
  const centerY = 512 / 1.25;
  
  // Text zentriert zeichnen
  context1.fillText("Design Work", centerX, centerY - 50);
  
  // Untertext mit Typewriter-Effekt UND Opacity
  context1.fillStyle = `rgba(255,255,255,${subtitleOpacities[0]})`;
  context1.font = `${subtitleFontSize}px 'IBM Plex Mono'`;
  
  const subtitle1 = subtitleTexts[0][0].substring(0, subtitleProgress[0]);
  context1.fillText(subtitle1, centerX, centerY);
  
  if (subtitleProgress[0] >= subtitleTexts[0][0].length) {
    const subtitle2 = subtitleTexts[0][1].substring(0, subtitleProgress[0] - subtitleTexts[0][0].length);
    context1.fillText(subtitle2, centerX, centerY + 35);
  }
  
  // Zurücksetzen des Schattens
  context1.shadowColor = "transparent";
  
  textTexture1.needsUpdate = true;
}

function updateCanvas2Text() {
  context2.clearRect(0, 0, 1024, 512);
  context2.fillStyle = "rgba(0,0,0,0)";
  context2.fillRect(0, 0, 1024, 512);
  context2.textAlign = "left"; // Auf "center" ändern
  context2.textBaseline = "middle";
  
  // Schatten-Eigenschaften für Titel
  context2.shadowColor = "rgba(0, 0, 0, 0.5)";
  context2.shadowBlur = 5;
  context2.shadowOffsetX = 1;
  context2.shadowOffsetY = 1;
  
  // Hauptüberschrift mit dynamischer Opacity
  const titleFontSize = getResponsiveSize(42);
  const subtitleFontSize = getResponsiveSize(24);
  context2.fillStyle = `rgba(255,255,255,${titleOpacities[1]})`;
  context2.font = `${titleFontSize}px 'IBM Plex Mono'`;
  const centerX = 1024 / 4.5;
  const centerY = 512 / 1.25;
  context2.fillText("Code & Data", centerX, centerY - 50);
  
  // Untertext mit Typewriter-Effekt UND Opacity
  context2.fillStyle = `rgba(255,255,255,${subtitleOpacities[1]})`;
  context2.font = `${subtitleFontSize}px 'IBM Plex Mono'`;
  
  const subtitle1 = subtitleTexts[1][0].substring(0, subtitleProgress[1]);
  context2.fillText(subtitle1, centerX, centerY);
  
  if (subtitleProgress[1] >= subtitleTexts[1][0].length) {
    const subtitle2 = subtitleTexts[1][1].substring(0, subtitleProgress[1] - subtitleTexts[1][0].length);
    context2.fillText(subtitle2, centerX, centerY + 35);
  }
  
  // Zurücksetzen des Schattens
  context2.shadowColor = "transparent";
  
  textTexture2.needsUpdate = true;
}

function updateCanvas3Text() {
  context3.clearRect(0, 0, 1024, 512);
  context3.fillStyle = "rgba(0,0,0,0)";
  context3.fillRect(0, 0, 1024, 512);
  context3.textAlign = "left"; // Auf "center" ändern
  context3.textBaseline = "middle";
  
  // Schatten-Eigenschaften für Titel
  context3.shadowColor = "rgba(0, 0, 0, 0.5)";
  context3.shadowBlur = 5;
  context3.shadowOffsetX = 1;
  context3.shadowOffsetY = 1;
  
  // Hauptüberschrift mit dynamischer Opacity
  const titleFontSize = getResponsiveSize(42);
  const subtitleFontSize = getResponsiveSize(24);
  context3.fillStyle = `rgba(255,255,255,${titleOpacities[2]})`;
  context3.font = `${titleFontSize}px 'IBM Plex Mono'`;
  const centerX = 1024 / 4.5;
  const centerY = 512 / 1.25;
  context3.fillText("Website Projects", centerX, centerY - 50);
  
  // Untertext mit Typewriter-Effekt UND Opacity
  context3.fillStyle = `rgba(255,255,255,${subtitleOpacities[2]})`;
  context3.font = `${subtitleFontSize}px 'IBM Plex Mono'`;
  
  const subtitle1 = subtitleTexts[2][0].substring(0, subtitleProgress[2]);
  context3.fillText(subtitle1, centerX, centerY);
  
  if (subtitleProgress[2] >= subtitleTexts[2][0].length) {
    const subtitle2 = subtitleTexts[2][1].substring(0, subtitleProgress[2] - subtitleTexts[2][0].length);
    context3.fillText(subtitle2, centerX, centerY + 35);
  }
  
  // Zurücksetzen des Schattens
  context3.shadowColor = "transparent";
  
  textTexture3.needsUpdate = true;
}

function updateCanvas4Text() {
  context4.clearRect(0, 0, 1024, 512);
  context4.fillStyle = "rgba(0,0,0,0)"; // Stellt sicher, dass es 100% transparent ist
  context4.fillRect(0, 0, 1024, 512);
  context4.textAlign = "left"; // Auf "center" ändern
  context4.textBaseline = "middle";
  
  // Schatten-Eigenschaften für Titel
  context4.shadowColor = "rgba(0, 0, 0, 0.5)";
  context4.shadowBlur = 5;
  context4.shadowOffsetX = 1;
  context4.shadowOffsetY = 1;
  
  // Hauptüberschrift mit dynamischer Opacity
  const titleFontSize = getResponsiveSize(42);
  const subtitleFontSize = getResponsiveSize(24);
  context4.fillStyle = `rgba(255,255,255,${titleOpacities[3]})`;
  context4.font = `${titleFontSize}px 'IBM Plex Mono'`;
  const centerX = 1024 / 4.5;
  const centerY = 512 / 1.25;
  context4.fillText("Photo & Video", centerX, centerY - 50);
  
  // Untertext mit Typewriter-Effekt UND Opacity
  context4.fillStyle = `rgba(255,255,255,${subtitleOpacities[3]})`;
  context4.font = `${subtitleFontSize}px 'IBM Plex Mono'`;
  
  const subtitle1 = subtitleTexts[3][0].substring(0, subtitleProgress[3]);
  context4.fillText(subtitle1, centerX, centerY);
  
  if (subtitleProgress[3] >= subtitleTexts[3][0].length) {
    const subtitle2 = subtitleTexts[3][1].substring(0, subtitleProgress[3] - subtitleTexts[3][0].length);
    context4.fillText(subtitle2, centerX, centerY + 35);
    
    if (subtitleProgress[3] >= subtitleTexts[3][0].length + subtitleTexts[3][1].length) {
      const subtitle3 = subtitleTexts[3][2].substring(0, subtitleProgress[3] - subtitleTexts[3][0].length - subtitleTexts[3][1].length);
      context4.fillText(subtitle3, centerX, centerY + 70);
    }
  }
  
  // Zurücksetzen des Schattens
  context4.shadowColor = "transparent";
  
  textTexture4.needsUpdate = true;
}

function updateCanvas5Text() {
  context5.clearRect(0, 0, 1024, 512);
  context5.fillStyle = "rgba(0,0,0,0)"; // Stellt sicher, dass es 100% transparent ist
  context5.fillRect(0, 0, 1024, 512);
  context5.textAlign = "left"; // Auf "center" ändern
  context5.textBaseline = "middle";
  
  // Schatten-Eigenschaften für Titel
  context5.shadowColor = "rgba(0, 0, 0, 0.5)";
  context5.shadowBlur = 5;
  context5.shadowOffsetX = 1;
  context5.shadowOffsetY = 1;
  
  // Hauptüberschrift mit dynamischer Opacity
  const titleFontSize = getResponsiveSize(42);
  const subtitleFontSize = getResponsiveSize(24);
  context5.fillStyle = `rgba(255,255,255,${titleOpacities[4]})`;
  context5.font = `${titleFontSize}px 'IBM Plex Mono'`;
  const centerX = 1024 / 4.5;
  const centerY = 512 / 1.25;
  context5.fillText("About me", centerX, centerY - 50);
  
  // Untertext mit Typewriter-Effekt UND Opacity
  context5.fillStyle = `rgba(255,255,255,${subtitleOpacities[4]})`;
  context5.font = `${subtitleFontSize}px 'IBM Plex Mono'`;
  
  const subtitle1 = subtitleTexts[4][0].substring(0, subtitleProgress[4]);
  context5.fillText(subtitle1, centerX, centerY);
  
  if (subtitleProgress[4] >= subtitleTexts[4][0].length) {
    const subtitle2 = subtitleTexts[4][1].substring(0, subtitleProgress[4] - subtitleTexts[4][0].length);
    context5.fillText(subtitle2, centerX, centerY + 35);
  }
  
  // Zurücksetzen des Schattens
  context5.shadowColor = "transparent";
  
  textTexture5.needsUpdate = true;
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
