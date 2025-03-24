<script>
    // Füge den Import für IntroText hinzu
    import { IntroText } from '$lib/meshes/IntroText.js';
    // Bestehende Imports...
    import { onMount, onDestroy } from 'svelte';
    import { gsap } from 'gsap'; 
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { ProjectMeshFactory } from '$lib/meshes/ProjectMeshFactory.js';
    import { CoverGroupFactory } from '$lib/meshes/CoverGroupFactory.js';
    import { ParticleSystem } from '$lib/effects/ParticleSystem.js';
    import { Typewriter } from '$lib/meshes/Typewriter.js';
    import { ImageUpdater } from '$lib/meshes/ImageUpdater.js';
    import { CanvasClickHandler } from '$lib/interactions/HandleCanvasClick.js';

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

    // Array für alle "nicht-Cover" Bilder (z.B. Earthquake, Nass1, Bwegt1 usw.)
    let imageMeshes = [];

    // Für die Cover nutzen wir Gruppen (jede Gruppe enthält zwei Meshes)
    let coverGroups = [];

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

    // Typewriter-Instanz erstellen
    let typewriter;

    // Neue Variable für IntroText-Instanz
    let introText;

    // CanvasClickHandler-Instanz
    let clickHandler;

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
        // Prüfe explizit die Größe vor der Initialisierung
        checkDeviceSize();
        console.log("Stage: isMobile vor IntroText-Erstellung:", isMobile);
        
        // Rest der Initialisierung
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

        // Typewriter und IntroText initialisieren
        typewriter = new Typewriter();
        introText = new IntroText(THREE);
        
        // Explizit den korrekten Status setzen und erzwingen
        console.log("Stage: isMobile wird an IntroText übergeben:", isMobile);
        introText.isMobile = isMobile; // Direkte Zuweisung
        introText.createMesh(scene);
        introText.startUpdateInterval(2000);
        introText.setMobileMode(isMobile); // Sollte die Methode aufrufen
        
        // Direkt nach der Erstellung aktualisieren
        introText.updateCanvasText();

        // CanvasClickHandler initialisieren (nach initScene)
        clickHandler = new CanvasClickHandler(THREE, {
          camera: camera,
          navigateToProject: (projectName, cameraPosition) => {
            // Diese Funktion leitet zu den entsprechenden Projekten weiter
            const { x, y, z } = cameraPosition;
            goto(`/project/${projectName}?cx=${x}&cy=${y}&cz=${z}`);
          },
          gsap: gsap // GSAP-Instanz übergeben
        });

        animate();

        // Nur auf der Hauptseite den Wheel-Listener hinzufügen
        if (isMainPage) {
          addWheelListener();
        }
        
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('mousemove', onMouseMove, false);

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

      // IntroText bereinigen
      if (introText) {
        introText.dispose();
      }

      // Beim Zerstören der Komponente, stelle sicher, dass Overflow wieder aktiviert wird
      if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
      }
    });

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
          deltaY: -touchDiff, // Hier ist das Vorzeichen umgekehrt (-touchDiff statt touchDiff)
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
      bild4: null,
      fotoCover: null // Neue Zeile
    };
    
    // Diese Funktion zum Überprüfen der Gerätegröße
    function checkDeviceSize() {
      const wasAlreadyMobile = isMobile;
      isMobile = window.innerWidth <= 768;
      
      // Wenn sich der Status geändert hat, führe Anpassungen durch
      if (wasAlreadyMobile !== isMobile && scene) {
        console.log(`Gerätestatus geändert: ${wasAlreadyMobile ? 'Desktop' : 'Mobile'} -> ${isMobile ? 'Mobile' : 'Desktop'}`);
        
        // Texturen neu laden
        loadAppropriateTextures();
        
        // TextMeshes anpassen
        adjustTextMeshSizes();
        
        // Canvas-Texturen aktualisieren
        recreateCanvasTextures();
        
        // Neuen mobilen Status an IntroText übergeben
        if (introText) {
          introText.setMobileMode(isMobile);
        }
      }
    }

    // Verbesserte Version der loadAppropriateTextures-Funktion:
function loadAppropriateTextures() {
  if (!THREE || !scene) return;
  
  console.log("Mobile Status:", isMobile);
  
  // HIER HINZUFÜGEN: Prüfung ob Meshes überhaupt existieren
  if (!imageMeshes.length) {
    console.log("imageMeshes ist noch leer - warte auf Erstellung der Meshes");
    return; // Frühzeitig beenden, wenn keine Meshes existieren
  }
  
  console.log("Verfügbare Meshes:", imageMeshes.map(m => m.userData.project));
  
  const textureLoader = new THREE.TextureLoader();
  const texturePaths = {
    desktop: {
      bild1: '/Bild2.png',
      bild2: '/Bild1.png',
      bild3: '/Bild3.png',
      bild4: '/Bild4.png',
      fotoCover: '/foto-cover.png'  // Neue Zeile
    },
    mobile: {
      bild1: '/mobile/Bild1-mobile.png',
      bild2: '/mobile/Bild2-mobile.png',
      bild3: '/mobile/Bild3-mobile.png',
      bild4: '/mobile/Bild4-mobile.png',
      fotoCover: '/mobile/Bild5.png'  // Neue Zeile
    }
  };
  
  // Wähle die richtigen Pfade
  const paths = isMobile ? texturePaths.mobile : texturePaths.desktop;
  
  // Direkter Index-Zugriff statt findIndex (erste 4 Elemente in der imageMeshes-Array sind die 4 Hauptbilder)
  const meshAssignments = [
    { meshIndex: 0, texture: 'bild1', project: 'nass' },
    { meshIndex: 1, texture: 'bild2', project: 'bwegt' },
    { meshIndex: 2, texture: 'bild3', project: 'iceAgeMammals' },
    { meshIndex: 3, texture: 'bild4', project: 'hybridWallet' },
    { meshIndex: 6, texture: 'fotoCover', project: 'photovideo' } // Neue Zeile
  ];
  
  meshAssignments.forEach(({ meshIndex, texture, project }) => {
    if (meshIndex >= 0 && meshIndex < imageMeshes.length) {
      const mesh = imageMeshes[meshIndex];
      console.log(`Lade Textur für Mesh ${meshIndex}, Projekt: ${project}, Pfad: ${paths[texture]}`);
      
      // Rest des Codes wie vorher, Textur laden und anwenden
      textureLoader.load(paths[texture], 
        // Success callback
        newTexture => {
          console.log(`Textur erfolgreich geladen: ${paths[texture]}`);
          newTexture.colorSpace = THREE.SRGBColorSpace;
          
          if (isMobile) {
            // Mobile Anpassungen...
          } else {
            // Desktop Anpassungen...
          }
          
          // Speichere die aktuelle Textur
          currentTextures[texture] = newTexture;
        },
        // Progress callback
        undefined,
        // Error callback
        error => {
          console.error(`Fehler beim Laden der Textur ${paths[texture]}:`, error);
        }
      );
    } else {
      console.warn(`Mesh mit Index ${meshIndex} für Projekt ${project} nicht gefunden!`);
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
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      // Tone Mapping & Farbraum
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      // Für mobile Geräte: Reduziere die Render-Qualität für bessere Performance
      if (isMobileDevice()) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      } else {
        renderer.setPixelRatio(window.devicePixelRatio);
      }

      // --------------------------------------------------------
      // Flur-Linien
      // const points = [
      //   new THREE.Vector3(-10, -5, 20),
      //   new THREE.Vector3(-5, -2.5, -50),
      //   new THREE.Vector3(10, -5, 20),
      //   new THREE.Vector3(5, -2.5, -50),
      //   new THREE.Vector3(-5, 2.5, -50),
      //   new THREE.Vector3(5, 2.5, -50),
      //   new THREE.Vector3(-5, -2.5, -50),
      //   new THREE.Vector3(5, -2.5, -50),
      //   new THREE.Vector3(-5, 2.5, -50),
      //   new THREE.Vector3(-5, -2.5, -50),
      //   new THREE.Vector3(5, 2.5, -50),
      //   new THREE.Vector3(5, -2.5, -50)
      // ];
      // const corridorGeometry = new THREE.BufferGeometry().setFromPoints(points);
      // const corridorMaterial = new THREE.LineBasicMaterial({ color: 0x707070 });
      // corridorLines = new THREE.LineSegments(corridorGeometry, corridorMaterial);
      // scene.add(corridorLines);

      // Rückwand
      const backWallGeo = new THREE.PlaneGeometry(10, 5);
      const backWallMat = new THREE.MeshBasicMaterial({ color: 0x010300 });
      backWall = new THREE.Mesh(backWallGeo, backWallMat);
      backWall.position.set(0, 0, -40);
      scene.add(backWall);


      // Factories initialisieren
      projectMeshFactory = new ProjectMeshFactory(scene, isMobile);
      coverGroupFactory = new CoverGroupFactory(scene, isMobile);


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

      // Bessere Filter-Einstellungen für Text
      textTexture1.magFilter = THREE.NearestFilter; // Schärferes Rendering bei Vergrößerung
      textTexture1.minFilter = THREE.LinearFilter; // Glättung bei Verkleinerung
      textTexture1.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Maximale Anisotropie

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

            // Bessere Filter-Einstellungen für Text
      textTexture2.magFilter = THREE.NearestFilter; // Schärferes Rendering bei Vergrößerung
      textTexture2.minFilter = THREE.LinearFilter; // Glättung bei Verkleinerung
      textTexture2.anisotropy = renderer.capabilities.getMaxAnisotropy();

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

            // Bessere Filter-Einstellungen für Text
            textTexture3.magFilter = THREE.NearestFilter; // Schärferes Rendering bei Vergrößerung
      textTexture3.minFilter = THREE.LinearFilter; // Glättung bei Verkleinerung
      textTexture3.anisotropy = renderer.capabilities.getMaxAnisotropy();




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

            // Bessere Filter-Einstellungen für Text
            textTexture4.magFilter = THREE.NearestFilter; // Schärferes Rendering bei Vergrößerung
      textTexture4.minFilter = THREE.LinearFilter; // Glättung bei Verkleinerung
      textTexture4.anisotropy = renderer.capabilities.getMaxAnisotropy();





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

            // Bessere Filter-Einstellungen für Text
            textTexture5.magFilter = THREE.NearestFilter; // Schärferes Rendering bei Vergrößerung
      textTexture5.minFilter = THREE.LinearFilter; // Glättung bei Verkleinerung
      textTexture5.anisotropy = renderer.capabilities.getMaxAnisotropy();


      


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
      const hover3 = textureLoader.load('/earthquake-flur.png');
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
            transparent: true, // Diese Zeile muss auf true sein!
            opacity: 1.0,      // Setze dies explizit
            toneMapped: false,
            color: 0xffffff
         });
         const defaultMesh = new THREE.Mesh(geom, defaultMat);
         const hoverMat = new THREE.MeshBasicMaterial({
            map: hoverTex,
            transparent: true, // Diese Zeile muss auf true sein!
            opacity: 0.0,      // Setze dies explizit 
            toneMapped: false,
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

      // Nach dem Hinzufügen aller coverGroups zum Array
      function initializeCoverGroupsOpacity() {
        // Setze alle Cover-Gruppen initial auf transparent
        coverGroups.forEach(group => {
          if (group.userData.defaultMesh) {
            group.userData.defaultMesh.material.transparent = true;
            group.userData.defaultMesh.material.opacity = 0;
            group.userData.defaultMesh.visible = false;
          }
          
          if (group.userData.hoverMesh) {
            group.userData.hoverMesh.material.transparent = true;
            group.userData.hoverMesh.material.opacity = 0;
            group.userData.hoverMesh.visible = false;
          }
        });
      }
      
      // Füge diesen Aufruf hinzu
      initializeCoverGroupsOpacity();

      // NEUE CODE-ZEILEN:
      // Direkte Manipulation der Cover-Gruppen-Materialien
      coverGroups.forEach(group => {
        // Stelle sicher, dass die Transparenz aktiviert ist
        group.userData.defaultMesh.material.transparent = true;
        group.userData.hoverMesh.material.transparent = true;
        
        // Auf unsichtbar setzen
        group.userData.defaultMesh.material.opacity = 0;
        group.userData.defaultMesh.visible = false;
        group.userData.hoverMesh.material.opacity = 0;
        group.userData.hoverMesh.visible = false;
      });

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
        bild1: '/Bild2.png',
        bild2: '/Bild1.png',
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
    
    const pngGeometry2 = new THREE.PlaneGeometry(width, height); // Verwendet die mobilen Maße
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
    
    const pngGeometry3 = new THREE.PlaneGeometry(width, height); // Verwendet die mobilen Maße
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

    const pngGeometry4 = new THREE.PlaneGeometry(width, height); // Verwendet die mobilen Maße
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
      pngMeshPC1.userData.project = 'website1';
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
      pngMeshPC2.userData.project = 'website2';
      scene.add(pngMeshPC2);
      imageMeshes.push(pngMeshPC2);



      const fotoTexturePath = isMobile ? '/mobile/Bild5.png' : '/foto-cover.png';
const pngTextureFoto = textureLoader.load(fotoTexturePath);
pngTextureFoto.colorSpace = THREE.SRGBColorSpace;
const pngGeometryFoto = new THREE.PlaneGeometry(isMobile ? 2 : 3, isMobile ? 2 * (16/9) : 2); // Anpassung an mobile Proportionen
const pngMaterialFoto = new THREE.MeshBasicMaterial({ 
  map: pngTextureFoto, 
  transparent: true,
  alphaTest: 0.01
});
      const pngMeshFoto = new THREE.Mesh(pngGeometryFoto, pngMaterialFoto);
      pngMeshFoto.position.set(3, 0, -22.5);
      pngMeshFoto.userData.finalX = 0;
      pngMeshFoto.userData.offscreenX = 3;
      pngMeshFoto.userData.project = 'photovideo'; // Dieser Eintrag ist neu
      scene.add(pngMeshFoto);
      imageMeshes.push(pngMeshFoto);

      pngTextureFoto.minFilter = THREE.LinearFilter;
      pngTextureFoto.magFilter = THREE.NearestFilter;
      pngTextureFoto.anisotropy = renderer.capabilities.getMaxAnisotropy();

      if (isMobile) {
        pngMeshFoto.scale.set(0.55, 0.55, 0.55); // Gleiche Skalierung wie andere mobile Bilder
      }

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
        particleCount: isMobileDevice() ? 600 : 1500,    // Reduzierte Anzahl
        particleColor: 0x06003D,                         // Helleres Blau mit leichtem Türkis-Touch
        particleSize: 0.2,                              // Etwas größere Partikel
        particleOpacity: 1,                           // Höhere Deckkraft
        particleGlow: true,                              // Glüheffekt aktivieren (falls unterstützt)
        particleSpeedFactor: 0.7,                        // Langsamere Bewegung für eleganteres Aussehen
        particleDistribution: 'sides',                   // Konzentriert Partikel an den Seiten
        particleSizeVariation: 0.1                       // Mehr Größenvarianz für Tiefenwirkung
      });

      // Nochmal Texturwechsel aufrufen, wenn Mobile und Meshes jetzt vorhanden sind
      if (isMobile) {
        // Kurze Verzögerung für sicheres Laden
        setTimeout(() => loadAppropriateTextures(), 100);
      }

      // TextMesh-Größen basierend auf Gerätegröße anpassen
      adjustTextMeshSizes();
   }

   // Die alte handleCanvasClick-Funktion kann durch diese ersetzt werden:
   function handleCanvasClick(event) {
      if (clickHandler) {
        clickHandler.handleClick(event, coverGroups, imageMeshes);
      }
    }

   // Optional: Auch die onMouseMove-Funktion könnte aktualisiert werden:
   function onMouseMove(event) {
      if (clickHandler) {
        clickHandler.handleHover(event, coverGroups, imageMeshes, container);
      }
    }

   // ----------------------------------------------------------------------------
   // Canvas-Update-Funktionen für die einzelnen Abschnitte
   // ----------------------------------------------------------------------------
   function updateCanvas1Text() {
  // Wenn typewriter existiert, nutze dessen Methode, sonst direkte Implementierung
  if (typewriter && context1 && textTexture1) {
    typewriter.updateCanvas1Text(context1, textTexture1);
  } else if (context1 && textTexture1) {
    // Einfache Titel-Darstellung ohne Typewriter-Effekt für die Initialisierung
    context1.clearRect(0, 0, 1024, 512);
    context1.fillStyle = "rgba(0,0,0,0)";
    context1.fillRect(0, 0, 1024, 512);
    context1.textAlign = "left";
    context1.textBaseline = "middle";
    
    context1.shadowColor = "rgba(0, 0, 0, 0.5)";
    context1.shadowBlur = 5;
    context1.shadowOffsetX = 1;
    context1.shadowOffsetY = 1;
    
    const titleFontSize = getResponsiveSize(42);
    context1.fillStyle = "rgba(255,255,255,0.4)";
    context1.font = `${titleFontSize}px 'IBM Plex Mono'`;
    
    const centerX = 1024 / 4.5;
    const centerY = 512 / 1.25;
    context1.fillText("Design Work", centerX, centerY - 50);
    
    context1.shadowColor = "transparent";
    textTexture1.needsUpdate = true;
  }
}

function updateCanvas2Text() {
  if (typewriter && context2 && textTexture2) {
    typewriter.updateCanvas2Text(context2, textTexture2);
  } else if (context2 && textTexture2) {
    context2.clearRect(0, 0, 1024, 512);
    context2.fillStyle = "rgba(0,0,0,0)";
    context2.fillRect(0, 0, 1024, 512);
    context2.textAlign = "left";
    context2.textBaseline = "middle";
    
    context2.shadowColor = "rgba(0, 0, 0, 0.5)";
    context2.shadowBlur = 5;
    context2.shadowOffsetX = 1;
    context2.shadowOffsetY = 1;
    
    const titleFontSize = getResponsiveSize(42);
    context2.fillStyle = "rgba(255,255,255,0.4)";
    context2.font = `${titleFontSize}px 'IBM Plex Mono'`;
    
    const centerX = 1024 / 4.5;
    const centerY = 512 / 1.25;
    context2.fillText("Code & Data", centerX, centerY - 50);
    
    context2.shadowColor = "transparent";
    textTexture2.needsUpdate = true;
  }
}

function updateCanvas3Text() {
  if (typewriter && context3 && textTexture3) {
    typewriter.updateCanvas3Text(context3, textTexture3);
  } else if (context3 && textTexture3) {
    context3.clearRect(0, 0, 1024, 512);
    context3.fillStyle = "rgba(0,0,0,0)";
    context3.fillRect(0, 0, 1024, 512);
    context3.textAlign = "left";
    context3.textBaseline = "middle";
    
    context3.shadowColor = "rgba(0, 0, 0, 0.5)";
    context3.shadowBlur = 5;
    context3.shadowOffsetX = 1;
    context3.shadowOffsetY = 1;
    
    const titleFontSize = getResponsiveSize(42);
    context3.fillStyle = "rgba(255,255,255,0.4)";
    context3.font = `${titleFontSize}px 'IBM Plex Mono'`;
    
    const centerX = 1024 / 4.5;
    const centerY = 512 / 1.25;
    context3.fillText("Website Projects", centerX, centerY - 50);
    
    context3.shadowColor = "transparent";
    textTexture3.needsUpdate = true;
  }
}

function updateCanvas4Text() {
  if (typewriter && context4 && textTexture4) {
    typewriter.updateCanvas4Text(context4, textTexture4);
  } else if (context4 && textTexture4) {
    context4.clearRect(0, 0, 1024, 512);
    context4.fillStyle = "rgba(0,0,0,0)";
    context4.fillRect(0, 0, 1024, 512);
    context4.textAlign = "left";
    context4.textBaseline = "middle";
    
    context4.shadowColor = "rgba(0, 0, 0, 0.5)";
    context4.shadowBlur = 5;
    context4.shadowOffsetX = 1;
    context4.shadowOffsetY = 1;
    
    const titleFontSize = getResponsiveSize(42);
    context4.fillStyle = "rgba(255,255,255,0.4)";
    context4.font = `${titleFontSize}px 'IBM Plex Mono'`;
    
    const centerX = 1024 / 4.5;
    const centerY = 512 / 1.25;
    context4.fillText("Photo & Video", centerX, centerY - 50);
    
    context4.shadowColor = "transparent";
    textTexture4.needsUpdate = true;
  }
}

function updateCanvas5Text() {
  if (typewriter && context5 && textTexture5) {
    typewriter.updateCanvas5Text(context5, textTexture5);
  } else if (context5 && textTexture5) {
    context5.clearRect(0, 0, 1024, 512);
    context5.fillStyle = "rgba(0,0,0,0)";
    context5.fillRect(0, 0, 1024, 512);
    context5.textAlign = "left";
    context5.textBaseline = "middle";
    
    context5.shadowColor = "rgba(0, 0, 0, 0.5)";
    context5.shadowBlur = 5;
    context5.shadowOffsetX = 1;
    context5.shadowOffsetY = 1;
    
    const titleFontSize = getResponsiveSize(42);
    context5.fillStyle = "rgba(255,255,255,0.4)";
    context5.font = `${titleFontSize}px 'IBM Plex Mono'`;
    
    const centerX = 1024 / 4.5;
    const centerY = 512 / 1.25;
    context5.fillText("About me", centerX, centerY - 50);
    
    context5.shadowColor = "transparent";
    textTexture5.needsUpdate = true;
  }
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
   // Animation-Loop
   // ----------------------------------------------------------------------------
   let animationId; // Speichern der requestAnimationFrame ID

   function animate() {
  animationId = requestAnimationFrame(animate);
  
  // Bild-Updates mit statischen Methoden
  ImageUpdater.updateAllImages(camera, imageMeshes);
  
  // WICHTIG: Zuerst filtern, dann positionieren
  ImageUpdater.filterMobileImages(imageMeshes);
  ImageUpdater.updateImagePositions(camera, imageMeshes, gsap);
  ImageUpdater.updateCoverGroupPositions(camera, coverGroups, gsap);
  // Neue Zeile für Cover-Gruppen-Opazität
  ImageUpdater.updateCoverGroupOpacity(camera, coverGroups);
  
  updateCurrentSection();
  
  // Typewriter-Update
  if (typewriter) {
    const contexts = { context1, context2, context3, context4, context5 };
    const textures = { textTexture1, textTexture2, textTexture3, textTexture4, textTexture5 };
    typewriter.updateTitleOpacitiesAndStartTyping(currentStation, contexts, textures);
  }
  
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

// Überarbeitete Funktion zur Anpassung der TextMesh-Größen und Positionen
function adjustTextMeshSizes() {
  // Basis-Skalierung
  const baseScale = 0.9;
  
  // Skalierung direkt basierend auf isMobile setzen
  let scale = isMobile ? baseScale * 0.55 : baseScale;
  
  // Optional: Zusätzliche Anpassung für verschiedene Bildschirmgrößen
  if (!isMobile && window.innerWidth <= 1024) {
    // Tablets
    scale = baseScale * 0.85;
  }
  
  // Alle TextMeshes im Scene-Graph finden und anpassen
  scene.traverse((object) => {
    // Suche nach den TextMesh-Objekten
    if (object.isMesh && object.material && object.material.map && 
        (object.material.map === textTexture1 || 
         object.material.map === textTexture2 ||
         object.material.map === textTexture3 ||
         object.material.map === textTexture4 ||
         object.material.map === textTexture5 ||
         (introText && object.material.map === introText.texture))) {
      
      // Passe die Skalierung an
      object.scale.set(scale, scale, scale);
      
      // Speichere die ursprüngliche Position, falls nicht schon gesetzt
      if (!object.userData.originalPosition) {
        object.userData.originalPosition = {
          x: object.position.x,
          y: object.position.y,
          z: object.position.z
        };
      }
      
      // Für mobile Geräte: Position anpassen
      if (isMobile) {
        // X-Position: mehr zur Mitte des Bildschirms schieben
        object.position.x = 0.12;  // Du kannst diesen Wert anpassen
        
        // Y-Position: etwas nach unten verschieben (verringere den Wert)
        // Da die Y-Achse nach oben positiv ist
        if (object.material.map !== introText?.texture) {
          // Nur für die Überschriften, nicht für den Intro-Text
          object.position.y = 0.3;  // Du kannst diesen Wert anpassen
        }
      } else {
        // Für Desktop: Ursprüngliche Position wiederherstellen
        const originalPos = object.userData.originalPosition;
        if (originalPos) {
          object.position.x = originalPos.x;
          object.position.y = originalPos.y;
        }
      }
    }
  });
}

// Funktion zum Neuerstellen der Canvas-Texturen bei Größenänderung
function recreateCanvasTextures() {
  // Wenn Typewriter existiert, alle Canvas-Texturen aktualisieren
  if (typewriter) {
    const contexts = { context1, context2, context3, context4, context5 };
    const textures = { textTexture1, textTexture2, textTexture3, textTexture4, textTexture5 };
    // Die richtige Methode aufrufen
    typewriter.updateAllCanvasTexts(contexts, textures);
  }
  
  // Intro-Text aktualisieren
  if (introText) {
    introText.updateCanvasText();
  }
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

// In der filterMobileImages-Methode
// Nach dem Ausblenden von website2:

// Position und Skalierung von website1 anpassen

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
