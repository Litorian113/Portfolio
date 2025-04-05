<script>
    import FadeInSection from '$lib/components/FadeInSection.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import Footer from '$lib/Footer.svelte';
  
    $: url = $page.url;
  
    // Stelle sicher, dass Scrollen auf dieser Seite funktioniert
    onMount(() => {
      // Aktiviere das Scrollen explizit
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      console.log("Project page: Enabling scroll");
  
      if (browser) {
        // Benutze Intersection Observer für Lazy Loading
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.dataset.src;
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
              }
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '200px 0px'
        });
        
        // Wende auf alle Bilder mit data-src Attribut an
        document.querySelectorAll('img[data-src]').forEach(img => {
          observer.observe(img);
        });
      }
    });
  
    // Neue Funktion für die Navigation zur statischen Hauptseite
    function goBackToFlur() {
      // Kameraparameter aus URL lesen oder Standardwerte verwenden
      const cx = url.searchParams.get('cx') ?? 0;
      const cy = url.searchParams.get('cy') ?? 0;
      const cz = url.searchParams.get('cz') ?? 20;
      
      // Wenn ein spezieller Rückkehrpunkt für Quattera definiert werden soll,
      // kannst du hier feste Werte eintragen anstatt der URL-Parameter
      // z.B.: const cx = -10; const cy = 5; const cz = 15;
      
      // Prüfe, ob der Nutzer von der statischen Seite kam (kein URL-Parameter)
      if (!url.searchParams.has('cx')) {
        // Zurück zur statischen Version
        goto('/static');
      } else {
        // Zurück zur 3D-Version mit Kameraposition
        goto(`/?cx=${cx}&cy=${cy}&cz=${cz}`);
      }
    }
  
    function handleMouseMove(e) {
      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Berechne relative Position (zwischen -0.5 und 0.5)
      const percentX = (x / rect.width) - 1;
      const percentY = (y / rect.height) - 1;
      // Multipliziere mit einem Faktor (z. B. 10px maximaler Versatz)
      const moveX = percentX * 150;
      const moveY = percentY * 150;
      container.querySelector('img').style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  
    function resetTransform(e) {
      e.currentTarget.querySelector('img').style.transform = 'translate(0,0)';
    }
  
    // SEO-Konfiguration für diese Projektseite
// SEO-Konfiguration für diese Projektseite
const pageTitle = "Quattera | Interactive AI Card Game | FXMA Design";
const pageDescription = "An interactive AI-powered Quartet card game with dynamically generated animal cards and mini-games including Memory, Quiz, and Guess Me—with MongoDB highscore tracking.";
const pageKeywords = "AI card game, ChatGPT API, SvelteKit, interactive web games, MongoDB, memory game, quiz game, animal cards, AI integration";
  </script>
  
<!-- Seitenspezifische SEO-Tags aktualisieren -->
<svelte:head>
  <title>Quattera | Interactive AI Card Game | FXMA Design</title>
  <meta name="description" content="An interactive AI-powered Quartet card game with dynamically generated animal cards and mini-games including Memory, Quiz, and Guess Me—with MongoDB highscore tracking.">
  <meta name="keywords" content="AI card game, ChatGPT API, SvelteKit, interactive web games, MongoDB, memory game, quiz game, animal cards, web development, AI integration">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://fxma.design/project/game">
  
  <!-- Open Graph Tags für Social Media -->
  <meta property="og:title" content="Quattera | Interactive AI Card Game | FXMA Design">
  <meta property="og:description" content="An interactive AI-powered Quartet card game with dynamically generated animal cards and mini-games including Memory, Quiz, and Guess Me—with MongoDB highscore tracking.">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://fxma.design/project/game">
  <meta property="og:image" content="https://fxma.design/quattera/quattera-cover.png">
  
  <!-- Strukturierte Daten für Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Quattera",
    "description": "An interactive AI-powered Quartet card game with dynamically generated animal cards and three engaging mini-games. Features include ChatGPT API integration for content generation and MongoDB for highscore tracking.",
    "url": "https://quattera.game",
    "applicationCategory": "GameApplication",
    "author": {
      "@type": "Person",
      "name": "Franz"
    },
    "keywords": "AI card game, ChatGPT API, SvelteKit, MongoDB, memory game, quiz game, animal cards",
    "creator": {
      "@type": "Person",
      "name": "Franz"
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "FXMA Design",
      "url": "https://fxma.design"
    },
    "image": "https://fxma.design/quattera/quattera-cover.png"
  }
  </script>
</svelte:head>
  
  <!-- Füge eine wrapper-Klasse hinzu, um sicherzustellen, dass dieser Bereich scrollbar ist -->
  <div class="scroll-container">
  <div class="content-wrapper">
    <div class="top-section">
      <div class="back-btn-container">
        <button on:click={goBackToFlur}>
          <img src="/leftArrow.png" alt="Back navigation arrow" />
          Back
        </button>
      </div>
      <div class="heading-container">
          <h1>Quattera</h1>
      </div>
      <div class="project-columns">
        <div class="project-column">
          <h3>My Role</h3>
          <div class="divider"></div>
          <p>
            UI/UX Designer, Web Developer, SvelteKit Development, AI Integration
          </p>
        </div>
        <div class="project-column">
          <h3>Project Overview</h3>
          <div class="divider"></div>
          <p>
            An interactive AI-powered Quartet card game built with SvelteKit. Users can generate animal cards using the ChatGPT API and play mini-games like Memory, Quiz, and Guess Me—complete with highscore tracking via MongoDB.
          </p>
        </div>
        <div class="project-column">
          <h3>Project Tags</h3>
          <div class="divider"></div>
          <div class="tags">
            <div class="tag">SvelteKit</div>
            <div class="tag">UX/UI-Design</div>
            <div class="tag">Api-Integration</div>
            <div class="tag">MongoDB</div>
            <div class="tag">ChatGptAPI-Integration</div>
            <div class="tag">Dynamic</div>
            <div class="tag">Json-Data</div>
            <div class="tag">Highscores</div>
            <div class="tag">GitHub</div>
          </div>
        </div>
      </div>
  
  
    </div>
  
  
  
    <div class="cover-section"
    role="figure"
    on:mousemove={handleMouseMove}
    on:mouseleave={resetTransform}>
  <img src="/coverQuattera.png" alt="KarinCruises.de website showcase featuring an interactive 3D globe displaying the cruise ship's route" />
  </div>
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
        <div>
        <h4>Introduction</h4>
        <br>
        <p class="text-doku">
            This project was created during the Programming 3 course and explores the integration of AI in web development. Built with SvelteKit, it’s an interactive animal-themed Quartet card game that combines generative AI, dynamic content, and playful mini-games. Users can browse a collection of 32 animal cards, or generate new ones by entering an animal name. Using the ChatGPT API, the app creates fitting card stats and a matching cover image in real time.
              </p>
              <br>
              <p class="text-doku">
                The Game Hub offers three mini-games—Memory, Quiz, and Guess Me—each featuring a timer, player name input, and highscore tracking. All scores are stored in MongoDB and displayed on dedicated leaderboards, with an overview available right on the homepage. The result is a fun, AI-powered web app that merges creativity, code, and user interaction.
             </p>
      </div>
    </FadeInSection>
    </div>
    </div>


    <div class="image-section">
        <img src="/quattera/hub.png" alt="Quattera game hub interface showing the main menu with different game options and highscores" />
      </div>
      <div class="image-section">
        <img src="/quattera/start.png" alt="Quattera start screen with animal-themed design and game selection options" />
      </div>
      <div class="image-section">
        <img src="/quattera/karte.png" alt="Animal card display interface showing stats and information generated by the ChatGPT API" />
      </div>
      <div class="image-section">
        <img src="/quattera/login.png" alt="Player login screen for entering username before starting mini-games" />
      </div>
      <div class="image-section">
        <img src="/quattera/memorie.png" alt="Memory mini-game interface with animal cards arranged in a grid pattern" />
      </div>
      <div class="image-section">
        <img src="/quattera/quiz.png" alt="Quiz mini-game showing multiple choice questions about animals and their characteristics" />
      </div>
      <div class="image-section">
        <img src="/quattera/guess.png" alt="Guess Me game interface where players need to identify animals based on partial information" />
      </div>
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
        <h4>Key Takeaways</h4>
        <br>
        <p class="text-doku">
            This project was a valuable opportunity to deepen my understanding of AI integration, data-driven UI, and interactive web design. I learned how to connect frontend interfaces with AI services and databases, structure engaging user flows, and design for playful interaction. Balancing functionality with user experience, especially across different game modes and screens, helped me sharpen both my technical and UX design skills. It also emphasized the importance of responsive design, intuitive navigation, and maintaining performance while working with dynamic, API-generated content.
             </p>
      </div>
      </FadeInSection>
      </div>
    </div>

  <div class="collaborators-section">
    <div class="divider-large"></div>
    
    <FadeInSection>
      <div class="collaborators-content">
        <h4>The People Behind the Project</h4>
        <div class="collaborators-list">
          <div class="collaborator">Franz Anhäupl</div>
        </div>
        
        <!-- Neuer Abschnitt für Creative Arsenal -->
        <div class="creative-arsenal">
          <h4>My Creative Arsenal</h4>
          <p class="arsenal-intro">Crafting this experience with our digital toolbelt:</p>
          <div class="tools-container">
            <div class="tool">
              <span class="tool-name">Figma</span>
              <span class="tool-role">UI/UX Design</span>
            </div>
            <div class="tool">
              <span class="tool-name">Visual Studio Code</span>
              <span class="tool-role">Code Editing & Development</span>
            </div>
            <div class="tool">
              <span class="tool-name">MongoDB</span>
              <span class="tool-role">3D Data Visualization</span>
            </div>
            <div class="tool">
              <span class="tool-name">Chat GPT API</span>
              <span class="tool-role">AI-Assisted Data Processing</span>
            </div>
            <div class="tool">
              <span class="tool-name">Claude 3.7</span>
              <span class="tool-role">AI-Powered Data Interpretation</span>
            </div>
            <div class="tool">
                <span class="tool-name">Javascript</span>
                <span class="tool-role">Coding</span>
              </div>
              <div class="tool">
                <span class="tool-name">SvelteKit</span>
                <span class="tool-role">Coding</span>
              </div>
            
          </div>
        </div>
      </div>
    </FadeInSection>
  </div>
  
  
  <div class="back-btn-container bottom-back">
    <button on:click={goBackToFlur}>
      <img src="/leftArrow.png" alt="Back navigation arrow" />
      Back to Projects
    </button>
  </div>
  
  <Footer />
  
  </div>
  </div>
  
  
  
  
  
  <style>
  /* IBM Plex Mono Regular */
  @font-face {
    font-family: 'Franz-Plex';
    src: url('/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  
  /* Space Grotesk Regular */
  @font-face {
    font-family: 'Franz-Grotesk';
    src: url('/fonts/Space_Grotesk/static/SpaceGrotesk-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
  
  .content-wrapper {
    width: 92%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 4rem 4rem;
  }
  
  /* Top-Section: 80vh hoch, Flexbox-Layout für die Elemente */
  .top-section {
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  
  /* Button-Container: 100% Breite, Button linksbündig */
  .back-btn-container {
    width: 100%;
  }
  
  .back-btn-container button {
    color: white;
    font-family: 'Franz-Grotesk', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 1px solid white;
    border-radius: 15px;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    text-align: left;
    cursor: pointer;
  }
  
  /* Optional: Größe und Ausrichtung des Pfeils anpassen */
  .back-btn-container button img {
    height: 1.2em;
    width: auto;
  }
  
  /* Überschrift-Container: 100% Breite, h1 linksbündig */
  .heading-container {
    width: 100%;
    height: 30vh;
    margin-top: 1rem;
    align-content: center;
  }
  
  .heading-container h1 {
    width: auto; /* Von 100% auf auto geändert, damit das Icon Platz hat */
    text-align: left;
    font-size: 6rem;
    margin: 0;
    padding: 0.5rem 0;
    font-family: 'Franz-Grotesk', sans-serif;
    color: #C1161C;
    letter-spacing: 0.1rem;
  }
  
  .title-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    gap: 0.5rem;
    transition: all 0.3s ease;
    position: relative; /* Erforderlich für absolute Positionierung des Pseudoelements */
  }
  
  .title-link:hover h1 {
    text-decoration: none; /* Entferne die bestehende Unterstreichung */
  }
  
  .title-link::after {
    content: '';
    position: absolute;
    bottom: 8px; /* Anpassung der Position relativ zum Text */
    left: 0;
    width: 0; /* Beginnt mit 0 Breite */
    height: 1px; /* Dünnere Linie als der Standard-Unterstrich */
    background-color: #00CCB5; /* Gleiche Farbe wie der Text */
    transition: width 0.3s ease; /* Animation von links nach rechts */
    transform-origin: left;
  }
  
  .title-link:hover::after {
    width: 100%; /* Volle Breite beim Hover */
  }
  
  .link-icon {
    font-size: 2.5rem;
    color: #00CCB5;
    opacity: 0.7;
    transition: opacity 0.3s ease;
    margin-top: 0.5rem; /* Feinabstimmung für vertikale Ausrichtung */
  }
  
  .title-link:hover .link-icon {
    opacity: 1;
    transform: translateY(-3px);
  }
  
  /* Drei Spalten Layout */
  .project-columns {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    gap: 2rem;
    margin-top: 1rem;
    max-width: 100%;
  }
  
  /* Jede Spalte */
  .project-columns .project-column {
    flex: 1;
    min-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .project-columns .project-column h3 {
    width: 100%;
    text-align: left;
    font-size: 1.5rem;
    margin: 0;
    padding: 0.5rem 0;
    color: grey;
    font-family: 'Franz-Grotesk', sans-serif;
  }
  
  .project-columns .project-column .divider {
    width: 95%;
    height: 2px;
    background-color: grey;
    margin-bottom: 0.5rem;
  }
  
  .project-columns .project-column p {
    width: 95%;
    text-align: left;
    font-size: 1.5rem;
    margin: 0;
    color: white;
    font-family: 'Franz-Grotesk', sans-serif;
    line-height: 1.6;
  }
  
  /* Container für die Tags */
  .tags {
    display: flex;
    flex-wrap: wrap;
    width: 95%;
    gap: 0.7rem;
    margin-top: 1rem;
  }
  
  /* Einzelnes Tag-Element */
  .tag {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #1B1D3A;
    border-radius: 9999px;
    color: #fff;
    font-size: 1rem;
    font-family: 'Franz-Grotesk', sans-serif;
  }
  
  .cover-section {
    width: 100%;
    position: relative;
    scale: 0.8;
  }
    
  .cover-section img {
    display: block;
    width: 100%;
    height: auto;
    transition: transform 0.3s ease;
    transform: translate(0, 0);
    will-change: transform;
  }
  
  .image-section {
    width: 100%;
    align-content: center;
    margin-top: 10rem;
  }
  
  .image-section img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }
  
  .grid-section1 {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(1, 1fr);
    gap: 8px;
    margin-top: 7rem;
  }
  
  .text-grid1 {
    grid-column: span 4 / span 4;
  }
  
  h4 {
    font-family: 'Franz-Plex', mono;
    color: #C1161C;
    line-height: 1.6;
    font-size: 1.5rem;
  }
  
  .text-doku {
    color: white;
    font-family: 'Franz-Plex', mono;
    line-height: 1.6;
    font-size: 1.5rem;
  }
  


  
  .img-section-4 {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(1, 1fr);
    gap: 8px;
    margin-top: 10rem;
  }
      
  .img-container {
    grid-column: span 4 / span 4;
  }


  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }
  
  /* Stelle sicher, dass diese Seite scrollbar ist */
  .scroll-container {
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }
  
  /* Mobile Anpassungen */
  @media (max-width: 768px) {
    /* Anpassung der Textpassagen */
    .grid-section1 {
      display: block;
      margin-top: 4rem;
    }
    
    .text-grid1 {
      width: 100%;
    }
    
    .text-doku {
      font-size: 1.2rem;
    }
    
    h4 {
      font-size: 1.4rem;
    }
    

  
    .project-columns .project-column .divider,
    .project-columns .project-column p,
    .tags {
      width: 100%;
    }
  
    /* Anpassung der Überschriftengröße und -höhe */
    .heading-container {
      height: auto;
      margin-top: 1rem;
      margin-bottom: 2rem;
    }
    
    .heading-container h1 {
      font-size: 4rem;
      line-height: 1.1;
    }
    
    /* Andere Bilder sollen die volle Breite behalten */
    .img-section-4 {
      display: block;
      margin-top: 5rem;
    }
    
    .img-container {
      width: 100%;
    }
    
    .image-section {
      margin-top: 5rem;
    }
    
    /* Anpassung der Projektspaltenlayouts */
    .project-columns {
      flex-direction: column;
      gap: 2rem;
    }
    
    .project-columns .project-column {
      min-width: 100%;
    }
  }
  
  /* Noch kleinere Geräte */
  @media (max-width: 480px) {
    .heading-container h1 {
      font-size: 2rem;
    }
    
    .content-wrapper {
      padding: 2rem 1.5rem;
      width: 95%;
    }
    
    h4 {
      font-size: 1.3rem;
    }
    
    .text-doku {
      font-size: 1.1rem;
    }
    
    .back-btn-container button {
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
    }
    
    .project-columns .project-column h3 {
      font-size: 1.3rem;
    }
    
    .project-columns .project-column p {
      font-size: 1.2rem;
    }
  }


  @media (max-width: 360px) {
  .heading-container h1 {
    font-size: 2rem;  /* Noch kompaktere Größe für sehr schmale Displays */
    word-break: break-word; /* Erlaubt Umbrüche bei langen Projektnamen */
  }
  
  .back-btn-container button {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}


.collaborators-section {
  margin-top: 10rem;
  margin-bottom: 5rem;
  width: 100%;
}

.divider-large {
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 4rem;
}

.collaborators-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.collaborators-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 1.5rem;
}

.collaborator {
  color: white;
  font-family: 'Franz-Grotesk', sans-serif;
  font-size: 1.3rem;
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .collaborators-section {
    margin-top: 6rem;
    margin-bottom: 3rem;
  }
  
  .collaborators-list {
    flex-direction: column;
    gap: 1rem;
  }
}

.creative-arsenal {
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}

.arsenal-intro {
  grid-column: span 4 / span 4;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Franz-Grotesk', sans-serif;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
}

.creative-arsenal h4 {
  grid-column: span 4 / span 4;
}

.tools-container {
  grid-column: span 4 / span 4;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
}

.tool {
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;
  flex: 0 1 auto;
}

.tool:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
}

.tool-name {
  color: #C1161C;
  font-family: 'Franz-Plex', mono;
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.tool-role {
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Franz-Grotesk', sans-serif;
  font-size: 0.9rem;
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .creative-arsenal {
    margin-top: 3rem;
    display: block;
  }
  
  .tools-container {
    gap: 1rem;
    width: 100%;
  }
  
  .tool {
    padding: 0.8rem 1.2rem;
  }
}

@media (max-width: 480px) {
  .tools-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.7rem;
    width: 100%;
  }
  
  .tool {
    flex: 0 0 calc(50% - 0.7rem);
    max-width: calc(50% - 0.7rem);
    padding: 0.7rem 0.8rem;
    margin-bottom: 0.7rem;
  }
  
  .tool-name {
    font-size: 0.9rem;
  }
  
  .tool-role {
    font-size: 0.8rem;
  }
}

/* Zusätzliches Styling für den unteren Back-Button */
.bottom-back {
  margin-top: 10rem;
  margin-bottom: 3rem;
  display: flex;
  justify-content: flex-start; /* Linksbündig statt zentriert */
}

  </style>