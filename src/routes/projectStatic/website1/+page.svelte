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
    function goBackToStatic() {
      goto('/static'); // Direkter Link zurück zur statischen Hauptseite
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
    const pageTitle = "Zeller Zahntechnik | WordPress Website Design | FXMA Design";
    const pageDescription = "A mobile-first redesign for Zeller Zahntechnik with custom icon design, responsive navigation, and intuitive UI - transforming an outdated dental lab website into a modern digital presence.";
    const pageKeywords = "WordPress design, dental website, icon design, responsive design, mobile-first approach, UI/UX design, Zeller Zahntechnik, website redesign";
    
  </script>
  
<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription}>
  <meta name="keywords" content={pageKeywords}>
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://fxma.design/project/website1">
  
  <!-- Open Graph Tags für Social Media -->
  <meta property="og:title" content={pageTitle}>
  <meta property="og:description" content={pageDescription}>
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://fxma.design/project/website1">
  <meta property="og:image" content="https://fxma.design/website1/website1-cover.png">
  
  <!-- Strukturierte Daten für Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Zeller Zahntechnik",
    "url": "https://zellerzahntechnik.de",
    "description": "A modern, mobile-first WordPress website for a dental lab featuring custom dental-themed icons and intuitive navigation.",
    "creator": {
      "@type": "Person",
      "name": "Franz"
    },
    "designer": {
      "@type": "Person",
      "name": "Franz"
    },
    "keywords": "WordPress design, dental website, responsive design, dental lab, icon design",
    "isPartOf": {
      "@type": "WebSite",
      "name": "FXMA Design",
      "url": "https://fxma.design/projectStatic/website1"
    },
    "image": "https://fxma.design/website1/website1-cover.png"
  }
  </script>
</svelte:head>
  
  <!-- Füge eine wrapper-Klasse hinzu, um sicherzustellen, dass dieser Bereich scrollbar ist -->
  <div class="scroll-container">
  <div class="content-wrapper">


    <div class="top-section">

      <div class="back-btn-container">
        <button on:click={goBackToStatic}>
          <img src="/leftArrow.png" alt="Back navigation arrow" />
          Back
        </button>
      </div>

      <div class="cover-section"
      role="figure"
      on:mousemove={handleMouseMove}
      on:mouseleave={resetTransform}>
    <img src="/website1/website1-cover.png" alt="Zeller Zahntechnik website redesign preview showing responsive layouts across desktop and mobile devices" />
    </div>



      <div class="heading-container">
  <h1>
    <a href="https://zellerzahntechnik.de" target="_blank" rel="noopener noreferrer" class="website-link">
      zellerzahntechnik.de
      <svg class="link-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
    </a>
  </h1>
</div>



      <div class="project-columns">
        <div class="project-column">
          <h3>My Role</h3>
          <div class="divider"></div>
          <p>
            UI/UX Designer,  WordPress Specialist, Icon Design Creator, Responsive Design Developer
          </p>
        </div>
        <div class="project-column">
          <h3>Project Overview</h3>
          <div class="divider"></div>
          <p>
            I redesigned the Zeller Zahntechnik website with a mobile-first approach, modernizing the outdated old design.

          </p>
        </div>
        <div class="project-column">
          <h3>Project Tags</h3>
          <div class="divider"></div>
          <div class="tags">
            <div class="tag">Wordpress</div>
            <div class="tag">Hosting</div>
            <div class="tag">Domain</div>
            <div class="tag">Design</div>
            <div class="tag">Responsive</div>
            <div class="tag">Icons</div>
          </div>
        </div>
      </div>
  
  
    </div>
  
  
  
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
        <div>
        <h4>Icon Design & Mobile Navigation</h4>
        <br>
        <p class="text-doku">
            This project was particularly exciting for me because of the icon design and the challenge of optimizing navigation for mobile users. I focused on creating a cohesive icon set that enhances usability and clarity. Additionally, I explored jump links in combination with the bottom navigation to enable quick access to key sections—ensuring a smooth and efficient user experience.
                </p>
        <br>
      </div>
    </FadeInSection>
    </div>
    </div>
  
  
  
    <div class="img-section-4">
      <div class="img-container"><img src="/website1/website1-bild1.png" alt="Custom icon set design for Zeller Zahntechnik featuring dental-themed navigation icons with minimalist line-art style" /></div>
  </div>
  
  

  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
      <div>
      <h4>Icon Design</h4>
      <br>
      <p class="text-doku">
        I created a custom icon set that subtly incorporates a tooth symbol into familiar UI icons, reinforcing the dental theme while maintaining a clean, cohesive look. Using a minimalist line-art style, I focused on clarity, consistency, and scalability across different screen sizes. Through this process, I learned how balanced proportions and recognizability are key to intuitive navigation and a seamless user experience.
        </p>
      <br>
    </div>
  </FadeInSection>
  </div>
  </div>
  
  
  
    <div class="img-section-4">
      <div class="img-container"><img src="/website1/website1-bild2.png" alt="Mobile navigation implementation with jump links and optimized bottom menu for the Zeller Zahntechnik website" /></div>
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
              <span class="tool-name">Wordpress</span>
              <span class="tool-role">Content Management</span>
            </div>
            <div class="tool">
              <span class="tool-name">Elementor Pro</span>
              <span class="tool-role">Visual Page Building</span>
            </div>
            <div class="tool">
              <span class="tool-name">Netcup Webhosting</span>
              <span class="tool-role">Deployment & Hosting</span>
            </div>
            <div class="tool">
              <span class="tool-name">Illustrator</span>
              <span class="tool-role">Icon-Generation</span>
            </div>
            
          </div>
        </div>
      </div>
    </FadeInSection>
  </div>
  
  
  <div class="back-btn-container bottom-back">
    <button on:click={goBackToStatic}>
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
    z-index: 100;
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
  
  /* Überschrift-Container: 100% Breite, h2 linksbündig */
  .heading-container {
    width: 100%;
    height: auto;
    margin-top: -2rem; /* Negativer Wert verschiebt es nach oben */
    margin-bottom: 3rem; /* Etwas mehr Abstand nach unten */
    align-content: center;
    position: relative; /* Für bessere Positionierung */
    z-index: 5; /* Sicherstellen, dass es über anderen Elementen liegt */
  }
  
  /* Styling für die H1 wie bisher für die H4 */
.heading-container h1 {
  font-family: 'Franz-Plex', mono;
  color: #057FD3;
  line-height: 1.6;
  font-size: 2rem;
  margin: 0;
  padding: 0;
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
    color: #057FD3;
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

    
    /* Andere Bilder sollen die volle Breite behalten */
    .img-section-4 {
      display: block;
      margin-top: 5rem;
    }
    
    .img-container {
      width: 100%;
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

  /* Link-Styling hinzufügen */
  .website-link {
    text-decoration: none;
    display: inline-block;
    position: relative;
  }


  /* Optional: Unterstreichungseffekt beim Hover */
  .website-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #2a9de8;
    transition: width 0.3s ease;
  }

  .website-link:hover::after {
    width: 100%;
  }

  /* Link-Icon Styling */
  .link-icon {
    margin-left: 8px;
    vertical-align: middle;
    transition: transform 0.2s ease;
    position: relative;
    top: -4px; /* Weiter nach oben schieben */
    display: inline-block; /* Wichtig für richtige Positionierung im Text */
  }

  /* Animation beim Hover */
  .website-link:hover .link-icon {
    transform: translateY(-2px);
  }

  .website-link:hover {
    color: #2a9de8;
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
  color: #057FD3;
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

/* Bestehender CSS-Code (unverändert) */
.heading-container h1 {
  font-family: 'Franz-Plex', mono;
  color: #057FD3;
  line-height: 1.6;
  font-size: 2rem;
  margin: 0;
  padding: 0;
}

/* Neue Media Queries für mobile Anpassungen */
@media (max-width: 768px) {
  .heading-container h1 {
    font-size: 1.8rem;  /* Leicht verkleinert für Tablets */
    line-height: 1.4;   /* Etwas kompaktere Zeilenhöhe */
  }
  
  .link-icon {
    width: 16px;        /* Icon etwas kleiner machen */
    height: 16px;
    margin-left: 6px;   /* Geringerer Abstand zum Text */
  }
}

@media (max-width: 480px) {
  .heading-container h1 {
    font-size: 1.6rem;  /* Noch kleiner für Smartphones */
    line-height: 1.3;   /* Kompaktere Zeilenhöhe */
    word-break: keep-all; /* Verhindert das Umbrechen von Wörtern */
  }
  
  .link-icon {
    width: 14px;        /* Noch kleineres Icon für Smartphones */
    height: 14px;
    margin-left: 4px;   /* Minimaler Abstand zum Text */
    top: -3px;          /* Vertikale Ausrichtung anpassen */
  }
}
  </style>