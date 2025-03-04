<!-- <script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
  
    let container;
    let scene, camera, renderer;
    let plane;
  
    // Minimale Shader, die nichts tun außer das Textur-Pixel "roh" auszugeben.
    // RawShaderMaterial = kein Auto-Uniform, kein extra Transform, wir definieren selbst.
    const vertexShader = `
    attribute vec3 position;
    attribute vec2 uv;
  
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
  
    varying vec2 vUv;
  
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;
  
    const fragmentShader = `
    precision highp float;
  
    uniform sampler2D map;
    varying vec2 vUv;
  
    void main() {
        // 1:1 rohes Texture-Sampling ohne Gamma-Korrektur, Tone Mapping oder sonstwas
        gl_FragColor = texture2D(map, vUv);
    }
    `;
  
    onMount(() => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
  
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 2;
  
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
  
      // Keine Tone-Mapping-Kurve
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.toneMappingExposure = 1.0;
  
      // Rein lineare Ausgabe, kein sRGB
      renderer.outputEncoding = THREE.LinearEncoding;
  
      container.appendChild(renderer.domElement);
  
      // TextureLoader
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load('/Earthquake.png', onTextureLoaded);
  
      // Auch die Textur wird 1:1 interpretiert (Linear)
      texture.encoding = THREE.LinearEncoding;
  
      window.addEventListener('resize', onWindowResize);
    });
  
    function onTextureLoaded(texture) {
      // Plane-Geometrie (Breite/Höhe passend zum Bildverhältnis)
      const aspect = texture.image.width / texture.image.height;
      const geometry = new THREE.PlaneGeometry(aspect * 2, 2);
  
      // RawShaderMaterial: wir legen Vertex + FragmentShader selbst fest
      const rawMaterial = new THREE.RawShaderMaterial({
        uniforms: {
          map: { value: texture }
        },
        vertexShader,
        fragmentShader
        // Keine Tone Mapping, keine sRGB-Korrektur, wirklich "roh"
      });
  
      plane = new THREE.Mesh(geometry, rawMaterial);
      scene.add(plane);
  
      animate();
    }
  
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
  </script>
  
  <style>
    :global(html, body) {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
    }
    #container {
      width: 100%;
      height: 100%;
    }
  </style>
  
  <div id="container" bind:this={container}></div>





  <script>
    import { onMount, onDestroy } from 'svelte';
    import { gsap } from 'gsap';

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

    // ------ Raw Shader Code ------
    const rawVertexShader = `
      attribute vec3 position;
      attribute vec2 uv;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;

      varying vec2 vUv;

      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Wir definieren eine uniform "uOpacity", um die Transparenz im Shader zu kontrollieren
    const rawFragmentShader = `
      precision highp float;

      uniform sampler2D uMap;
      uniform float uOpacity;

      varying vec2 vUv;

      void main() {
          vec4 color = texture2D(uMap, vUv);
          // Multipliziere Alpha mit unserer uOpacity
          color.a *= uOpacity;
          gl_FragColor = color;
      }
    `;

    // Kleiner Helfer, um ein "Plane" mit RawShaderMaterial anzulegen
    function createRawShaderPlane(texturePath, x, y, z, offscreenX, finalX) {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(texturePath);

      // Für wirklich "roh" -> linearEncoding (keine sRGB->Linear-Korrektur).
      // Wenn du *doch* sRGB nutzen willst: texture.encoding = THREE.sRGBEncoding;
      texture.encoding = THREE.LinearEncoding;

      const geometry = new THREE.PlaneGeometry(3, 2);

      // RawShaderMaterial bekommt unsere Shader + Uniforms
      const material = new THREE.RawShaderMaterial({
        vertexShader: rawVertexShader,
        fragmentShader: rawFragmentShader,
        uniforms: {
          uMap: { value: texture },
          uOpacity: { value: 1.0 }  // Anfangs volle Deckkraft
        },
        transparent: true,   // Damit Alpha überhaupt ausgewertet wird
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Setze Startposition + "Offscreen"/"Final" Wertespeicher
      mesh.position.set(x, y, z);
      mesh.userData.finalX = finalX;
      mesh.userData.offscreenX = offscreenX;

      return mesh;
    }

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
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      // Tone Mapping abschalten + sRGB-Ausgabe:
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputEncoding = THREE.sRGBEncoding;

      // --- FLUR-Linien & Rückwand ---
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

      const backWallGeo = new THREE.PlaneGeometry(10, 5);
      const backWallMat = new THREE.MeshBasicMaterial({ color: 0x010300 });
      backWall = new THREE.Mesh(backWallGeo, backWallMat);
      backWall.position.set(0, 0, -50);
      scene.add(backWall);

      // GridHelper
      const gridHelper = new THREE.GridHelper(20, 5, 0x707070, 0x707070);
      gridHelper.rotation.z = -Math.PI / 2;
      gridHelper.position.set(-20, 0, -30);
      scene.add(gridHelper);

      const gridHelper2 = new THREE.GridHelper(20, 20, 0x707070, 0x707070);
      gridHelper2.rotation.z = -Math.PI / 2;
      gridHelper2.position.set(20, 0, 0);
      scene.add(gridHelper2);

      // --- 3D-Text (Canvas) ---
      canvas = document.createElement('canvas');
      const ratio = window.devicePixelRatio || 1;
      canvas.width = 1024 * ratio;
      canvas.height = 512 * ratio;
      context = canvas.getContext('2d');
      context.scale(ratio, ratio);
      textTexture = new THREE.CanvasTexture(canvas);
      updateCanvasText();
      const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true
      });
      const textGeometry = new THREE.PlaneGeometry(4, 2);
      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(0, 0, cameraStartZ - 1.7);
      scene.add(textMesh);

      // --- Hier ersetzen wir die MeshBasicMaterial-Planes durch RawShaderMaterial-Planes ---

      // 1) Earthquake
      const mesh1 = createRawShaderPlane('/Bwegt1.png', -3, 0, 15, -3, 0);
      scene.add(mesh1);
      imageMeshes.push(mesh1);

      // 2) Nass1
      const mesh2 = createRawShaderPlane('/Nass1.png', 3, 0, 11.5, 3, 0);
      scene.add(mesh2);
      imageMeshes.push(mesh2);

      // 3) Bwegt1 (erstes)
      const mesh3 = createRawShaderPlane('/Bwegt1.png', -3, 0, 7.5, -3, 0);
      scene.add(mesh3);
      imageMeshes.push(mesh3);

      // 4) Bwegt1 (zweites)
      const mesh4 = createRawShaderPlane('/Bwegt1.png', 3, 0, 3.5, 3, 0);
      scene.add(mesh4);
      imageMeshes.push(mesh4);

      // 5) Prog1Neu
      const mesh5 = createRawShaderPlane('/Prog1Neu.png', 3, 0, -1, 3, 0);
      scene.add(mesh5);
      imageMeshes.push(mesh5);
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
    const cameraStations = [20, 16.5, 13, 9.5, 5.5, 1];
    let currentStation = 0;

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

    // Anpassen, damit wir uniform "uOpacity" setzen können.
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

        // Hier setzen wir die uniform "uOpacity" im Shader.
        // (RawShaderMaterial nutzt keine "material.opacity".)
        mesh.material.uniforms.uOpacity.value = opacity;
      });
    }

    // Positions-Update wie gehabt.
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

    function animate() {
      requestAnimationFrame(animate);
      updateAllImages();
      updateImagePositions();
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

   -->