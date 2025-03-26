<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import HomeFooter from '$lib/components/HomeFooter.svelte';
  import Messageform from '$lib/components/Messageform.svelte';
  import HeaderHoverText from '$lib/components/HeaderHoverText.svelte';
  import BurgerMenu from '$lib/components/BurgerMenu.svelte';
  import ContactIcon from '$lib/components/ContactIcon.svelte';
  
  // Für Formular und UI-Steuerung
  let contactFormVisible = false;
  let isScrolling = false;
  
  // Fullpage.js Variablen
  let currentSection = 0;
  let fullpageApi;
  let currentCategory = null;

  // Liste der mehrsprachigen Begrüßungen
  const greetings = ["Hello.", "你好.", "Bonjour.", "Hallo.", "안녕하세요.", "Hola."];
  let currentGreeting = 0;
  let greetingText = greetings[0];
  let greetingInterval;
  
  // Kategorien und ihre Projekte
  const categories = {
    'design': {
      title: 'Design Work',
      projects: [
        {
          title: 'bwegt App Redesign',
          description: 'We redesigned the bwegt mobility app to improve usability simplify navigation and enhance realtime travel information for a seamless user experience.',
          image: '/altDesktop/Design1.png', // Neues Bild verwenden
          link: '/projectStatic/bwegt', // Geändert von '/project/nass' zu '/projectStatic/bwegt'
          tags: ['UX/UI Design', 'Mobile Design'],
          collaborators: ['Vivien Cai', 'Rebeka Tot', 'Franz Anhäupl']
        },
        {
          title: 'Nass Device',
          description: 'NASS is a portable water testing device with a simple E-Ink interface and open-data sharing, designed to make water quality analysis accessible.',
          image: '/altDesktop/Design2.png', 
          link: '/projectStatic/nass', // Angepasst für statische Version
          tags: ['Hardware Design', 'Interface Design'],
          collaborators: ['Jonas Wienberg', 'Philipp Maginot', 'Maria Kamenskaya', 'Franz Anhäupl']
        },
        {
          title: 'Ice Age Mammals',
          description: 'An interactive table using Reed sensors, a 3D-printed game piece, and projection mapping to let users explore the saber toothed tiger through playful interaction',
          image: '/altDesktop/Design3.png',
          link: '/projectStatic/iceAgeMammals', // Angepasst für statische Version
          tags: ['Interactive Design', '3D Modeling'],
          collaborators: ['Vivien Cai', 'Rebeka Tot', 'Franz Anhäupl']
        },
        {
          title: 'HYBRID Wallet',
          description: 'A smart wallet with NFC payment, LED feedback, fingerprint authentication and a companion app, blending digital and physical payments seamlessly.',
          image: '/altDesktop/Design4.png',
          link: '/projectStatic/hybridWallet', // Angepasst für statische Version
          tags: ['Product Design', 'App Development'],
          collaborators: ['Enes Cilingir', 'Moritz Beder', 'Franz Anhäupl']
        }
      ]
    },
    'code': {
      title: 'Code Work',
      projects: [
        {
          title: 'Global Missing Migrants',
          description: 'An interactive 3D globe visualizing migration data, highlighting routes, risk areas, and key patterns to reveal the human impact behind the numbers.',
          image: '/altDesktop/Code1.png',
          link: '/projectStatic/migrants',
          tags: ['Data Visualization', '3D Globe'],
          collaborators: ['Helen Frank', 'Maurice Cadau', 'Lisa-Marie Rapp', 'Franz Anhäupl']
        },
        {
          title: 'Karincruises.de',
          description: 'KarinCruises.de tracks my girlfriend’s cruise route in real-time with an interactive globe, live port updates, and AI-generated travel tips.',
          image: '/altDesktop/Code2.png',
          link: '/projectStatic/karincruises',
          tags: ['Real-time Tracking', 'AI Integration'],
          collaborators: ['Franz Anhäupl']
        },
        {
          title: 'Quattera',
          description: 'Three.js based interactive portfolio showcasing creative coding and WebGL capabilities.',
          image: '/altDesktop/Code3.png',
          link: '/projectStatic/game',
          tags: ['Three.js', 'WebGL'],
          collaborators: ['Franz Anhäupl']
        },
        {
          title: 'Earthquakes & Tsunami Data',
          description: 'Interactive visualizations of earthquake and tsunami data, including a 2D world map, 3D globe, timelines, and depth analysis with filtering and hover effects.',
          image: '/altDesktop/Code4.png',
          link: '/projectStatic/earthquake',
          tags: ['Data Analysis', 'Scientific Visualization'],
          collaborators: ['Franz Anhäupl']
        }
      ]
    },
    'website': {
      title: 'Website Work',
      projects: [
        {
          title: 'Zellerzahntechnik.de',
          description: 'I redesigned the Zeller Zahntechnik website with a mobile-first approach, modernizing the outdated old design.',
          image: '/altDesktop/Website1.png',
          link: '/projectStatic/website1',
          tags: ['Mobile-First Design', 'Dental Industry'],
          collaborators: ['Franz Anhäupl']
        },
        {
          title: 'Zentrum-pferd.com',
          description: 'I build a WordPress website for Zentrum Pferd, highlighting storytelling, usability and Instagram integration.',
          image: '/altDesktop/Website2.png',
          link: '/projectStatic/website2',
          tags: ['WordPress', 'Social Media Integration'],
          collaborators: ['Jens Kramer', 'Franz Anhäupl']
        }
      ]
    },
    'photo': {
      title: 'Photo & Video Work',
      projects: [
        {
          title: 'From Frames to Experiences',
          description: 'My passion for photography and hyperlapses shaped my eye for detail and storytelling.',
          image: '/altDesktop/photo-video.png',
          link: '/projectStatic/photovideo',
          tags: ['Commercial Photography', 'Commercial Videography'],
          collaborators: ['Franz Anhäupl']
        }
      ]
    },
    'about': {
      title: 'About Me',
      projects: [
        {
          title: 'About Franz',
          description: 'Between design systems, camera lenses, and coffee cups. This is how AI sees me. Want to know more?  📷 🧗 ',
          image: '/altDesktop/about-me.png',
          tags: ['Interactive Designer', 'Design Journey'],
          link: '/projectStatic/aboutme'
        }
      ]
    }
  };
  
  // Alle Projekte für Fullpage-Sektionen zusammenführen
  let allProjects = [];
  let sectionAnchors = ['intro'];

  function prepareProjects() {
    allProjects = [];
    sectionAnchors = ['intro'];
    
    if (!currentCategory) return;
    
    categories[currentCategory].projects.forEach((project, index) => {
      allProjects.push(project);
      sectionAnchors.push(`${currentCategory}-${index}`);
    });
    
    // Nach DOM-Update Fullpage neu initialisieren
    setTimeout(initFullPage, 100);
  }
  
  function selectCategory(category) {
    currentCategory = category;
    prepareProjects();
    
    // Nach Fullpage-Initialisierung zur ersten Projektseite scrollen
    setTimeout(() => {
      if (fullpageApi) {
        fullpageApi.moveTo(2);
      }
    }, 300);
  }
  
  function scrollToTop() {
    if (fullpageApi) {
      fullpageApi.moveTo(1);
    }
  }
  
  function initFullPage() {
    // Globale Variablen prüfen - typisch für externe JS-Bibliotheken
    if (typeof window === 'undefined' || !window.fullpage) {
      console.error('fullpage.js nicht geladen');
      return;
    }
    
    // Zuerst zerstören, falls es bereits initialisiert wurde
    if (fullpageApi) {
      fullpageApi.destroy('all');
    }
    
    // Dann neu initialisieren
    const fullpage = new window.fullpage('#fullpage', {
      // Bestehende Optionen beibehalten
      anchors: sectionAnchors,
      navigation: true,
      navigationPosition: 'right',
      navigationTooltips: sectionAnchors,
      scrollingSpeed: 1000,
      css3: true,
      
      // Wichtig für Safari-Kompatibilität
      easing: 'easeInOutCubic',
      easingcss3: 'ease',
      
      // Rundlauf-Funktion aktivieren
      loopBottom: true,  // Von letzter Sektion zur ersten scrollen
      // loopTop: false,  // Optional: Von erster Sektion zur letzten scrollen
      
      // Callback-Funktionen
      afterLoad: function(origin, destination, direction) {
        currentSection = destination.index;
        isScrolling = false;
      },
      onLeave: function(origin, destination, direction) {
        isScrolling = true;
      }
    });
    
    fullpageApi = window.fullpage_api;
  }
  
  // Neue Variablen für Partikel-System
  let particles = [];
  let particleContainer;
  
  // Partikel-Systemfunktionen
  function createParticle(x, y) {
    return {
      x,
      y,
      size: Math.random() * 3 + 1, // Etwas kleinere Partikel
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      life: 80, // Etwas kürzere Lebensdauer
      color: `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})` // Weiße Partikel mit Transparenz
    };
  }
  
  function updateParticles() {
    // Bewege Partikel
    particles = particles.map(p => ({
      ...p,
      x: p.x + p.speedX,
      y: p.y + p.speedY,
      life: p.life - 1
    })).filter(p => p.life > 0);
    
    // Zeichne Partikel
    if (particleContainer) {
      const ctx = particleContainer.getContext('2d');
      ctx.clearRect(0, 0, particleContainer.width, particleContainer.height);
      
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    // Rufe nächsten Frame auf
    requestAnimationFrame(updateParticles);
  }
  
  function handleMouseMove(event) {
    // Partikel an Mausposition erzeugen
    if (Math.random() > 0.7) {
      particles.push(createParticle(event.clientX, event.clientY));
    }
  }
  
  onMount(() => {
    // Begrüßungs-Animation starten
    greetingInterval = setInterval(() => {
      const greetingElement = document.querySelector('.greeting-text');
      if (greetingElement) {
        greetingElement.style.opacity = '0';
        
        setTimeout(() => {
          currentGreeting = (currentGreeting + 1) % greetings.length;
          greetingText = greetings[currentGreeting];
          greetingElement.style.opacity = '1';
        }, 500);
      }
    }, 2500);
    
    // fullpage.js dynamisch laden (kostenlose Version)
    const loadFullPage = () => {
      return new Promise((resolve) => {
        // Stylesheet einbinden
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/fullpage.js/dist/fullpage.min.css';
        document.head.appendChild(cssLink);
        
        // JavaScript einbinden
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/fullpage.js/dist/fullpage.min.js';
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };
    
    // Laden und initialisieren
    loadFullPage().then(() => {
      initFullPage();
    });
    
    // Canvas für Partikel-Animation initialisieren
    if (particleContainer) {
      particleContainer.width = window.innerWidth;
      particleContainer.height = window.innerHeight;
      requestAnimationFrame(updateParticles);
      
      // Event-Listener für Mausbewegung
      document.addEventListener('mousemove', handleMouseMove);
      
      // Event-Listener für Window-Resize
      const handleResize = () => {
        if (particleContainer) {
          particleContainer.width = window.innerWidth;
          particleContainer.height = window.innerHeight;
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        // Bestehende Cleanup-Funktionen...
        clearInterval(greetingInterval);
        if (fullpageApi) {
          fullpageApi.destroy('all');
        }
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
      };
    }
  });
</script>

<!-- Hidden H1 für SEO -->
<h1 class="sr-only">Franz - Interaction Designer & Creative Developer Portfolio</h1>

<!-- Füge das Canvas-Element direkt nach dem <h1 class="sr-only">...</h1> ein -->
<canvas 
    bind:this={particleContainer} 
    class="particle-canvas"
></canvas>

<!-- Header-Komponente -->
<HeaderHoverText />

<!-- Zurück-zur-3D-Version Button -->
<a href="/" class="version-toggle">Go to 3D Version</a>

<!-- Kontakt-Icon-Komponente -->
<ContactIcon on:open={() => contactFormVisible = true} />

<!-- Burger-Menü-Komponente -->
<BurgerMenu />

<!-- Kontaktformular-Komponente -->
<Messageform visible={contactFormVisible} on:close={() => contactFormVisible = false} />

<!-- Zurück-nach-oben-Button, sichtbar wenn nicht in Intro-Sektion -->
{#if currentSection > 0}
  <button 
    class="back-to-top" 
    on:click={scrollToTop} 
    transition:fade={{duration: 200}}
    aria-label="Zurück nach oben"
  >
    ↑
  </button>
{/if}

<div id="fullpage">
  <!-- Intro-Sektion: Das fehlerhafte {/if} wurde entfernt -->
  <div class="section intro-section" data-anchor="intro">
    <div class="content-wrapper">
      <div class="intro-text">
        <div class="greeting-container">
          <span class="greeting-text">{greetingText}</span>
        </div>
        <h2 class="heading-large">I'm Franz</h2>
        <p class="intro-description">
          an interaction-design student passionated about crafting intuitive and enganging digital experiences.
          Currently looking for an internship.
        </p>
      </div>

      <!-- Scroll-Indikator VOR den Kategorie-Toggles -->
      {#if !currentCategory}
        <div class="scroll-indicator category-header">
          <span>Select a category to explore</span>
          <div class="arrow-down"></div>
        </div>
      {:else}
        <div class="category-header">
          <span>Selected: {categories[currentCategory].title}</span>
        </div>
      {/if}

      <!-- Kategorie-Toggle-Buttons -->
      <div class="category-toggles">
        <button 
          class="category-toggle {currentCategory === 'design' ? 'active' : ''}" 
          on:click={() => selectCategory('design')}
        >
          Design Work
        </button>
        <button 
          class="category-toggle {currentCategory === 'code' ? 'active' : ''}" 
          on:click={() => selectCategory('code')}
        >
          Code Work
        </button>
        <button 
          class="category-toggle {currentCategory === 'website' ? 'active' : ''}" 
          on:click={() => selectCategory('website')}
        >
          Website Work
        </button>
        <button 
          class="category-toggle {currentCategory === 'photo' ? 'active' : ''}" 
          on:click={() => selectCategory('photo')}
        >
          Photo & Video
        </button>
        <button 
          class="category-toggle {currentCategory === 'about' ? 'active' : ''}" 
          on:click={() => selectCategory('about')}
        >
          About Me
        </button>
      </div>
      
    </div>
    <div class="blur-gradient"></div>
  </div>

  <!-- Dynamisch generierte Projekt-Sektionen mit individuellen Inhalten -->
  {#if currentCategory && allProjects.length > 0}
    {#each allProjects as project, i}
      <div class="section project-section" data-anchor="{currentCategory}-{i}">
        <div class="content-wrapper grid-container">
          <!-- Projekt 1/3: Inhalt links, Bild rechts -->
          {#if i === 0 || i === 2}
            <div class="project-content left-content">
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              
              <div class="content-divider"></div>
              <div class="tags">
                {#each project.tags as tag}
                  <div class="tag">{tag}</div>
                {/each}
              </div>
              
              <!-- Collaborators nur für bestimmte Kategorien anzeigen -->
              {#if currentCategory !== 'photo' && currentCategory !== 'about'}
                <div class="content-divider"></div>
                <div class="collaborators">
                  <h4>Collaborators</h4>
                  <div class="collaborators-list">
                    {#each project.collaborators as collaborator}
                      <div class="collaborator">{collaborator}</div>
                    {/each}
                  </div>
                </div>
              {/if}
              
              <a href={project.link} class="project-button">Open Project</a>
            </div>
            
            <!-- Bild rechts -->
            <div class="project-image right-image">
              <img src={project.image} alt={project.title} />
            </div>
          <!-- Projekt 2/4: Bild links, Inhalt rechts -->
          {:else}
            <div class="project-image left-image">
              <img src={project.image} alt={project.title} />
            </div>
            
            <div class="project-content right-content">
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              
              <div class="content-divider"></div>
              <div class="tags">
                {#each project.tags as tag}
                  <div class="tag">{tag}</div>
                {/each}
              </div>
              
              <!-- Collaborators nur für bestimmte Kategorien anzeigen -->
              {#if currentCategory !== 'photo' && currentCategory !== 'about'}
                <div class="content-divider"></div>
                <div class="collaborators">
                  <h4>Collaborators</h4>
                  <div class="collaborators-list">
                    {#each project.collaborators as collaborator}
                      <div class="collaborator">{collaborator}</div>
                    {/each}
                  </div>
                </div>
              {/if}
              
              <a href={project.link} class="project-button">Open Project</a>
            </div>
          {/if}
        </div>
        <div class="blur-gradient"></div>
      </div>
    {/each}
  {/if}
</div>

<!-- Footer als permanentes Overlay -->
<div class="footer-overlay">
  <HomeFooter />
</div>

<style>
  /* Font-Definitionen aus der Projektseite einbinden */
  @font-face {
    font-family: 'Franz-Plex';
    src: url('/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'Franz-Grotesk';
    src: url('/fonts/Space_Grotesk/static/SpaceGrotesk-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  /* Ergänze die fette Variante von Franz-Plex für bessere Darstellung */
  @font-face {
    font-family: 'Franz-Plex';
    src: url('/fonts/IBM_Plex_Mono/IBMPlexMono-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  :global(html) {
    overflow: hidden;
    height: 100%;
  }
  
  :global(body) {
    height: 100%;
    overflow: hidden;
  }
  
  /* Grundlegendes Styling */
  :global(.section) {
    position: relative;
    background-color: #01031A;
    color: #fff;
    font-family: 'Franz-Plex', monospace; /* Geändert zu Franz-Plex */
  }
  
  /* Zurück-nach-oben-Button neu gestaltet */
  .back-to-top {
    position: fixed;
    bottom: 60px;
    right: 45px;
    z-index: 100;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%; /* Rundes Design */
    width: 50px;
    height: 50px;
    font-size: 20px; /* Größeres Pfeilsymbol */
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center; /* Zentriert den Pfeil */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Leichter Schatten für Tiefe */
  }
  
  .back-to-top:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }
  
  /* Für Mobilgeräte etwas kleiner */
  @media (max-width: 768px) {
    .back-to-top {
      width: 50px;
      height: 50px;
      font-size: 18px;
      bottom: 30px;
      right: 10px;
    }
  }
  
  /* Version-Toggle */
  .version-toggle {
    position: fixed;
    top: 70px;
    left: 28px;
    z-index: 100;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    padding: 12px 18px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: inline-block;
  }
  
  .version-toggle:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-2px);
  }
  
  /* Intro-Sektion */
  .intro-section {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative; /* Wichtig für absolute Positionierung der Kategorie-Toggles */
    height: 100vh; /* Sicherstellen, dass die Sektion immer die volle Höhe einnimmt */
  }
  
  .content-wrapper {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    z-index: 5;
    position: relative;
    height: 100%; /* Volle Höhe für bessere Positionierung */
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .intro-text {
    max-width: 800px;
    text-align: left;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 4rem; /* Mehr Abstand zur Kategorie-Leiste */
    margin-left: 2rem; /* Neuer Wert: Text nach rechts verschieben */
    align-self: flex-start; /* Linksbündig am Container ausrichten */
  }
  
  /* Styling für die Begrüßung */
  .greeting-container {
    margin-bottom: 1rem;
    height: 5rem;
    display: flex;
    align-items: center;
  }
  
  .greeting-text {
    font-size: 4.5rem;
    font-weight: 700;
    color: #fff;
    transition: opacity 0.5s ease;
    font-family: 'Franz-Plex', monospace; /* Von Franz-Grotesk zu Franz-Plex geändert */
  }
  
  /* Optional: Schriftgröße anpassen, da Mono-Fonts oft breiter erscheinen */
  @media (max-width: 768px) {
    .greeting-text {
      font-size: 1.8rem; /* Etwas kleiner für Mobilgeräte */
    }
  }
  
  /* Überschriften-Styling */
  .heading-large {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    letter-spacing: -1px;
    font-family: 'Franz-Plex', monospace; /* Geändert zu Franz-Grotesk */
  }
  
  .intro-description {
    font-size: 1.3rem;
    line-height: 1.7;
    margin-top: 0rem;
    margin-bottom: 2rem;
    max-width: 700px;
    text-align: left;
    margin-left: 0;
    padding-left: 0;
    font-family: 'Franz-Plex', monospace; /* Geändert zu Franz-Plex */
  }
  
  /* Kategorie-Toggles */
  .category-toggles {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
    justify-content: flex-start; /* Links ausrichten */
    position: flex; /* Absolut positionieren */
    bottom: 18%; /* Im unteren Drittel platzieren */
    left: 0;
    right: 0;
    padding: 0 2rem;
    margin-top: 2.5rem;
    justify-content: center;
  }
  
  .category-toggle {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Franz-Plex', monospace;
    flex-grow: 0; /* Nicht automatisch wachsen */
    margin-bottom: 8px; /* Abstand zwischen Reihen beim Umbrechen */
  }
  
  .category-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .category-toggle.active {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  /* Scroll-Indikator */
  .scroll-indicator {
    margin-top: 1rem;
    opacity: 0.7;
    animation: fadeInOut 2s infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    position: flex;
    bottom: 50px;
    left: 0;
    right: 0;
  }
  
  .arrow-down {
    width: 20px;
    height: 20px;
    border-right: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(45deg);
    margin-top: 10px;
  }
  
  @keyframes fadeInOut {
    0% { opacity: 0.3; transform: translateY(0); }
    50% { opacity: 0.7; transform: translateY(10px); }
    100% { opacity: 0.3; transform: translateY(0); }
  }
  
  /* Projekt-Sektion */
  .project-section {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #01031A; /* Hintergrundfarbe statt Hintergrundbild */
  }
  
  .project-content {
    position: relative;
    z-index: 5;
    padding: 40px;
    background: transparent; 
    backdrop-filter: none;
    border-radius: 0;
    text-align: left;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  /* Entferne das pseudo-Element und den Border-left vom Text */
  .project-content::before {
    content: none;
  }
  
  .project-content h2 {
    font-size: 2.5rem;
    margin-bottom: 2.5rem; /* Erhöhter Abstand: von 0 auf 2.5rem */
    font-weight: 700;
    text-align: left;
    font-family: 'Franz-Grotesk', sans-serif;
    color: #FFFFFF;
    position: relative; /* Für z-index */
    z-index: 2; /* Über der Linie */
    width: 100%; /* Volle Breite */
  }
  
  .project-content p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2.5rem; /* Erhöhter Abstand: von 0 auf 2.5rem */
    margin-top: 0; /* Null Margin oben, da wir die Linie separat platzieren */
    text-align: left;
    font-family: 'Franz-Plex', monospace;
    position: relative; /* Für z-index */
    z-index: 2; /* Über der Linie */
    padding-left: 0; /* Kein Padding mehr */
    border-left: none; /* Keine Linie mehr am Text */
    margin-left: 0; /* Kein Abstand mehr */
    width: 100%; /* Volle Breite */
  }
  
  .project-button {
    display: inline-block;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    text-decoration: none;
    padding: 12px 32px;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.3);
    text-align: center;
    font-family: 'Franz-Plex', monospace;
    margin-left: 0; /* Kein Abstand mehr */
    position: relative; /* Für z-index */
    z-index: 2; /* Über der Linie */
    align-self: flex-start; /* Linksbündig statt zentriert */
  }
  
  /* Grid-Container für 8 Spalten */
  .grid-container {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 40px; /* Größerer Abstand zwischen Inhalt und Bild */
    width: 100%;
    max-width: 1400px;
    padding: 0 2rem;
  }
  
  /* Linke 3 Spalten */
  .left-content {
    grid-column: 1 / span 4; /* Linke 4 Spalten */
  }
  
  /* Rechte 3 Spalten */
  .right-content {
    grid-column: 5 / span 4; /* Rechte 4 Spalten */
  }
  
  /* Bild links */
  .left-image {
    grid-column: 1 / span 4; /* Linke 4 Spalten */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Bild rechts */
  .right-image {
    grid-column: 5 / span 4; /* Rechte 4 Spalten */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Bild-Styling */
  .project-image img {
    width: 100%;
    height: auto;
    max-height: 75vh;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  /* Screen reader only class für verstecktes H1 */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  /* Responsive Design */
  @media (max-width: 992px) {
    .category-toggles {
      justify-content: center; /* Auf mittleren Bildschirmen zentrieren */
    }
    
    .category-toggle {
      flex-basis: calc(33.33% - 16px); /* Ungefähr 3 pro Zeile mit Berücksichtigung des Gaps */
      text-align: center;
    }
    
    .project-content {
      max-width: 90%;
      padding: 30px;
    }
    
    .project-content h2 {
      font-size: 2rem;
    }
    
    .left-content, .right-content, .left-image, .right-image {
      grid-column: 2 / span 6; /* Bei schmalen Bildschirmen zentriert mit etwas Rand */
    }
    
    /* Bei mittleren Bildschirmen Reihenfolge ändern */
    .grid-container {
      grid-template-rows: auto auto;
      row-gap: 40px;
    }
    
    /* Bild immer über dem Inhalt anzeigen */
    .project-image {
      grid-row: 1;
    }
    
    .project-content {
      grid-row: 2;
    }
  }
  
  @media (max-width: 768px) {
    .greeting-text {
      font-size: 2rem;
    }
    
    .heading-large {
      font-size: 2.5rem;
    }
    
    .intro-description {
      font-size: 1.1rem;
    }
    
    .category-toggle {
      flex-basis: calc(50% - 16px); /* 2 pro Zeile auf kleineren Bildschirmen */
    }
    
    .project-content {
      max-width: 95%;
      padding: 20px;
    }
    
    .project-content h2 {
      font-size: 1.7rem;
    }
    
    .project-content p {
      font-size: 1rem;
    }
    
    .left-content, .right-content, .left-image, .right-image {
      grid-column: 1 / span 8; /* Bei sehr schmalen Bildschirmen volle Breite */
    }
    
    .project-image img {
      max-height: 50vh;
    }
    
    .project-content::before {
      left: 20px;
      height: calc(100% - 180px);
    }
    
    .project-content h2 {
      margin-bottom: 2rem;
    }
    
    .project-content p {
      padding-left: 15px;
      margin-left: 15px;
    }
    
    .project-button {
      margin-left: 15px;
    }
  }
  
  @media (max-width: 480px) {
    .category-toggle {
      flex-basis: 100%; /* 1 pro Zeile auf sehr kleinen Bildschirmen */
    }
  }
  
  /* Neue Styles für die Navigation */
  .section-navigation {
    position: fixed;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 100;
  }
  
  .nav-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .nav-dot:hover {
    background-color: rgba(255, 255, 255, 0.7);
    transform: scale(1.2);
  }
  
  .nav-dot.active {
    background-color: rgba(255, 255, 255, 0.9);
  }
  
  /* Vollbild-Sektion anpassen */
  .section {
    min-height: auto; /* Statt 100vh - fullpage.js handhabt dies selbst */
    scroll-snap-align: none; /* Entferne, da fullpage.js dies übernimmt */
  }
  
  /* Modifizierte Styles für das Fullpage-Container */
  #fullpage {
    overflow-y: visible; /* Zurücksetzen zur Standardeinstellung */
    height: auto; /* Zurücksetzen zur Standardeinstellung */
    scroll-snap-type: none; /* Entferne, da fullpage.js dies übernimmt */
  }

  /* Footer als permanentes Overlay */
  .footer-overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50; /* Hoch genug für Inhalte, aber niedriger als Navigation/Header */
    background: rgba(1, 3, 26, 0.7); /* Transparenter Hintergrund, der zum Design passt */
    backdrop-filter: blur(5px); /* Optional: leichter Blur-Effekt */
  }
  
  /* Bei kleineren Bildschirmen Footer anpassen */
  @media (max-width: 768px) {
    .footer-overlay {
      background: rgba(1, 3, 26, 0.9); /* Weniger Transparenz auf kleinen Geräten */
    }
  }

  /* Styles für fullpage.js anpassen */
  :global(.fp-watermark) {
    display: none !important; /* Optional: Versucht, das Wasserzeichen zu verbergen */
  }
  
  :global(.fp-tooltip) {
    color: white !important;
    background: rgba(0, 0, 0, 0.7);
    padding: 5px 10px;
    border-radius: 4px;
    font-family: 'Franz-Plex', monospace;
  }

  /* Kategorie-Header über den Buttons */
  .category-header {
    margin-bottom: 1.5rem;
    text-align: center;
    width: 100%;
  }
  
  /* Scroll-Indikator anpassen */
  .scroll-indicator {
    opacity: 0.7;
    animation: fadeInOut 2s infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem; /* Mehr Abstand zum Text */
    margin-bottom: 1rem; /* Weniger Abstand zu den Kategorien */
  }

  /* Dünne Trennlinie für Projekt-Content-Bereiche */
  .content-divider {
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 1.5rem 0;
  }
  
  /* Tag-Styling wie in der migrants-Seite */
  .tags {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 0.7rem;
    margin: 1.2rem 0;
  }
  
  .tag {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: rgba(27, 29, 58, 0.6);
    border-radius: 9999px;
    color: #fff;
    font-size: 0.9rem;
    font-family: 'Franz-Plex', monospace;
  }
  
  /* Collaborators-Bereich */
  .collaborators {
    margin: 1.2rem 0 2rem 0;
    width: 100%;
  }
  
  .collaborators h4 {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.8rem;
    font-family: 'Franz-Plex', monospace;
    font-weight: 400;
  }
  
  .collaborators-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .collaborator {
    color: white;
    font-family: 'Franz-Plex', monospace;
    font-size: 0.9rem;
  }
  
  /* Responsiveness für neue Elemente */
  @media (max-width: 768px) {
    .tags {
      display: none;
    }
    
    .content-divider {
      display: none;
    }
    
    .collaborators {
      margin: 1rem 0 1.5rem 0;
    }
    
    .collaborators-list {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  /* fullpage.js Navigationspunkte weiß einfärben */
  :global(#fp-nav ul li a span),
  :global(.fp-slidesNav ul li a span) {
    background-color: rgb(122, 122, 122) !important; /* Weißer Punkt */
    border-color: rgb(122, 122, 122) !important; /* Weißer Rahmen */
  }
  
  :global(#fp-nav ul li a.active span),
  :global(.fp-slidesNav ul li a.active span) {
    background-color: white !important; /* Aktiver Punkt auch weiß */
    transform: scale(1) !important; /* Aktiver Punkt etwas größer */
  }
  
  :global(#fp-nav ul li .fp-tooltip) {
    color: white !important; /* Tooltip-Text weiß */
  }
  
  :global(#fp-nav ul li .fp-sr-only) {
    color: white !important; /* Screen-Reader-Text weiß (falls sichtbar) */
  }
  
  /* Optional: Bessere Sichtbarkeit auf dunklem Hintergrund */
  :global(#fp-nav) {
    background: rgba(0, 0, 0, 0.2); /* Leicht transparenter Hintergrund */
    border-radius: 15px; /* Abgerundete Ecken */
    padding: 5px; /* Etwas Innenabstand */
  }

  /* Medienabfrage für mobile Geräte anpassen */
  @media (max-width: 768px) {
    /* Bestehende Styles bleiben unverändert... */
    
    /* Tags auf mobilen Geräten ausblenden */
    .tags {
      display: none;
    }
    
    /* Trennlinien auf mobilen Geräten ausblenden */
    .content-divider {
      display: none;
    }
    
    /* Collaborators in 2 Spalten anordnen */
    .collaborators-list {
      display: grid;
      grid-template-columns: 1fr 1fr; /* 2 Spalten mit gleicher Breite */
      gap: 0.5rem 1rem; /* Vertikaler und horizontaler Abstand */
      flex-direction: unset; /* Überschreibt die bestehende column-Eigenschaft */
    }
    
    /* Sicherstellen, dass die Namen gut lesbar bleiben */
    .collaborator {
      font-size: 0.85rem; /* Etwas kleinere Schrift für bessere Passform */
      white-space: nowrap; /* Verhindert Zeilenumbrüche innerhalb der Namen */
      overflow: hidden;
      text-overflow: ellipsis; /* Falls Namen zu lang sind */
    }
    
    /* Collaborators-Überschrift anpassen */
    .collaborators h4 {
      margin-bottom: 0.5rem; /* Weniger Abstand zur Liste */
    }
    
    /* Abstand nach unten zum Button reduzieren */
    .collaborators {
      margin-bottom: 1.2rem;
    }

    /* Verkleinerte Abstände */
    .project-content h2 {
      margin-bottom: 1.2rem; /* Reduziert von 2rem */
      font-size: 1.7rem;
    }
    
    .project-content p {
      font-size: 1rem;
      margin-bottom: 1.5rem; /* Reduziert von 2.5rem */
      padding-left: 0;     /* Entfernt unerwünschtes Padding */
      margin-left: 0;      /* Entfernt unerwünschten Margin */
    }
    
    /* Button zentrieren */
    .project-button {
      margin-left: 0;      /* Entfernt den linken Margin */
      align-self: center;  /* Zentriert den Button */
      width: 80%;          /* Breiter Button für bessere mobile Bedienung */
    }
    
    /* Kleinere Abstände für Collaborators */
    .collaborators {
      margin: 0.8rem 0 1.2rem 0; /* Reduziert Abstände oben und unten */
    }
    
    .collaborators h4 {
      margin-bottom: 0.5rem; /* Bereits klein, beibehalten */
    }
    
    /* Kleinerer Abstand zwischen den Collaborator-Zeilen */
    .collaborators-list {
      gap: 0.4rem 1rem; /* Vertikaler Abstand reduziert */
    }
  }

  /* Zusätzliche Anpassung für sehr kleine Bildschirme */
  @media (max-width: 480px) {
    .project-button {
      width: 100%; /* Volle Breite auf sehr kleinen Bildschirmen */
    }
  }
  
  /* Noch kleinere Bildschirme (z.B. schmale Smartphones) */
  @media (max-width: 480px) {
    /* Bei sehr schmalen Geräten zurück zur einspaltigen Ansicht */
    .collaborators-list {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    /* Bestehende Styles... */
    
    /* Intro-Text weiter nach unten verschieben */
    .intro-text {
      margin-top: 25vh; /* Verschiebt den Text nach unten */
      margin-bottom: 2rem; /* Weniger Abstand nach unten */
      margin-left: 1.5rem; /* Leichter Rand links */
      align-self: flex-start; /* Linksbündig am Container ausrichten */
      text-align: left; /* Text linksbündig */
    }
    
    /* Greeting Container anpassen - linksbündig */
    .greeting-container {
      justify-content: flex-start; /* Linksbündig ausrichten */
      margin-bottom: 0.5rem; /* Weniger Abstand */
      height: 3rem; /* Kleinere Höhe */
    }
    
    /* Überschrift und Beschreibung anpassen - linksbündig */
    .heading-large {
      text-align: left;
      margin-bottom: 1rem;
    }
    
    .intro-description {
      text-align: left;
      margin-bottom: 1.5rem;
      max-width: 90%; /* Verhindert, dass der Text zu breit wird */
    }
    
    /* Rest der Styles bleibt unverändert... */
  }

  /* Für sehr kleine Bildschirme */
  @media (max-width: 480px) {
    .intro-text {
      margin-left: 1rem; /* Etwas weniger Rand auf sehr kleinen Geräten */
      margin-top: 15vh; /* Etwas weniger nach unten */
    }
  }

  @media (max-width: 768px) {
    /* Bestehende Styles... */
    
    /* Intro-Text weiter nach unten verschieben */
    .intro-text {
      margin-top: 25vh; /* Verschiebt den Text nach unten */
      margin-bottom: 2rem; /* Weniger Abstand nach unten */
      margin-left: 0; /* Zentriert auf mobilen Geräten */
      align-self: center; /* Zentriert auf mobilen Geräten */
      text-align: center; /* Text zentrieren */
    }
    
    /* Greeting Container anpassen */
    .greeting-container {
      justify-content: left; /* Zentriert die Grußnachricht */
      margin-bottom: 0.5rem; /* Weniger Abstand */
      height: 3rem; /* Kleinere Höhe */
    }
    
    /* Überschrift und Beschreibung anpassen */
    .heading-large {
      text-align: left;
      margin-bottom: 1rem;
    }
    
    .intro-description {
      text-align: left;
      margin-bottom: 1.5rem;
    }
    
    /* Kategorie-Toggles verbessern */
    .category-toggles {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Genau 2 Spalten */
      gap: 12px; /* Kleinerer Abstand */
      width: 90%; /* Etwas schmaler als der Container */
      margin-top: 2rem; /* Mehr Abstand zum Text */
      padding: 0;
    }
    
    .category-toggle {
      flex-basis: auto; /* Zurücksetzen des flex-basis */
      margin-bottom: 0; /* Grid-Gap übernimmt den Abstand */
      padding: 10px 15px; /* Etwas kompakter */
      font-size: 0.9rem; /* Kleinere Schrift */
      width: 100%; /* Volle Breite in der Grid-Zelle */
    }
    
    /* Category-Header anpassen */
    .category-header {
      margin-bottom: 1rem; /* Weniger Abstand */
    }
    
    /* Scroll-Indikator anpassen */
    .scroll-indicator {
      margin-top: 1.5rem;
      margin-bottom: 0.7rem;
    }
  }
  
  /* Für sehr kleine Bildschirme einspaltiges Layout */
  @media (max-width: 480px) {
    .category-toggles {
      grid-template-columns: 1fr; /* Einspaltiges Layout */
    }
    
    .intro-text {
      margin-top: 15vh; /* Etwas weniger nach unten auf sehr kleinen Geräten */
    }
  }

  /* Bestehende Styles... */
  
  /* Partikel-Canvas */
  .particle-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1; /* Über dem Hintergrund, aber unter dem Inhalt */
    pointer-events: none; /* Erlaubt Interaktionen mit Elementen dahinter */
  }
</style>