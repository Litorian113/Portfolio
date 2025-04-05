<script>
    import FadeInSection from '$lib/components/FadeInSection.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
	import Stage from '$lib/Stage.svelte';
	import Footer from '$lib/Footer.svelte';
  
    $: url = $page.url;
    
    // SEO-Konfiguration für diese Projektseite
    const pageTitle = "bwegt App Redesign | FXMA Design Portfolio";
    const pageDescription = "In-depth case study of the bwegt mobility app redesign project focusing on improved usability, simplified navigation, and enhanced real-time travel information for a seamless user experience.";
    const pageKeywords = "bwegt app, UX design, UI redesign, mobility app, user research, prototype, gamification, Franz portfolio";

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
      goto('/static#bwegt'); // Direkter Link zurück zur statischen Hauptseite
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
  
    
    
  
    
  </script>
  
  <!-- Seitenspezifische SEO-Tags -->
<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription}>
  <meta name="keywords" content={pageKeywords}>
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://fxma.design/project/bwegt">
  
  <!-- Open Graph Tags für Social Media -->
  <meta property="og:title" content={pageTitle}>
  <meta property="og:description" content={pageDescription}>
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://fxma.design/project/bwegt">
  <meta property="og:image" content="https://fxma.design/bwegt-doku1.png">
  
  <!-- Strukturierte Daten für Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "bwegt App Redesign",
    "description": "A redesign of the bwegt mobility app focusing on usability, navigation, and real-time information.",
    "creator": {
      "@type": "Person",
      "name": "Franz"
    },
    "keywords": "mobility app, UX design, UI redesign, gamification, user testing",
    "isPartOf": {
      "@type": "WebSite",
      "name": "FXMA Design",
      "url": "https://fxma.design"
    },
    "image": "https://fxma.design/bwegt-doku1.png"
  }
  </script>
</svelte:head>
  
  <!-- Füge eine wrapper-Klasse hinzu, um sicherzustellen, dass dieser Bereich scrollbar ist -->
  <div class="scroll-container">
  <div class="content-wrapper">
    <div class="top-section">
      <div class="back-btn-container">
        <button on:click={goBackToStatic}>
          <img src="/leftArrow.png" alt="Back arrow" />
          Back
        </button>
      </div>
      <div class="heading-container">
        <!-- Ändere h2 zu h1 -->
        <h1>bwegt App</h1>
      </div>
      <div class="project-columns">
        <div class="project-column">
          <h3>My Role</h3>
          <div class="divider"></div>
          <p>
            UI/UX Designer, User Research Contributor, Interface Developer, Prototype Creator, Visual Assets Creator, Video Production Lead, Team Collaborator
          </p>
        </div>
        <div class="project-column">
          <h3>Project Overview</h3>
          <div class="divider"></div>
          <p>We redesigned the bwegt mobility app to improve usability, simplify navigation, and enhance real-time travel
            information for a seamless user experience.</p>
        </div>
        <div class="project-column">
          <h3>Project Tags</h3>
          <div class="divider"></div>
          <div class="tags">
            <div class="tag">App-Redesign</div>
            <div class="tag">Typography</div>
            <div class="tag">Figma</div>
            <div class="tag">Prototyping</div>
            <div class="tag">Stablediffusion</div>
            <div class="tag">Styleguide</div>
            <div class="tag">Usertesting</div>
            <div class="tag">User-Centered-Interface</div>
          </div>
        </div>
      </div>
  
  
    </div>
  
  
  
    <div class="cover-section"
    role="figure"
    on:mousemove={handleMouseMove}
    on:mouseleave={resetTransform}>
  <img src="/bwegt-doku1.png" alt="Cover of the bwegt project showcasing the app with two screens on tilted smartphones" />
  </div>
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
        <div>
        <h4>Introduction</h4>
        <br>
        <p class="text-doku">
          In the “Application 1” course at HfG during the winter semester, we took a closer look at the existing “bwegt”
          mobility app for Baden-Württemberg. Our goal was to address common user pain points such as confusing ticket
          structures, unclear navigation, and a lack of real-time information.</p>
        <p class="text-doku"> By integrating user research and iterative design methods, we developed a refined,
          user-centered app concept that not only simplifies everyday travel but also motivates more environmentally
          friendly transport choices.</p>
      </div>
    </FadeInSection>
    </div>
    </div>
  
  
    <div class="image-section">
      <img src="/bwegt-doku2.png" alt="Sticky notes displaying a detailed user flow diagram that helped gather important insights for the app design" />
    </div>
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
        <h4>User-Centered Research & Flow</h4>
        <p class="text-doku">
          To ensure a user-centered redesign, we conducted qualitative research, including 13 in-depth interviews, to
          identify common pain points in mobility apps. Insights revealed issues like unclear navigation, lack of
          real-time updates, and complex ticket structures.
        </p>
        <p class="text-doku">
          Based on this, we developed a persona, Rebeka, a frequent public transport user who relies on apps for planning
          but struggles with inconsistent information and crowded trains. The new user flow prioritizes intuitive
          navigation, quick ticket access, and transparent real-time updates, ensuring a seamless and stress-free travel
          experience.
        </p>
      </div>
      </FadeInSection>
      </div>
    </div>
  
  
    <div class="img-grid">
      <div class="img1"><img src="/grid1.png" alt="AI-generated avatar customization interface that helps users personalize their experience within the app" /></div>
      <div class="img2"><img src="/grid2.png" alt="AI-generated badge visualization for the reward system showing the user's current achievement level" /></div>
      <div class="img3"><img src="/grid3.png" alt="AI-generated environmental impact visualization showing progression levels in the gamification system" /></div>
      <div class="img4"><img src="/grid4.png" alt="AI-generated reward icon representing achievements in the public transport usage tracking system" /></div>
      <div class="img5"><img src="/grid5.png" alt="AI-generated emblem for the highest user level in the bwegt environmental benefits program" /></div>
    </div>
  
  
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
        <h4>Gamification Design</h4>
        <p class="text-doku">
          We used Stable Diffusion to generate various visual elements in the app, ensuring a cohesive and modern design language. This included UI illustrations, badges, and interactive icons that enhance user engagement.
        </p>
        <p class="text-doku">
          A key feature of our redesign was the integration of gamification through an environmental rewards system. Users earn points and badges for choosing public transport, track their CO₂ savings in real time, and progress through virtual station upgrades—creating an engaging and motivating experience that encourages sustainable mobility choices.
        </p>
      </div>
      </FadeInSection>
      </div>
    </div>
  
    <div class="img-section-4">
      <div class="img-container"><img src="/bwegt-doku3.png" alt="Overview of the benefits main page and subpages displayed on three smartphone screens showing the gamification system" /></div>
  </div>
  
  
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
      <h4>Design Evolution</h4>
      <p class="text-doku">
        Throughout the design process, we iteratively refined components to enhance clarity, usability, and consistency. Colors played a key role in establishing a clear visual hierarchy—contrasting shades ensure readability, while accent colors guide user focus. The interface evolved through multiple adjustments, optimizing button placements, spacing, and iconography to create an intuitive and visually engaging experience.   
       </p>
      </div>
      </FadeInSection>
    </div>
  </div>
  
  <div class="img-section-4">
    <div class="img-container"><img src="/bwegt-doku4.png" alt="Color palette used throughout the bwegt project showing primary, secondary, and accent colors" /></div>
  </div>
  
  <div class="img-section-4">
    <div class="img-container"><img src="/bwegt-doku5.png" alt="Component set developed for the project displaying buttons, cards, input fields and navigation elements" /></div>
  </div>
  
  <div class="image-section">
    <img src="/bwegt-doku6.png" alt="Desktop UI version of bwegt showing responsive layouts of the key screens we designed" />
  </div>
  
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
      <h4>Active Journey Mode</h4>
      <p class="text-doku">
        The Active Journey Mode keeps users informed in real time, automatically checking them into their trip. It displays upcoming stops, delays, and alternative connections with clear icons and color-coded alerts. Designed for quick readability, this feature minimizes uncertainty and enhances the travel experience.     
      </p>
    </div>
    </FadeInSection>
    </div>
  </div>
  
  
  <div class="img-section-4">
    <div class="img-container"><img data-src="/bwegt-doku7.png" alt="Active Journey feature showcased on three smartphone screens, displaying real-time travel information and connection updates" /></div>
  </div>
  

  <div class="collaborators-section">
    <div class="divider-large"></div>
    
    <FadeInSection>
      <div class="collaborators-content">
        <h4>The People Behind the Project</h4>
        <div class="collaborators-list">
          <div class="collaborator">Vivien Cai</div>
          <div class="collaborator">Rebeka Tot</div>
          <div class="collaborator">Franz Anhäupl</div>
        </div>
        
        <!-- Neuer Abschnitt für Creative Arsenal -->
        <div class="creative-arsenal">
          <h4>Our Creative Arsenal</h4>
          <p class="arsenal-intro">Crafting this experience with our digital toolbelt:</p>
          <div class="tools-container">
            <div class="tool">
              <span class="tool-name">Figma</span>
              <span class="tool-role">UI/UX Design</span>
            </div>
            <div class="tool">
              <span class="tool-name">Miro</span>
              <span class="tool-role">Collaboration & Ideation</span>
            </div>
            <div class="tool">
              <span class="tool-name">Stable Diffusion</span>
              <span class="tool-role">AI Image Generation</span>
            </div>
            <div class="tool">
              <span class="tool-name">Premiere Pro</span>
              <span class="tool-role">Video Editing</span>
            </div>
            <div class="tool">
              <span class="tool-name">After Effects</span>
              <span class="tool-role">Motion Design</span>
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  </div>

  <div class="back-btn-container bottom-back">
    <button on:click={goBackToStatic}>
      <img src="/leftArrow.png" alt="Back arrow" />
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

  /* Überschrift-Container: 100% Breite, h2 linksbündig */
  .heading-container {
    width: 100%;
    height: 30vh;
    margin-top: 1rem;
    align-content: center;
  }

  .heading-container h1 {
    width: 100%;
    text-align: left;
    font-size: 6rem;
    margin: 0;
    padding: 0.5rem 0;
    font-family: 'Franz-Grotesk', sans-serif;
    color: #FFCD06;
    letter-spacing: 0.1rem;
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
    color: #FFCD06;
    line-height: 1.6;
    font-size: 1.5rem;
  }

  .text-doku {
    color: white;
    font-family: 'Franz-Plex', mono;
    line-height: 1.6;
    font-size: 1.5rem;
  }

  .img-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 8px;
    margin-top: 5rem;
    justify-items: center;
    align-items: center;
    scale: 0.8;
  }

  .img1 {
    grid-row: span 2 / span 2;
  }

  .img4 {
    grid-column-start: 2;
  }

  .img5 {
    grid-column-start: 3;
  }

  .img-grid img {
    filter: grayscale(100%);
    transition: filter 0.8s ease;
    transform: translateZ(0);
  }

  .img-grid img:hover {
    filter: grayscale(0%);
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
    
    /* Bildergalerie neu anpassen */
    .img-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto auto auto;
      gap: 1.5rem;
      scale: 1;
      margin-top: 3rem;
    }
    
    /* Erstes Bild kleiner skalieren und über volle Breite */
    .img-grid .img1 {
      grid-column: 1 / span 2;
      width: 100% !important;
      max-width: 80%;
      margin: 0 auto 1rem auto;
    }
    
    /* Restliche Bilder im 2x2 Grid */
    .img-grid .img2 {
      grid-column: 1;
      grid-row: 2;
    }
    
    .img-grid .img3 {
      grid-column: 2;
      grid-row: 2;
    }
    
    .img-grid .img4 {
      grid-column: 1;
      grid-row: 3;
    }
    
    .img-grid .img5 {
      grid-column: 2;
      grid-row: 3;
    }
    
    .img-grid div {
      width: 100% !important;
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
      font-size: 3rem;
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
    
    .img-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .img-grid .img1,
    .img-grid .img2,
    .img-grid .img3,
    .img-grid .img4,
    .img-grid .img5 {
      grid-column: 1;
    }
    
    .img-grid .img1 {
      max-width: 90%;
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
  color: #FFCD06;
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