<script>
  // Core imports
  import { BackButton } from '$lib/meshes/BackButton.js';
  import { IntroText } from '$lib/meshes/IntroText.js';
  import { onMount, onDestroy } from 'svelte';
  import { gsap } from 'gsap'; 
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  
  // Factory and utility imports
  import { ProjectMeshFactory } from '$lib/meshes/ProjectMeshFactory.js';
  import { CoverGroupFactory } from '$lib/meshes/CoverGroupFactory.js';
  import { ParticleSystem } from '$lib/effects/ParticleSystem.js';
  import { Typewriter } from '$lib/meshes/Typewriter.js';
  import { ImageUpdater } from '$lib/meshes/ImageUpdater.js';
  import { CanvasClickHandler } from '$lib/interactions/HandleCanvasClick.js';
  import { CanvasTextManager } from '$lib/utils/CanvasTextManager.js';

  // Camera position parameters
  export let cx = 0;
  export let cy = 0;
  export let cz = 28.8;

  // Parameter to check if we're on main page
  export let isMainPage = true;

  // Current section for navigation
  export let currentSection = 'intro';

  // Function to navigate between sections
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
          currentSection = sectionId;
          
          gsap.to(camera.position, {
              z: cameraStations[targetStation],
              duration: 1.5,
              ease: "power2.inOut",
              onUpdate: function() {
                  camera.updateProjectionMatrix();
                  ImageUpdater.updateAllImages(camera, imageMeshes);
              },
              onComplete: () => {
                  setTimeout(() => {
                      isTransitioning = false;
                  }, 200);
              }
          });
      }
  }

  // Update current section based on camera position
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

  // Core Three.js variables
  let container;
  let scene, camera, renderer;
  let corridorLines, backWall, textMesh;
  let scrollProgress = 0;
  let THREE;

  // Camera positions
  const cameraStartZ = 28.8; 
  const cameraEndZ = -40;

  // Arrays for images and cover groups
  let imageMeshes = [];
  let coverGroups = [];

  // Scroll logic
  let isTransitioning = false;
  const cameraStations = [28.8, 20, 16.5, 13, 9.5, 5.5, 1, -3.5, -7.5, -12, -16.5, -21, -27, -31.5, -36];
  let currentStation = 0;
  
  let initialPositionSet = false;

  // Factory instances
  let projectMeshFactory;
  let coverGroupFactory;

  // Effects and interactive elements
  let particleSystem;
  let typewriter;
  let introText;
  let clickHandler;
  let backButton;
  let canvasTextManager;

  // Event listener management
  function addWheelListener() {
    window.addEventListener('wheel', onWheel, { passive: false });
  }

  function removeWheelListener() {
    window.removeEventListener('wheel', onWheel);
  }

  // Update overflow style based on isMainPage
  function updateOverflowStyle() {
    if (typeof document !== 'undefined') {
      document.documentElement.style.overflow = isMainPage ? 'hidden' : 'auto';
      document.body.style.overflow = isMainPage ? 'hidden' : 'auto';
    }
  }

  // Loading callbacks
  export let onLoadingProgress = (progress) => {};
  export let onLoadingComplete = () => {};

  // Loading manager variables
  let loadingManager;
  let totalAssetsLoaded = 0;
  let totalAssetsToLoad = 0;

  // Component lifecycle hooks
  onMount(async () => {
    THREE = await import('three');
    
    // Delay initialization to allow browser to determine window size
    setTimeout(async () => {
      // Check device size before initialization
      checkDeviceSize();
      
      // Initialize scene
      initScene();
      
      // Preload resources before continuing with initialization
      preloadAllResources();
      
      // Pre-warm stations to prevent lags
      await preWarmStations();
      
      // Complete initialization
      camera.position.set(cx, cy, cz);
      initialPositionSet = true;

      const tolerance = 0.1;
      const index = cameraStations.findIndex(val => Math.abs(val - cz) < tolerance);
      if (index >= 0) {
        currentStation = index;
      } else {
        currentStation = cameraStations.reduce((prev, curr, i) =>
          Math.abs(curr - cz) < Math.abs(cameraStations[prev] - cz) ? i : prev, 0);
      }

      // Subscribe to page store to update camera on URL changes
      const unsubscribe = page.subscribe(($page) => {
        const newCx = Number($page.url.searchParams.get('cx')) || 0;
        const newCy = Number($page.url.searchParams.get('cy')) || 0;
        const newCz = Number($page.url.searchParams.get('cz')) || 28.8;
        
        if (camera && newCz !== cz) {
          camera.position.set(newCx, newCy, newCz);
          
          const idx = cameraStations.findIndex(val => Math.abs(val - newCz) < tolerance);
          currentStation = idx >= 0 ? idx : cameraStations.reduce((prev, curr, i) =>
            Math.abs(curr - newCz) < Math.abs(cameraStations[prev] - newCz) ? i : prev, 0);
        }
      });

      // Initialize text components
      typewriter = new Typewriter();
      introText = new IntroText(THREE);
      
      // Set the correct mobile status
      introText.isMobile = isMobile;
      introText.createMesh(scene);
      introText.startUpdateInterval(2000);
      introText.setMobileMode(isMobile);
      introText.updateCanvasText();

      // Initialize click handler after scene
      clickHandler = new CanvasClickHandler(THREE, {
        camera: camera,
        navigateToProject: (projectName, cameraPosition) => {
          const { x, y, z } = cameraPosition;
          goto(`/project/${projectName}?cx=${x}&cy=${y}&cz=${z}`);
        },
        gsap: gsap
      });

      // Start animation loop
      animate();

      // Add event listeners only on main page
      if (isMainPage) {
        addWheelListener();
      }
      
      window.addEventListener('resize', onWindowResize);
      window.addEventListener('mousemove', onMouseMove, false);

      // Set overflow style immediately
      updateOverflowStyle();

      // Touch events for mobile devices
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
      
      // Stop animation loop
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      // Clean up WebGL resources
      if (renderer) {
        renderer.dispose();
        
        // Clean up materials and geometries
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

      // Remove touch event listeners
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);

      // Clean up particle system
      if (particleSystem) {
        particleSystem.dispose();
      }
    }

    // Clean up text components
    if (introText) {
      introText.dispose();
    }

    // Clean up back button
    if (backButton) {
      backButton.dispose();
    }

    // Restore default overflow when component is destroyed
    if (typeof document !== 'undefined') {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    }
  });

  // Canvas texture variables
  let context1, context2, context3, context4, context5;
  let textTexture1, textTexture2, textTexture3, textTexture4, textTexture5;

  // Touch handling variables
  let touchStartY = 0;
  let touchEndY = 0;
  let touchStartTime = 0;
  let isSwiping = false;

  // Touch event handlers
  function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
    touchStartTime = Date.now();
    isSwiping = true;
  }

  function handleTouchMove(event) {
    if (isSwiping) {
      event.preventDefault();
    }
  }

  function handleTouchEnd(event) {
    if (!isSwiping) return;
    
    isSwiping = false;
    touchEndY = event.changedTouches[0].clientY;
    const touchDiff = touchStartY - touchEndY;
    const touchTime = Date.now() - touchStartTime;
    
    // Calculate swipe velocity (pixels per ms)
    const swipeVelocity = Math.abs(touchDiff) / touchTime;
    
    // Minimum threshold for swipe detection (50px or high velocity)
    if (Math.abs(touchDiff) > 50 || swipeVelocity > 0.5) {
      const wheelEvent = { 
        deltaY: -touchDiff,
        preventDefault: () => {} 
      };
      onWheel(wheelEvent);
    }
  }

  // Device detection
  function isMobileDevice() {
    return (typeof window !== 'undefined' && window.innerWidth <= 768) || 
          (typeof navigator !== 'undefined' && 
          (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)));
  }

  // Responsive variables
  let isMobile = false;
  let currentTextures = {
    bild1: null,
    bild2: null, 
    bild3: null,
    bild4: null,
    fotoCover: null
  };
  
  // Check device size and update responsive elements
  function checkDeviceSize() {
    const wasAlreadyMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    // If status has changed, update components
    if (wasAlreadyMobile !== isMobile && scene) {
      // Reload textures
      loadAppropriateTextures();
      
      // Adjust text mesh sizes
      adjustTextMeshSizes();
      
      // Update canvas textures
      recreateCanvasTextures();
      
      // Update mobile status for IntroText
      if (introText) {
        introText.setMobileMode(isMobile);
      }
    }
  }

  // Load appropriate textures based on device size
  function loadAppropriateTextures() {
    if (!THREE || !scene || !imageMeshes.length) return;
    
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const texturePaths = {
      desktop: {
        bild1: '/Bild2.png',
        bild2: '/Bild1.png',
        bild3: '/Bild3.png',
        bild4: '/Bild4.png',
        fotoCover: '/foto-cover.png'
      },
      mobile: {
        bild1: '/mobile/Bild1-mobile.png',
        bild2: '/mobile/Bild2-mobile.png',
        bild3: '/mobile/Bild3-mobile.png',
        bild4: '/mobile/Bild4-mobile.png',
        fotoCover: '/mobile/Bild5.png'
      }
    };
    
    // Choose the right paths
    const paths = isMobile ? texturePaths.mobile : texturePaths.desktop;
    
    // Direct index access for better performance
    const meshAssignments = [
      { meshIndex: 0, texture: 'bild1', project: 'nass' },
      { meshIndex: 1, texture: 'bild2', project: 'bwegt' },
      { meshIndex: 2, texture: 'bild3', project: 'iceAgeMammals' },
      { meshIndex: 3, texture: 'bild4', project: 'hybridWallet' },
      { meshIndex: 6, texture: 'fotoCover', project: 'photovideo' }
    ];
    
    meshAssignments.forEach(({ meshIndex, texture, project }) => {
      if (meshIndex >= 0 && meshIndex < imageMeshes.length) {
        textureLoader.load(
          paths[texture], 
          newTexture => {
            newTexture.colorSpace = THREE.SRGBColorSpace;
            currentTextures[texture] = newTexture;
          },
          undefined,
          error => {
            // Silent fail in production
          }
        );
      }
    });
  }

  // Initialize Three.js scene
  function initScene() {
    // Initialize LoadingManager
    loadingManager = new THREE.LoadingManager();
    
    loadingManager.onStart = function(url, itemsLoaded, itemsTotal) {
        totalAssetsToLoad = itemsTotal;
    };
    
    loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
        totalAssetsLoaded = itemsLoaded;
        totalAssetsToLoad = itemsTotal;
        const progress = Math.floor((itemsLoaded / itemsTotal) * 100);
        onLoadingProgress(progress);
    };
    
    loadingManager.onLoad = function() {
        onLoadingComplete();
    };
    
    // Scene and background
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x01031A);

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Tone mapping & color space
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Reduce render quality for mobile devices
    if (isMobileDevice()) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } else {
      renderer.setPixelRatio(window.devicePixelRatio);
    }

    // Create back button
    backButton = new BackButton(THREE, scene, renderer, camera);
      
    // Placeholder for back wall
    backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(0.1, 0.1),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    scene.add(backWall);

    // Initialize factories
    projectMeshFactory = new ProjectMeshFactory(scene, isMobile);
    coverGroupFactory = new CoverGroupFactory(scene, isMobile);

    // Initialize canvas text manager
    canvasTextManager = new CanvasTextManager(THREE, renderer);

    // Create section title texts
    // 1) Design Work
    const canvas1 = document.createElement('canvas');
    const ratio1 = window.devicePixelRatio || 1;
    canvas1.width = 1024 * ratio1;
    canvas1.height = 512 * ratio1;
    context1 = canvas1.getContext('2d');
    context1.scale(ratio1, ratio1);

    textTexture1 = new THREE.CanvasTexture(canvas1);
    textTexture1.colorSpace = THREE.SRGBColorSpace;
    
    updateCanvas1Text();

    const textMaterial1 = new THREE.MeshBasicMaterial({ map: textTexture1, transparent: true });
    const textGeometry1 = new THREE.PlaneGeometry(4, 2);
    const textMesh1 = new THREE.Mesh(textGeometry1, textMaterial1);
    textMesh1.position.set(0, 0.6, 18.5);
    scene.add(textMesh1);

    // Better filter settings for text
    textTexture1.magFilter = THREE.NearestFilter;
    textTexture1.minFilter = THREE.LinearFilter;
    textTexture1.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 2) Code and Data
    const canvas2 = document.createElement('canvas');
    const ratio2 = window.devicePixelRatio || 1;
    canvas2.width = 1024 * ratio2;
    canvas2.height = 512 * ratio2;
    context2 = canvas2.getContext('2d');
    context2.scale(ratio2, ratio2);

    textTexture2 = new THREE.CanvasTexture(canvas2);
    textTexture2.colorSpace = THREE.SRGBColorSpace;
    
    updateCanvas2Text();

    const textMaterial2 = new THREE.MeshBasicMaterial({ map: textTexture2, transparent: true });
    const textGeometry2 = new THREE.PlaneGeometry(4, 2);
    const textMesh2 = new THREE.Mesh(textGeometry2, textMaterial2);
    textMesh2.position.set(0, 0.6, -0.5);
    scene.add(textMesh2);

    // Better filter settings for text
    textTexture2.magFilter = THREE.NearestFilter;
    textTexture2.minFilter = THREE.LinearFilter;
    textTexture2.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 3) Website projects
    const canvas3 = document.createElement('canvas');
    const ratio3 = window.devicePixelRatio || 1;
    canvas3.width = 1024 * ratio3;
    canvas3.height = 512 * ratio3;
    context3 = canvas3.getContext('2d');
    context3.scale(ratio3, ratio3);

    textTexture3 = new THREE.CanvasTexture(canvas3);
    textTexture3.colorSpace = THREE.SRGBColorSpace;
    
    updateCanvas3Text();

    const textMaterial3 = new THREE.MeshBasicMaterial({ map: textTexture3, transparent: true });
    const textGeometry3 = new THREE.PlaneGeometry(4, 2);
    const textMesh3 = new THREE.Mesh(textGeometry3, textMaterial3);
    textMesh3.position.set(0, 0.6, -9);
    scene.add(textMesh3);

    // Better filter settings for text
    textTexture3.magFilter = THREE.NearestFilter;
    textTexture3.minFilter = THREE.LinearFilter;
    textTexture3.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 4) Photo & Video
    const canvas4 = document.createElement('canvas');
    const ratio4 = window.devicePixelRatio || 1;
    canvas4.width = 1024 * ratio4;
    canvas4.height = 512 * ratio4;
    context4 = canvas4.getContext('2d');
    context4.scale(ratio4, ratio4);

    textTexture4 = new THREE.CanvasTexture(canvas4);
    textTexture4.colorSpace = THREE.SRGBColorSpace;
    
    updateCanvas4Text();

    const textMaterial4 = new THREE.MeshBasicMaterial({ 
      map: textTexture4, 
      transparent: true,
      alphaTest: 0.01
    });
    const textGeometry4 = new THREE.PlaneGeometry(4, 2);
    const textMesh4 = new THREE.Mesh(textGeometry4, textMaterial4);
    textMesh4.position.set(0, 0.6, -18);
    scene.add(textMesh4);

    // Better filter settings for text
    textTexture4.magFilter = THREE.NearestFilter;
    textTexture4.minFilter = THREE.LinearFilter;
    textTexture4.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 5) About me
    const canvas5 = document.createElement('canvas');
    const ratio5 = window.devicePixelRatio || 1;
    canvas5.width = 1024 * ratio5;
    canvas5.height = 512 * ratio5;
    context5 = canvas5.getContext('2d');
    context5.scale(ratio5, ratio5);

    textTexture5 = new THREE.CanvasTexture(canvas5);
    textTexture5.colorSpace = THREE.SRGBColorSpace;
    
    updateCanvas5Text();

    const textMaterial5 = new THREE.MeshBasicMaterial({ 
      map: textTexture5, 
      transparent: true,
      alphaTest: 0.01
    });
    const textGeometry5 = new THREE.PlaneGeometry(4, 2);
    const textMesh5 = new THREE.Mesh(textGeometry5, textMaterial5);
    textMesh5.position.set(0, 0.6, -28.5);
    scene.add(textMesh5);

    // Better filter settings for text
    textTexture5.magFilter = THREE.NearestFilter;
    textTexture5.minFilter = THREE.LinearFilter;
    textTexture5.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Load project cover images and hover states
    const textureLoader = new THREE.TextureLoader(loadingManager);

    // Default textures
    const cover3 = textureLoader.load('/Cover3.png');
    cover3.colorSpace = THREE.SRGBColorSpace;
    const cover2 = textureLoader.load('/Cover2.png');
    cover2.colorSpace = THREE.SRGBColorSpace;
    const cover1 = textureLoader.load('/Cover4.png');
    cover1.colorSpace = THREE.SRGBColorSpace;
    const cover4 = textureLoader.load('/Cover1.png');
    cover4.colorSpace = THREE.SRGBColorSpace;

    // Hover textures
    const hover3 = textureLoader.load('/earthquake-flur.png');
    hover3.colorSpace = THREE.SRGBColorSpace;
    const hover2 = textureLoader.load('/Hover2.png');
    hover2.colorSpace = THREE.SRGBColorSpace;
    const hover1 = textureLoader.load('/quatteraFlur.png');
    hover1.colorSpace = THREE.SRGBColorSpace;
    const hover4 = textureLoader.load('/HoverKarin.png');
    hover4.colorSpace = THREE.SRGBColorSpace;

    // Function to create a cover group (two meshes stacked)
    function createCoverGroup(defaultTex, hoverTex, x, y, z, finalX, offscreenX) {
       const group = new THREE.Group();
       group.position.set(x, y, z);
       group.scale.set(0.6, 0.6, 0.6);
       const geom = new THREE.PlaneGeometry(3, 2);
       const defaultMat = new THREE.MeshBasicMaterial({
          map: defaultTex,
          transparent: true,
          opacity: 1.0,
          toneMapped: false,
          color: 0xffffff
       });
       const defaultMesh = new THREE.Mesh(geom, defaultMat);
       const hoverMat = new THREE.MeshBasicMaterial({
          map: hoverTex,
          transparent: true,
          opacity: 0.0,
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
       // Store reference to parent group for raycasting
       defaultMesh.userData.parentGroup = group;
       return group;
    }

    // Create four cover groups
    const coverGroup1 = createCoverGroup(cover3, hover3,  3,  0.65, -5.5, 1.2,  3);
    coverGroup1.userData.project = 'earthquake'; // Top left: game instead of iceAgeMammals
    
    const coverGroup2 = createCoverGroup(cover2, hover2,  3, -0.65, -5.5, 1.2,  3);
    coverGroup2.userData.project = 'migrants'; // Top right: earthquake instead of hybridWallet
    
    const coverGroup3 = createCoverGroup(cover1, hover1, -3,  0.65, -5.5, -1.2, -3);
    coverGroup3.userData.project = 'game'; // Bottom left: karincruises instead of nass
    
    const coverGroup4 = createCoverGroup(cover4, hover4, -3, -0.65, -5.5, -1.2, -3);
    coverGroup4.userData.project = 'karincruises'; // Bottom right: migrants instead of bwegt

    scene.add(coverGroup1);
    scene.add(coverGroup2);
    scene.add(coverGroup3);
    scene.add(coverGroup4);

    coverGroups.push(coverGroup1, coverGroup2, coverGroup3, coverGroup4);

    // Initialize cover groups to be transparent
    function initializeCoverGroupsOpacity() {
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
    
    initializeCoverGroupsOpacity();

    // Direct manipulation of cover group materials
    coverGroups.forEach(group => {
      group.userData.defaultMesh.material.transparent = true;
      group.userData.hoverMesh.material.transparent = true;
      
      group.userData.defaultMesh.material.opacity = 0;
      group.userData.defaultMesh.visible = false;
      group.userData.hoverMesh.material.opacity = 0;
      group.userData.hoverMesh.visible = false;
    });

    // Load project images
    checkDeviceSize();
    
    // Choose the right paths based on device size
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
    
    // Load the initial textures
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
    
    // Create mesh objects with appropriate geometry based on device size
    const aspectRatio = isMobile ? 9/16 : 3/2;
    const width = isMobile ? 2 : 3;
    const height = isMobile ? 2 * (16/9) : 2;  // 9:16 ratio for mobile

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
    pngMesh1.userData.project = 'nass'; // Nass project
    scene.add(pngMesh1);
    imageMeshes.push(pngMesh1);
    
    const pngGeometry2 = new THREE.PlaneGeometry(width, height);
    const pngMaterial2 = new THREE.MeshBasicMaterial({ 
      map: pngTexture2, 
      transparent: true 
    });
    const pngMesh2 = new THREE.Mesh(pngGeometry2, pngMaterial2);
    pngMesh2.position.set(3, 0, 11.5);
    pngMesh2.userData.finalX = 0;
    pngMesh2.userData.offscreenX = 3;
    pngMesh2.userData.project = 'bwegt'; // Bwegt project
    scene.add(pngMesh2);
    imageMeshes.push(pngMesh2);
    
    const pngGeometry3 = new THREE.PlaneGeometry(width, height);
    const pngMaterial3 = new THREE.MeshBasicMaterial({ 
      map: currentTextures.bild3, 
      transparent: true 
    });
    const pngMesh3 = new THREE.Mesh(pngGeometry3, pngMaterial3);
    pngMesh3.position.set(-3, 0, 8);
    pngMesh3.userData.finalX = 0;
    pngMesh3.userData.offscreenX = -3;
    pngMesh3.userData.project = 'iceAgeMammals'; // IceAgeMammals project
    scene.add(pngMesh3);
    imageMeshes.push(pngMesh3);

    const pngGeometry4 = new THREE.PlaneGeometry(width, height);
    const pngMaterial4 = new THREE.MeshBasicMaterial({ 
      map: currentTextures.bild4, 
      transparent: true 
    });
    const pngMesh4 = new THREE.Mesh(pngGeometry4, pngMaterial4);
    pngMesh4.position.set(3, 0, 4);
    pngMesh4.userData.finalX = 0;
    pngMesh4.userData.offscreenX = 3;
    pngMesh4.userData.project = 'hybridWallet'; // HybridWallet project
    scene.add(pngMesh4);
    imageMeshes.push(pngMesh4);

    // Scale mobile images
    if (isMobile) {
      pngMesh1.scale.set(0.55, 0.55, 0.55);
      pngMesh2.scale.set(0.55, 0.55, 0.55);
      pngMesh3.scale.set(0.55, 0.55, 0.55);
      pngMesh4.scale.set(0.55, 0.55, 0.55);
    }

    // Load website project images
    const pngTexturePC1 = textureLoader.load('/Website1.png');
    pngTexturePC1.colorSpace = THREE.SRGBColorSpace;
    // Improved texture settings
    pngTexturePC1.anisotropy = renderer.capabilities.getMaxAnisotropy();
    pngTexturePC1.minFilter = THREE.LinearFilter;
    pngTexturePC1.magFilter = THREE.LinearFilter;
    pngTexturePC1.generateMipmaps = true;

    const pngGeometryPC1 = new THREE.PlaneGeometry(2.8, 3.4);
    const pngMaterialPC1 = new THREE.MeshBasicMaterial({ 
      map: pngTexturePC1, 
      transparent: true,
      alphaTest: 0.01
    });
    const pngMeshPC1 = new THREE.Mesh(pngGeometryPC1, pngMaterialPC1);
    pngMeshPC1.position.set(-3, 0, -13.5);
    pngMeshPC1.scale.set(0.6, 0.6, 0.6);
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

    // Load photo & video cover
    const fotoTexturePath = isMobile ? '/mobile/Bild5.png' : '/foto-cover.png';
    const pngTextureFoto = textureLoader.load(fotoTexturePath);
    pngTextureFoto.colorSpace = THREE.SRGBColorSpace;
    const pngGeometryFoto = new THREE.PlaneGeometry(isMobile ? 2 : 3, isMobile ? 2 * (16/9) : 2);
    const pngMaterialFoto = new THREE.MeshBasicMaterial({ 
      map: pngTextureFoto, 
      transparent: true,
      alphaTest: 0.01
    });
    const pngMeshFoto = new THREE.Mesh(pngGeometryFoto, pngMaterialFoto);
    pngMeshFoto.position.set(3, 0, -22.5);
    pngMeshFoto.userData.finalX = 0;
    pngMeshFoto.userData.offscreenX = 3;
    pngMeshFoto.userData.project = 'photovideo';
    scene.add(pngMeshFoto);
    imageMeshes.push(pngMeshFoto);

    pngTextureFoto.minFilter = THREE.LinearFilter;
    pngTextureFoto.magFilter = THREE.NearestFilter;
    pngTextureFoto.anisotropy = renderer.capabilities.getMaxAnisotropy();

    if (isMobile) {
      pngMeshFoto.scale.set(0.55, 0.55, 0.55);
    }

    // Load about me image
    const pngTextureMe = textureLoader.load('/photo-video.png');
    pngTextureMe.colorSpace = THREE.SRGBColorSpace;
    const pngGeometryMe = new THREE.PlaneGeometry(3, 2);
    const pngMaterialMe = new THREE.MeshBasicMaterial({ 
      map: pngTextureMe, 
      transparent: true,
      alphaTest: 0.01
    });
    const pngMeshMe = new THREE.Mesh(pngGeometryMe, pngMaterialMe);
    pngMeshMe.position.set(3, 0, -33);
    pngMeshMe.userData.finalX = 0;
    pngMeshMe.userData.offscreenX = 3;
    pngMeshMe.userData.project = 'aboutme';
    scene.add(pngMeshMe);
    imageMeshes.push(pngMeshMe);
    
    // Initialize particle system
    particleSystem = new ParticleSystem(THREE, scene, {
      particleCount: isMobileDevice() ? 600 : 1500,
      particleColor: 0x06003D,
      particleSize: 0.2,
      particleOpacity: 1,
      particleGlow: true,
      particleSpeedFactor: 0.7,
      particleDistribution: 'sides',
      particleSizeVariation: 0.1
    });

    // Reload textures for mobile if needed
    if (isMobile) {
      setTimeout(() => loadAppropriateTextures(), 100);
    }

    // Adjust text mesh sizes based on device size
    adjustTextMeshSizes();
 }

 // Handle canvas click for interactive elements
 function handleCanvasClick(event) {
   if (!scene) return;
   
   // Raycasting for button and other objects
   const rect = container.getBoundingClientRect();
   const x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
   const y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
   
   // Back button click detection
   if (backButton && backButton.handleClick(x, y, navigateToSection)) {
     return;
   }
   
   // Normal click handler for other objects
   if (clickHandler) {
     clickHandler.handleClick(event, coverGroups, imageMeshes);
   }
 }

 // Handle mouse movement for hover effects
 function onMouseMove(event) {
   // Check if mouse is over the button
   const rect = container.getBoundingClientRect();
   const x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
   const y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
   
   // Back button hover detection
   if (backButton && backButton.handleMouseMove(event, container, gsap, rect, x, y)) {
     return;
   }
   
   // Reset cursor if not over interactive elements
   container.style.cursor = "auto";
   
   // Normal hover handler for other objects
   if (clickHandler) {
     clickHandler.handleHover(event, coverGroups, imageMeshes, container);
   }
 }

 // Canvas text update functions
 function updateCanvas1Text() {
   canvasTextManager.updateCanvas1Text(context1, textTexture1);
 }

 function updateCanvas2Text() {
   canvasTextManager.updateCanvas2Text(context2, textTexture2);
 }

 function updateCanvas3Text() {
   canvasTextManager.updateCanvas3Text(context3, textTexture3);
 }

 function updateCanvas4Text() {
   canvasTextManager.updateCanvas4Text(context4, textTexture4);
 }

 function updateCanvas5Text() {
   canvasTextManager.updateCanvas5Text(context5, textTexture5);
 }

 // Scroll handling
 function onWheel(event) {
    event.preventDefault();
    if (isTransitioning) return;

    if (event.deltaY > 0 && currentStation < cameraStations.length - 1) {
       currentStation++;
       isTransitioning = true;
       gsap.to(camera.position, {
          z: cameraStations[currentStation],
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
              updateCurrentSection();
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
              updateCurrentSection();
             setTimeout(() => {
                isTransitioning = false;
             }, 200);
          }
       });
    }
 }

 // Animation loop
 let animationId;

 function animate() {
   animationId = requestAnimationFrame(animate);
   
   // Update image and cover positions
   ImageUpdater.updateAllImages(camera, imageMeshes);
   ImageUpdater.filterMobileImages(imageMeshes);
   ImageUpdater.updateImagePositions(camera, imageMeshes, gsap);
   ImageUpdater.updateCoverGroupPositions(camera, coverGroups, gsap);
   ImageUpdater.updateCoverGroupOpacity(camera, coverGroups);
   
   updateCurrentSection();
   
   // Update typewriter effects
   if (typewriter) {
     const contexts = { context1, context2, context3, context4, context5 };
     const textures = { textTexture1, textTexture2, textTexture3, textTexture4, textTexture5 };
     typewriter.updateTitleOpacitiesAndStartTyping(currentStation, contexts, textures);
   }
   
   // Update particle system
   if (particleSystem) {
     particleSystem.animate();
   }
   
   renderer.render(scene, camera);
 }

 // Handle window resize
 function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
   
   // Update text sizes and positions
   adjustTextMeshSizes();
   
   // Update canvas textures
   recreateCanvasTextures();
   
   // Check for screen size changes
   checkDeviceSize();
 }

 // Adjust text mesh sizes based on device
 function adjustTextMeshSizes() {
   // Base scaling
   const baseScale = 0.9;
   
   // Set scale based on device
   let scale = isMobile ? baseScale * 0.55 : baseScale;
   
   // Additional adjustment for tablet screens
   if (!isMobile && window.innerWidth <= 1024) {
     scale = baseScale * 0.85;
   }
   
   // Find and adjust all text meshes
   scene.traverse((object) => {
     if (object.isMesh && object.material && object.material.map && 
         (object.material.map === textTexture1 || 
          object.material.map === textTexture2 ||
          object.material.map === textTexture3 ||
          object.material.map === textTexture4 ||
          object.material.map === textTexture5 ||
          (introText && object.material.map === introText.texture))) {
       
       // Adjust scale
       object.scale.set(scale, scale, scale);
       
       // Store original position if not already set
       if (!object.userData.originalPosition) {
         object.userData.originalPosition = {
           x: object.position.x,
           y: object.position.y,
           z: object.position.z
         };
       }
       
       // Adjust position for mobile
       if (isMobile) {
         object.position.x = 0.12;
         
         if (object.material.map !== introText?.texture) {
           object.position.y = 0.3;
         }
       } else {
         // Restore original position for desktop
         const originalPos = object.userData.originalPosition;
         if (originalPos) {
           object.position.x = originalPos.x;
           object.position.y = originalPos.y;
         }
       }
     }
   });
 }

 // Update canvas textures when needed
 function recreateCanvasTextures() {
   if (canvasTextManager) {
     const contexts = { context1, context2, context3, context4, context5 };
     const textures = { textTexture1, textTexture2, textTexture3, textTexture4, textTexture5 };
     canvasTextManager.updateAllCanvasTexts(contexts, textures);
   }
   
   // Update intro text
   if (introText) {
     introText.updateCanvasText();
   }
 }

 // Helper for responsive sizing
 function getResponsiveSize(baseSize) {
   const baseWidth = 1920;
   const minScale = 0.7;
   
   let scale = Math.max(window.innerWidth / baseWidth, minScale);
   return Math.floor(baseSize * scale);
 }

 // Preload all required textures
 function preloadAllResources() {
   if (!loadingManager || !THREE) return;
   
   const textureLoader = new THREE.TextureLoader(loadingManager);
   
   // List of all textures to preload
   const texturesToPreload = [
     // Cover images
     '/Cover1.png', '/Cover2.png', '/Cover3.png', '/Cover4.png',
     '/Hover1.png', '/Hover2.png', '/HoverKarin.png', '/earthquake-flur.png',
     
     // Project images
     '/Bild1.png', '/Bild2.png', '/Bild3.png', '/Bild4.png', 
     '/foto-cover.png', '/Website1.png', '/Website2.png', '/photo-video.png',
     
     // Mobile versions
     '/mobile/Bild1-mobile.png', '/mobile/Bild2-mobile.png', 
     '/mobile/Bild3-mobile.png', '/mobile/Bild4-mobile.png',
     '/mobile/Bild5.png'
   ];
   
   // Preload all textures
   texturesToPreload.forEach(path => {
     textureLoader.load(
       path,
       texture => {
         texture.colorSpace = THREE.SRGBColorSpace;
       },
       undefined,
       error => {
         // Silent fail in production
       }
     );
   });
 }

 // Pre-warm stations to prevent lags
 async function preWarmStations() {
   if (!camera || !scene) return;
   
   // Save original camera position
   const originalPosition = { 
     x: camera.position.x, 
     y: camera.position.y, 
     z: camera.position.z 
   };
   
   // Create temporary camera for offscreen rendering
   const tempCamera = camera.clone();
   scene.add(tempCamera);
   
   // Visit all stations and render briefly
   const allStationPromises = cameraStations.map((stationZ, index) => {
     return new Promise(resolve => {
       // Set camera directly without animation
       tempCamera.position.z = stationZ;
       
       // Render a few frames to compile all shaders
       for (let i = 0; i < 3; i++) {
         renderer.render(scene, tempCamera);
       }
       
       // Simulate animation updates
       ImageUpdater.updateAllImages(tempCamera, imageMeshes);
       ImageUpdater.updateImagePositions(tempCamera, imageMeshes, gsap);
       ImageUpdater.updateCoverGroupPositions(tempCamera, coverGroups, gsap);
       ImageUpdater.updateCoverGroupOpacity(tempCamera, coverGroups);
       
       // Wait a moment to give the GPU time
       setTimeout(resolve, 10);
     });
   });
   
   // Wait for all stations
   await Promise.all(allStationPromises);
   
   // Remove temporary camera
   scene.remove(tempCamera);
   
   // Restore original position
   camera.position.set(originalPosition.x, originalPosition.y, originalPosition.z);
   
   return true;
 }
</script>

<style>
 @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap');

 /* Make overflow property dependent on isMainPage */
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