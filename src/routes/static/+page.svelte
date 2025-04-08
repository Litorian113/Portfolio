<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import HomeFooter from '$lib/components/HomeFooter.svelte';
  import Messageform from '$lib/components/Messageform.svelte';
  import HeaderHoverText from '$lib/components/HeaderHoverText.svelte';
  import BurgerMenu from '$lib/components/BurgerMenu.svelte';
  import ContactIcon from '$lib/components/ContactIcon.svelte';

  // Import Fullpage.js
  import 'fullpage.js/dist/fullpage.min.css';
  import fullpage from 'fullpage.js';
  
  // Form and UI control variables
  let contactFormVisible = false;
  let isScrolling = false;
  
  // Fullpage.js variables
  let currentSection = 0;
  let fullpageApi;
  let currentCategory = 'design';

  // List of multilingual greetings
  const greetings = ["Hello.", "你好.", "Bonjour.", "Hallo.", "안녕하세요.", "Hola."];
  let currentGreeting = 0;
  let greetingText = greetings[0];
  let greetingInterval;
  
  // Categories and their projects
  const categories = {
    'design': {
      title: 'Design Work',
      projects: [
        {
          title: 'bwegt App Redesign',
          description: 'We redesigned the bwegt mobility app to improve usability simplify navigation and enhance realtime travel information for a seamless user experience.',
          image: '/altDesktop/Design1.png',
          link: '/projectStatic/bwegt',
          anchor: 'bwegt',
          tags: ['UX/UI Design', 'Mobile Design'],
          collaborators: ['Vivien Cai', 'Rebeka Tot', 'Franz Anhäupl']
        },
        {
          title: 'Nass Device',
          description: 'NASS is a portable water testing device with a simple E-Ink interface and open-data sharing, designed to make water quality analysis accessible.',
          image: '/altDesktop/Design2.png', 
          link: '/projectStatic/nass',
          anchor: 'nass-device',
          tags: ['Hardware Design', 'Interface Design'],
          collaborators: ['Jonas Wienberg', 'Philipp Maginot', 'Maria Kamenskaya', 'Franz Anhäupl']
        },
        {
          title: 'Ice Age Mammals',
          description: 'An interactive table using Reed sensors, a 3D-printed game piece, and projection mapping to let users explore the saber toothed tiger through playful interaction',
          image: '/altDesktop/Design3.png',
          link: '/projectStatic/iceAgeMammals',
          anchor: 'ice-age-mammals',
          tags: ['Interactive Design', '3D Modeling'],
          collaborators: ['Vivien Cai', 'Rebeka Tot', 'Franz Anhäupl']
        },
        {
          title: 'HYBRID Wallet',
          description: 'A smart wallet with NFC payment, LED feedback, fingerprint authentication and a companion app, blending digital and physical payments seamlessly.',
          image: '/altDesktop/Design4.png',
          link: '/projectStatic/hybridWallet',
          anchor: 'hybrid-wallet',
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
          anchor: 'data-viz',
          tags: ['Data Visualization', '3D Globe'],
          collaborators: ['Helen Frank', 'Maurice Cadau', 'Lisa-Marie Rapp', 'Franz Anhäupl']
        },
        {
          title: 'Karincruises.de',
          description: 'KarinCruises.de tracks my girlfriends cruise route in real-time with an interactive globe, live port updates, and AI-generated travel tips.',
          image: '/altDesktop/Code2.png',
          link: '/projectStatic/karincruises',
          anchor: 'karincruises',
          tags: ['Real-time Tracking', 'AI Integration'],
          collaborators: ['Franz Anhäupl']
        },
        {
          title: 'Quattera',
          description: 'Three.js based interactive portfolio showcasing creative coding and WebGL capabilities.',
          image: '/altDesktop/Code3.png',
          link: '/projectStatic/game',
          anchor: 'game',
          tags: ['Three.js', 'WebGL'],
          collaborators: ['Franz Anhäupl']
        },
        {
          title: 'Earthquakes & Tsunami Data',
          description: 'Interactive visualizations of earthquake and tsunami data, including a 2D world map, 3D globe, timelines, and depth analysis with filtering and hover effects.',
          image: '/altDesktop/Code4.png',
          link: '/projectStatic/earthquake',
          anchor: 'earthquakes-and-tsunami-data',
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
          anchor: 'website-1',
          tags: ['Mobile-First Design', 'Dental Industry'],
          collaborators: ['Franz Anhäupl']
        },
        {
          title: 'Zentrum-pferd.com',
          description: 'I build a WordPress website for Zentrum Pferd, highlighting storytelling, usability and Instagram integration.',
          image: '/altDesktop/Website2.png',
          link: '/projectStatic/website2',
          anchor: 'website-2',
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
          anchor: 'photo-video',
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
          anchor: 'about-me',
          link: '/projectStatic/aboutme'
        }
      ]
    }
  };
  
  // Prepare projects for fullpage sections
  let allProjects = [];
  let sectionAnchors = ['intro'];

  function prepareProjects() {
    allProjects = [];
    sectionAnchors = ['intro'];
    
    if (!currentCategory) return;
    
    categories[currentCategory].projects.forEach((project) => {
      allProjects.push(project);
      // Use the specific anchor or generate a fallback
      sectionAnchors.push(project.anchor || `${currentCategory}-${allProjects.length-1}`);
    });
    
    // Initialize fullpage.js after DOM update
    setTimeout(initFullPage, 100);
  }
  
  // Initialize projects in script section
  prepareProjects();
  
  function selectCategory(category) {
    currentCategory = category;
    prepareProjects();
    
    // Scroll to first project page after fullpage initialization
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
  
  // Initialize fullpage.js with configuration
  function initFullPage() {
    // Destroy first if already initialized
    if (fullpageApi) {
      fullpageApi.destroy('all');
    }
    
    // Initialize with license key directly in options
    const fullpageInstance = new fullpage('#fullpage', {
      licenseKey: 'NY3B6-D9AK9-K2SL6-J659H-BKYKN',
      anchors: sectionAnchors,
      navigation: true,
      navigationPosition: 'right',
      navigationTooltips: sectionAnchors,
      scrollingSpeed: 1000,
      css3: true,
      responsiveWidth: 768,
      easing: 'easeInOutCubic',
      easingcss3: 'ease',
      loopBottom: true,
      afterLoad: function(origin, destination, direction) {
        currentSection = destination.index;
        isScrolling = false;
      },
      onLeave: function(origin, destination, direction) {
        isScrolling = true;
      }
    });
    
    fullpageApi = fullpageInstance;
  }
  
  // Particle system variables
  let particles = [];
  let particleContainer;
  
  // Particle system functions
  function createParticle(x, y) {
    return {
      x,
      y,
      size: Math.random() * 3 + 1, // Slightly smaller particles
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      life: 80, // Shorter lifespan
      color: `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})` // White particles with transparency
    };
  }
  
  // Update and render particles
  function updateParticles() {
    // Move particles
    particles = particles.map(p => ({
      ...p,
      x: p.x + p.speedX,
      y: p.y + p.speedY,
      life: p.life - 1
    })).filter(p => p.life > 0);
    
    // Draw particles
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
    
    // Request next animation frame
    requestAnimationFrame(updateParticles);
  }
  
  // Create particles on mouse movement (throttled for performance)
  function handleMouseMove(event) {
    if (Math.random() > 0.7) {
      particles.push(createParticle(event.clientX, event.clientY));
    }
  }
  
  // Initialize components on mount
  onMount(() => {
    // Start greeting animation
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
    
    // Initialize fullpage.js
    initFullPage();
    
    // Initialize particle animation canvas
    if (particleContainer) {
      particleContainer.width = window.innerWidth;
      particleContainer.height = window.innerHeight;
      requestAnimationFrame(updateParticles);
      
      // Add mousemove event listener with rate limiting
      document.addEventListener('mousemove', handleMouseMove);
      
      // Handle window resize for canvas
      const handleResize = () => {
        if (particleContainer) {
          particleContainer.width = window.innerWidth;
          particleContainer.height = window.innerHeight;
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      // Clean up event listeners and intervals on unmount
      return () => {
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

<!-- Hidden H1 for SEO -->
<h1 class="sr-only">Franz - Interaction Designer & Creative Developer Portfolio</h1>

<!-- Canvas for particle animation -->
<canvas 
    bind:this={particleContainer} 
    class="particle-canvas"
></canvas>

<!-- Header component -->
<HeaderHoverText />

<!-- Back to 3D version button -->
<a href="/" class="version-toggle">Go to 3D Version</a>

<!-- Contact icon component -->
<ContactIcon on:open={() => contactFormVisible = true} />

<!-- Burger menu component -->
<BurgerMenu />

<!-- Contact form component -->
<Messageform visible={contactFormVisible} on:close={() => contactFormVisible = false} />

<!-- Back to top button, visible when not in intro section -->
{#if currentSection > 0}
  <button 
    class="back-to-top" 
    on:click={scrollToTop} 
    transition:fade={{duration: 200}}
    aria-label="Back to top"
  >
    ↑
  </button>
{/if}

<div id="fullpage">
  <!-- Intro section -->
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

      <!-- Scroll indicator BEFORE category toggles -->
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

      <!-- Category toggle buttons -->
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

  <!-- Dynamically generated project sections with individual content -->
  {#if currentCategory && allProjects.length > 0}
    {#each allProjects as project, i}
      <div class="section project-section" data-anchor="{project.anchor}">
        <div class="content-wrapper grid-container">
          <!-- Project 1/3: Content left, image right -->
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
              
              <!-- Show collaborators only for certain categories -->
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
              {:else}
                <!-- Additional spacing for photo and about -->
                <div class="spacer-for-photo-about"></div>
              {/if}
              
              <a href={project.link} class="project-button">Open Project</a>
            </div>
            
            <!-- Image right -->
            <div class="project-image right-image">
              <img src={project.image} alt={project.title} loading="lazy" />
            </div>
          <!-- Project 2/4: Image left, content right -->
          {:else}
            <div class="project-image left-image">
              <img src={project.image} alt={project.title} loading="lazy" />
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
              
              <!-- Show collaborators only for certain categories -->
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
              {:else}
                <!-- Additional spacing for photo and about -->
                <div class="spacer-for-photo-about"></div>
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

<!-- Footer as permanent overlay -->
<div class="footer-overlay">
  <HomeFooter />
</div>

<style>
  /* Font definitions */
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

  /* Add bold variant of Franz-Plex for better display */
  @font-face {
    font-family: 'Franz-Plex';
    src: url('/fonts/IBM_Plex_Mono/IBMPlexMono-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  /* CSS Variables */
  :root {
    --bg-color: #01031A;
    --text-color: #fff;
    --accent-color: rgba(255, 255, 255, 0.2);
    --border-color: rgba(255, 255, 255, 0.3);
    --hover-bg: rgba(255, 255, 255, 0.1);
    --active-bg: rgba(255, 255, 255, 0.2);
    --dark-overlay: rgba(0, 0, 0, 0.7);
    --card-bg: rgba(27, 29, 58, 0.6);
  }

  /* Global styles */
  :global(html) {
    overflow: hidden;
    height: 100%;
  }
  
  :global(body) {
    height: 100%;
    overflow: hidden;
  }
  
  :global(.section) {
    position: relative;
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: 'Franz-Plex', monospace;
  }
  
  /* Back to top button */
  .back-to-top {
    position: fixed;
    bottom: 60px;
    right: 45px;
    z-index: 100;
    background: var(--dark-overlay);
    color: white;
    border: 1px solid var(--border-color);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .back-to-top:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }
  
  /* Version toggle */
  .version-toggle {
    position: fixed;
    top: 18px;
    right: 140px;
    z-index: 9900;
    color: white;
    background: transparent;
    border: none;
    padding: 8px 12px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }
  
  .version-toggle:hover {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }
  
  /* Intro section */
  .intro-section {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100vh;
  }
  
  .content-wrapper {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    z-index: 5;
    position: relative;
    height: 100%;
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
    margin-bottom: 4rem;
    margin-left: 2rem;
    align-self: flex-start;
  }
  
  /* Greeting styling */
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
    font-family: 'Franz-Plex', monospace;
  }
  
  /* Heading styling */
  .heading-large {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    letter-spacing: -1px;
    font-family: 'Franz-Plex', monospace;
    text-align: left;
  }
  
  .intro-description {
    font-size: 1.3rem;
    line-height: 1.7;
    margin-top: 0;
    margin-bottom: 2rem;
    max-width: 700px;
    text-align: left;
    margin-left: 0;
    padding-left: 0;
    font-family: 'Franz-Plex', monospace;
  }
  
  /* Category toggles */
  .category-toggles {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
    justify-content: center;
    padding: 0 2rem;
    margin-top: 2.5rem;
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
    flex-grow: 0;
    margin-bottom: 8px;
  }
  
  .category-toggle:hover {
    background: var(--hover-bg);
    transform: translateY(-2px);
  }
  
  .category-toggle.active {
    background: var(--active-bg);
    border-color: var(--border-color);
  }
  
  /* Scroll indicator */
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
  
  /* Project section */
  .project-section {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-color);
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
  
  .project-content h2 {
    font-size: 2.5rem;
    margin-bottom: 2.5rem;
    font-weight: 700;
    text-align: left;
    font-family: 'Franz-Grotesk', sans-serif;
    color: #FFFFFF;
    position: relative;
    z-index: 2;
    width: 100%;
  }
  
  .project-content p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    margin-top: 0;
    text-align: left;
    font-family: 'Franz-Plex', monospace;
    position: relative;
    z-index: 2;
    padding-left: 0;
    border-left: none;
    margin-left: 0;
    width: 100%;
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
    border: 1px solid var(--border-color);
    text-align: center;
    font-family: 'Franz-Plex', monospace;
    margin-left: 0;
    position: relative;
    z-index: 2;
    align-self: flex-start;
  }
  
  .project-button:hover {
    background-color: var(--hover-bg);
    transform: translateY(-2px);
  }
  
  /* Grid container for 8 columns */
  .grid-container {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 40px;
    width: 100%;
    max-width: 1400px;
    padding: 0 2rem;
  }
  
  /* Left 4 columns */
  .left-content {
    grid-column: 1 / span 4;
  }
  
  /* Right 4 columns */
  .right-content {
    grid-column: 5 / span 4;
  }
  
  /* Image left */
  .left-image {
    grid-column: 1 / span 4;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Image right */
  .right-image {
    grid-column: 5 / span 4;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Image styling */
  .project-image img {
    width: 100%;
    height: auto;
    max-height: 75vh;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  /* Screen reader only class for hidden H1 */
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
  
  /* Content divider */
  .content-divider {
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 1.5rem 0;
  }
  
  /* Tag styling */
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
    background-color: var(--card-bg);
    border-radius: 9999px;
    color: #fff;
    font-size: 0.9rem;
    font-family: 'Franz-Plex', monospace;
  }
  
  /* Collaborators section */
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
  
  /* Particle canvas */
  .particle-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    pointer-events: none;
  }

  /* Spacer for photo and about categories */
  .spacer-for-photo-about {
    height: 2rem;
    width: 100%;
  }

  /* Footer as permanent overlay */
  .footer-overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: rgba(1, 3, 26, 0.7);
    backdrop-filter: blur(5px);
  }
  
  /* Fullpage.js styling */
  :global(.fp-watermark) {
    display: none !important;
  }
  
  :global(.fp-tooltip) {
    color: white !important;
    background: rgba(0, 0, 0, 0.7);
    padding: 5px 10px;
    border-radius: 4px;
    font-family: 'Franz-Plex', monospace;
  }

  /* Navigation dots styling */
  :global(#fp-nav ul li a span),
  :global(.fp-slidesNav ul li a span) {
    background-color: rgb(122, 122, 122) !important;
    border-color: rgb(122, 122, 122) !important;
  }
  
  :global(#fp-nav ul li a.active span),
  :global(.fp-slidesNav ul li a.active span) {
    background-color: white !important;
    transform: scale(1) !important;
  }
  
  :global(#fp-nav ul li .fp-tooltip) {
    color: white !important;
  }
  
  :global(#fp-nav ul li .fp-sr-only) {
    color: white !important;
  }
  
  :global(#fp-nav) {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    padding: 5px;
  }

  /* Category header */
  .category-header {
    margin-bottom: 1.5rem;
    text-align: center;
    width: 100%;
  }
  
  /* Responsive design - Tablet */
  @media (max-width: 1024px) {
    .grid-container {
      grid-template-columns: repeat(6, 1fr);
    }
    
    .left-content, .right-content {
      grid-column: 1 / span 6;
    }
    
    .left-image, .right-image {
      grid-column: 1 / span 6;
      margin-bottom: 2rem;
    }
    
    .project-section {
      padding: 2rem 0;
    }
  }

  /* Responsive design - Mobile */
  @media (max-width: 768px) {
    /* Global adjustments for normal scrolling on mobile */
    :global(html), :global(body) {
      overflow: auto !important;
      height: auto !important;
    }
    
    /* Section adjustments for normal scrolling */
    .section {
      height: auto !important;
      min-height: 100vh !important;
      padding: 4rem 0 !important;
    }
    
    /* Intro section special adjustments */
    .intro-section {
      height: 100vh !important;
      min-height: 600px !important;
    }
    
    /* Hide navigation on mobile devices */
    :global(#fp-nav) {
      display: none !important;
    }
    
    /* Adjust back-to-top button */
    .back-to-top {
      display: flex !important;
      bottom: 80px;
      right: 15px;
    }
    
    /* Hide version toggle on mobile */
    .version-toggle {
      display: none;
    }
    
    /* Adjust greeting text size */
    .greeting-text {
      font-size: 2rem;
    }
    
    .heading-large {
      font-size: 2.5rem;
    }
    
    .intro-description {
      font-size: 1.1rem;
    }
    
    /* Category toggles for mobile */
    .category-toggles {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      width: 90%;
      margin-top: 2rem;
      padding: 0;
    }
    
    .category-toggle {
      width: 100%;
      padding: 10px 15px;
      font-size: 0.9rem;
      margin-bottom: 0;
    }
    
    /* Intro text centering on mobile */
    .intro-text {
      margin-top: 25vh;
      margin-bottom: 2rem;
      margin-left: 0;
      align-self: center;
      text-align: center;
    }
    
    /* Greeting container on mobile */
    .greeting-container {
      justify-content: left;
      margin-bottom: 0.5rem;
      height: 3rem;
    }
    
    /* Project content adjustments */
    .project-content {
      padding: 20px 0;
      margin-top: 1rem;
      text-align: left;
    }
    
    /* Bildposition für mobile Geräte - immer zuerst */
    .grid-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    /* Für Projekte, bei denen der Text links ist (0, 2), 
       müssen wir die Reihenfolge umkehren */
    .left-content {
      order: 2;
      grid-column: 1 / span 6;
      text-align: left;
    }
    
    .right-content {
      order: 2;
      grid-column: 1 / span 6;
      text-align: left;
    }
    
    .left-image, .right-image {
      order: 1;
      grid-column: 1 / span 6;
      margin-bottom: 1rem;
    }
    
    /* Projekt-Content-Abstand anpassen */
    .project-content {
      padding: 20px 0;
      margin-top: 1rem;
      text-align: left;
    }
    
    /* Explizit Texte links ausrichten */
    .project-content h2 {
      text-align: left;
      width: 100%;
    }
    
    .project-content p {
      text-align: left;
      width: 100%;
    }
    
    /* Button links ausrichten statt zentrieren */
    .project-button {
      align-self: flex-start;
      width: auto;
      min-width: 60%;
    }
    
    /* Weitere bestehende mobile Styles... */
    
    /* Hide tags on mobile */
    .tags {
      display: none;
    }
    
    /* Hide dividers on mobile */
    .content-divider {
      display: none;
    }
    
    /* Collaborators in 2 columns */
    .collaborators-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.4rem 1rem;
    }
    
    .collaborator {
      font-size: 0.85rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    /* Button centering */
    .project-button {
      align-self: center;
      width: 80%;
    }
    
    /* Footer adjustments */
    .footer-overlay {
      background: rgba(1, 3, 26, 0.9);
    }

    /* Adjust back-to-top button */
    .back-to-top {
      width: 50px;
      height: 50px;
      font-size: 18px;
      bottom: 30px;
      right: 10px;
    }
  }
  
  /* Very small screens */
  @media (max-width: 480px) {
    .content-wrapper {
      padding: 0 1rem;
    }
    
    .project-button {
      width: 100%;
    }
    
    .intro-text {
      margin-top: 15vh;
    }
    
    /* Keep category toggles in two columns */
    .category-toggles {
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    
    .category-toggle {
      font-size: 0.8rem;
      padding: 8px 10px;
    }
  }
</style>