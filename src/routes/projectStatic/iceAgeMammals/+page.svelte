<script>
    import FadeInSection from '$lib/components/FadeInSection.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import Footer from '$lib/Footer.svelte';
  
    $: url = $page.url;
    
    // SEO-Variablen hinzufügen
    const pageTitle = "Ice Age Mammals | Interactive Exhibition | FXMA Design";
    const pageDescription = "An interactive museum installation with Reed sensors, 3D-printed game pieces, and projection mapping that brings the saber-toothed tiger to life through playful interaction.";
    const pageKeywords = "interactive installation, museum exhibit, projection mapping, saber-toothed tiger, UX design, physical computing, Ice Age Mammals";

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
  
    // Nur die statische Navigation beibehalten
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
  
    
    
  
    
  </script>
  
  <!-- Head-Bereich für SEO -->
<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription}>
  <meta name="keywords" content={pageKeywords}>
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://fxma.design/project/iceAgeMammals">
  
  <!-- Open Graph Tags für Social Media -->
  <meta property="og:title" content={pageTitle}>
  <meta property="og:description" content={pageDescription}>
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://fxma.design/project/iceAgeMammals">
  <meta property="og:image" content="https://fxma.design/ice-cover.png">
  
  <!-- Strukturierte Daten für Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Ice Age Mammals Interactive Installation",
    "description": "An interactive museum installation that brings the saber-toothed tiger to life through tangible interaction with 3D-printed game pieces and projection mapping.",
    "creator": {
      "@type": "Person",
      "name": "Franz"
    },
    "keywords": "interactive installation, projection mapping, museum exhibit, physical computing",
    "isPartOf": {
      "@type": "WebSite",
      "name": "FXMA Design",
      "url": "https://fxma.design"
    },
    "image": "https://fxma.design/ice-cover.png"
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
        <h1>Ice Age Mammals</h1>
      </div>
      <div class="project-columns">
        <div class="project-column">
          <h3>My Role</h3>
          <div class="divider"></div>
          <p>
            UI/UX Designer, Interactive Installation Designer, Projection Mapping Developer, Video Production Lead, 3D Printing Coordinator, Arduino Programming
          </p>
        </div>
        <div class="project-column">
          <h3>Project Overview</h3>
          <div class="divider"></div>
          <p>
            An interactive table using Reed sensors, a 3D-printed game piece, and projection mapping to let users explore the saber-toothed tiger through playful interaction.  
          </p>
        </div>
        <div class="project-column">
          <h3>Project Tags</h3>
          <div class="divider"></div>
          <div class="tags">
            <div class="tag">Interactive Installation</div>
            <div class="tag">UX/UI-Design</div>
            <div class="tag">Gamification</div>
            <div class="tag">Prototyping</div>
            <div class="tag">Open Data</div>
            <div class="tag">Usability</div>
            <div class="tag">Human-Centered Design</div>
          </div>
        </div>
      </div>
  
  
    </div>
  
  
  
  <div class="cover-section"
    role="figure"
    on:mousemove={handleMouseMove}
    on:mouseleave={resetTransform}>
  <img src="/ice-cover.png" alt="Interactive table installation for the Ice Age Mammals exhibition with projected visualization of a saber-toothed tiger" />
  </div>
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
        <div>
        <h4>Introduction</h4>
        <br>
        <p class="text-doku">
            As part of the Interactive Communication Systems 1 course, we designed and built an interactive table that allows users to explore Ice Age animals through a tangible and immersive experience. Our team focused on the saber-toothed tiger (Smilodon) and developed an interaction system using Reed sensors and a magnetized 3D-printed game piece.
                    <br>
                    <p class="text-doku"> 
                        By moving the figure across specific trigger points, users activate different events and animations, unlocking information about the animal’s habitat, hunting strategies, and social behavior. A custom-built control panel allows further navigation, enhanced by color-coded indicators for intuitive interaction. The entire interface was projected onto the table using a ceiling-mounted projector, creating a visually engaging experience that blended physical and digital elements seamlessly.                    </p>
      </div>
    </FadeInSection>
    </div>
    </div>


    <div class="grid-section1">
      <div class="ice-img-grid">
        <div class="row">
        <div class="grid-item"><img src="/iceGrid1.png" alt="Building process of the interactive table showing wooden base structure assembly" /></div>
        <div class="grid-item"><img src="/iceGrid2.png" alt="Close-up of carving and layering work on the wooden landscape structure" /></div>
    </div>
        <div class="grid-item full-width"><img src="/iceGrid3.png" alt="Full overview of the table structure with embedded sensor slots before electronics installation" /></div>
        <div class="grid-item full-width"><img src="/iceGrid4.png" alt="Close-up view of the layered landscape design showing topographic features" /></div>
        <div class="row">
        <div class="grid-item"><img src="/iceGrid5.png" alt="Electronic components being installed within the table's wooden framework" /></div>
        <div class="grid-item"><img src="/iceGrid6.png" alt="Reed sensor wiring and connection points being prepared for game piece detection" /></div>
    </div>
    <div class="row">
        <div class="grid-item"><img src="/iceGrid7.png" alt="Testing phase of the interactive system with Arduino connections visible" /></div>
        <div class="grid-item"><img src="/iceGrid8.png" alt="Final assembly steps of the physical table structure before projection mapping" /></div>
    </div>
        <div class="grid-item full-width"><img src="/iceGrid9.png" alt="Overhead view of the completed wooden landscape with all sensor positions marked" /></div>
      </div>
    </div>


  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
        <h4>Building the <br> 
            Interactive Table</h4>
        <br>
        <p class="text-doku">
            To create a three-dimensional landscape, we cut and layered wooden plates, gluing them together for added depth and structure. We then carved out designated slots where the game piece would be placed, embedding Reed sensors underneath and wiring them to an Arduino system to detect user interactions.        </p> <br>
        <p class="text-doku">
            Once assembled, we brought the table to life by projecting a dynamic landscape onto its surface using a ceiling-mounted projector. This combination of physical depth and digital projection created an immersive, interactive experience, seamlessly blending tangible and visual storytelling.        </p>
      </div>
      </FadeInSection>
      </div>
    </div>

  <div class="grid-section1">
    <div class="icegrid2-container">
      <div class="icegrid2-item"><img src="/iceGrid2/iceGrid2-1.png" alt="Close-up of the interactive controller during assembly showing internal wiring components" /></div>
      <div class="icegrid2-item"><img src="/iceGrid2/iceGrid2-2.png" alt="D-pad controller design with illuminated buttons for intuitive navigation" /></div>
      <div class="icegrid2-item"><img src="/iceGrid2/iceGrid2-3.png" alt="Testing the controller's electrical connections with Arduino interface" /></div>
      <div class="icegrid2-item"><img src="/iceGrid2/iceGrid2-4.png" alt="Controller housing with color-coded lighting showing active control options" /></div>
      <div class="icegrid2-item"><img src="/iceGrid2/iceGrid2-5.png" alt="Completed navigation controller with integrated feedback system ready for installation" /></div>
      <!-- Weitere Bilder können hier hinzugefügt werden -->
    </div>
  </div>
  
  
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
        <h4>Navigation Controller</h4>
        <br>
        <p class="text-doku">
            To enable intuitive user navigation, we explored different interaction methods and ultimately settled on a control panel with a directional pad. This D-pad design allows users to seamlessly move through the information, ensuring a smooth and engaging experience.        
            <br>
            <p class="text-doku">
                We built the controller using a 3D-printed case, which was assembled and glued together. Inside, 3D-printed buttons press against physical switches, sending navigation inputs to an Arduino system. To enhance usability, we integrated color-coded lighting, guiding users toward the active controls and making interaction more intuitive and accessible.    
            </p>  </div>
      </FadeInSection>
      </div>
    </div>

    <div class="grid-section1">
        <div class="text-grid1">
          <FadeInSection>
            <div>
          <h4>Bringing the Interaction to Life</h4>
          <br>
          <p class="text-doku">
            With the final setup, users explore the saber-toothed tiger’s world through sensor-based interaction, dynamic lighting, and projection mapping, creating an immersive experience.              <br>
        </div>
        </FadeInSection>
        </div>
      </div>


      <!-- Erster Slider - automatisch von rechts nach links -->
      <div class="slider-container slider-right">
        <div class="slider-track">
          <!-- Erste Gruppe von Bildern -->
          <div class="slider-item"><img src="/sliderIce1/slider1-1.png" alt="Final installation view showing the illuminated interactive table with projected visualization" /></div>
          <div class="slider-item"><img src="/sliderIce1/slider1-2.png" alt="Close-up of game piece interaction triggering the saber-toothed tiger animation on the table" /></div>
          <div class="slider-item"><img src="/sliderIce1/slider1-3.png" alt="Side view of the table showing the projection mapping aligned with the physical landscape" /></div>
          <div class="slider-item"><img src="/sliderIce1/slider1-4.png" alt="User testing the interactive experience with the 3D-printed magnetized game piece" /></div>
          <!-- Wiederholen für nahtloses Looping -->
          <div class="slider-item"><img src="/sliderIce1/slider1-1.png" alt="Final installation view showing the illuminated interactive table with projected visualization" /></div>
          <div class="slider-item"><img src="/sliderIce1/slider1-2.png" alt="Close-up of game piece interaction triggering the saber-toothed tiger animation on the table" /></div>
          <div class="slider-item"><img src="/sliderIce1/slider1-3.png" alt="Side view of the table showing the projection mapping aligned with the physical landscape" /></div>
          <div class="slider-item"><img src="/sliderIce1/slider1-4.png" alt="User testing the interactive experience with the 3D-printed magnetized game piece" /></div>
          <!-- Eine weitere Wiederholung für bessere Abdeckung -->
          <div class="slider-item"><img src="/sliderIce1/slider1-1.png" alt="Final installation view showing the illuminated interactive table with projected visualization" /></div>
          <div class="slider-item"><img src="/sliderIce1/slider1-2.png" alt="Close-up of game piece interaction triggering the saber-toothed tiger animation on the table" /></div>
          <div class="slider-item"><img src="/sliderIce1/slider1-3.png" alt="Side view of the table showing the projection mapping aligned with the physical landscape" /></div>
          <div class="slider-item"><img src="/sliderIce1/slider1-4.png" alt="User testing the interactive experience with the 3D-printed magnetized game piece" /></div>
        </div>
      </div>
  
      <!-- Zweiter Slider - automatisch von links nach rechts -->
      <div class="slider-container slider-left">
        <div class="slider-track">
          <!-- Bilder dreifach für nahtloses Looping -->
          <div class="slider-item"><img src="/sliderIce2/slider2-1.png" alt="Night view of the exhibition setup with dramatic lighting highlighting the table installation" /></div>
          <div class="slider-item"><img src="/sliderIce2/slider2-2.png" alt="Interactive scene showing the saber-toothed tiger's habitat with information overlay" /></div>
          <div class="slider-item"><img src="/sliderIce2/slider2-3.png" alt="User interacting with the controller to navigate through information categories" /></div>
          <div class="slider-item"><img src="/sliderIce2/slider2-4.png" alt="Detail view of the animated projection responding to the physical game piece position" /></div>
          <!-- Erste Wiederholung -->
          <div class="slider-item"><img src="/sliderIce2/slider2-1.png" alt="Night view of the exhibition setup with dramatic lighting highlighting the table installation" /></div>
          <div class="slider-item"><img src="/sliderIce2/slider2-2.png" alt="Interactive scene showing the saber-toothed tiger's habitat with information overlay" /></div>
          <div class="slider-item"><img src="/sliderIce2/slider2-3.png" alt="User interacting with the controller to navigate through information categories" /></div>
          <div class="slider-item"><img src="/sliderIce2/slider2-4.png" alt="Detail view of the animated projection responding to the physical game piece position" /></div>
          <!-- Zweite Wiederholung für bessere Abdeckung -->
          <div class="slider-item"><img src="/sliderIce2/slider2-1.png" alt="Night view of the exhibition setup with dramatic lighting highlighting the table installation" /></div>
          <div class="slider-item"><img src="/sliderIce2/slider2-2.png" alt="Interactive scene showing the saber-toothed tiger's habitat with information overlay" /></div>
          <div class="slider-item"><img src="/sliderIce2/slider2-3.png" alt="User interacting with the controller to navigate through information categories" /></div>
          <div class="slider-item"><img src="/sliderIce2/slider2-4.png" alt="Detail view of the animated projection responding to the physical game piece position" /></div>
        </div>
      </div>
  

  
  
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
      <h4>Style Guide & Visual Design</h4>
      <br>
      <p class="text-doku">
        We used Lacquer for a bold look and Kulim Park for readability, paired with earthy Ice Age tones for immersion. Our team collaboratively designed illustrations to create a realistic and engaging experience, bringing the saber-toothed tiger’s world to life.  
       </p></div>
      </FadeInSection>
    </div>
  </div>
  
  <div class="img-section-4">
    <div class="img-container"><img src="/iceFarbe.png" alt="Color palette for the Ice Age Mammals project featuring earthy tones inspired by the Ice Age period" /></div>
</div>
<div class="img-section-4">
    <div class="img-container"><img src="/iceAsset1.png" alt="Typography specifications showing Lacquer and Kulim Park fonts with styling guidelines" /></div>
</div>
<div class="img-section-4">
    <div class="img-container"><img src="/iceAsset2.png" alt="Custom illustration set for the project including saber-toothed tiger and environmental elements" /></div>
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
            <span class="tool-name">Arduino IDE</span>
            <span class="tool-role">Embedded Development</span>
          </div>
          <div class="tool">
            <span class="tool-name">Premiere Pro</span>
            <span class="tool-role">Video Editing</span>
          </div>
          <div class="tool">
            <span class="tool-name">Soldering iron</span>
            <span class="tool-role">Soldering & Electronics</span>
          </div>
          <div class="tool">
            <span class="tool-name">Projector</span>
            <span class="tool-role">Visual Presentation</span>
          </div>
          <div class="tool">
            <span class="tool-name">Ultimaker</span>
            <span class="tool-role">3D Printing</span>
          </div>
          <div class="tool">
            <span class="tool-name">Autodesk</span>
            <span class="tool-role">3D Modeling</span>
          </div>
        </div>
      </div>
    </div>
  </FadeInSection>
</div>


<div class="back-btn-container bottom-back">
  <button on:click={goBackToStatic}>
    <img src="/leftArrow.png" alt="Back arrow icon" />
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
    color: #7DAA62;
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
    grid-template-rows: repeat(1, auto);
    gap: 8px;
    margin-top: 7rem;
    width: 100%;
  }
  
  .text-grid1 {
    grid-column: 1 / span 4;
  }
  
  h4 {
    font-family: 'Franz-Plex', mono;
    color: #7DAA62;
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
  
  /* Ice Age Mammals spezifisches Bildergitter */
  .ice-img-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    margin: 0;
    grid-column: 1 / span 4;
    width: 100%;
  }
  
  /* Zeilencontainer für 2-spaltige Bilder */
  .ice-img-grid .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    grid-column: 1 / span 4; /* Nimmt die volle Breite des parent-grids ein (4 Spalten) */
    width: 100%;
    filter: grayscale(100%); /* Grayscale auf Reihenebene */
    transition: filter 0.8s ease;
  }
  
  /* Hover-Effekt auf Zeilenebene */
  .ice-img-grid .row:hover {
    filter: grayscale(0%);
  }
  
  /* Die einzelnen Grid-Items in den Rows */
  .ice-img-grid .row .grid-item {
    width: 100%;
    padding: 0;
    line-height: 0;
  }
  
  /* Elemente mit voller Breite nehmen alle 4 Spalten im Grid ein */
  .ice-img-grid .grid-item.full-width {
    grid-column: 1 / span 4;
    filter: grayscale(100%); /* Grayscale für Vollbreite-Items */
    transition: filter 0.8s ease;
  }
  
  /* Hover für Vollbreite-Items */
  .ice-img-grid .grid-item.full-width:hover {
    filter: grayscale(0%);
  }
  
  /* Allgemeine Bild-Styles */
  .ice-img-grid img {
    width: 100%;
    height: auto;
    object-fit: contain;
    object-position: center;
    transform: translateZ(0);
    display: block;
  }
  
  /* Neues Grid für icegrid2 */
  .icegrid2-container {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 0;
    grid-column: 1 / span 4; /* Nimmt 4 von 6 Spalten ein */
    width: 100%;
  }
  
  .icegrid2-item {
    width: 100%;
    line-height: 0; /* Verhindert unerwünschte Abstände */
    filter: grayscale(100%);
    transition: filter 0.8s ease;
  }
  
  .icegrid2-item:hover {
    filter: grayscale(0%);
  }
  
  .icegrid2-item img {
    width: 100%;
    height: auto;
    object-fit: contain;
    object-position: center;
    display: block; /* Verhindert unerwünschte Abstände */
  }
  
  /* Mobile Anpassungen für das neue Grid */
  @media (max-width: 768px) {
    .icegrid2-container {
      width: 100%;
    }
    
    .icegrid2-item {
      width: 100%;
    }
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

    
    /* Anpassung der Projektspaltenlayouts */
    .project-columns {
      flex-direction: column;
      gap: 2rem;
    }
    
    .project-columns .project-column {
      min-width: 100%;
    }
    
    .project-columns .project-column .divider,
    .project-columns .project-column p,
    .tags {
      width: 100%;
    }
    
    /* Mobile Bildgrid */
    .ice-img-grid {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .ice-img-grid .grid-item,
    .ice-img-grid .grid-item.full-width {
      width: 100%;
    }
    

    /* Grayscale-Effekte auf mobilen Geräten entfernen */
    .ice-img-grid .row {
      filter: grayscale(0%); /* Kein Grayscale auf mobil */
    }
    
    .ice-img-grid .grid-item.full-width {
      filter: grayscale(0%); /* Kein Grayscale auf mobil */
    }
    
    .icegrid2-item {
      filter: grayscale(0%); /* Kein Grayscale auf mobil */
    }
    
    /* Auch für Slider-Items Grayscale entfernen */
    .slider-item img {
      filter: grayscale(0%);
    }
    
    /* Slider Animationen eventuell verlangsamen für mobil */
    .slider-right .slider-track {
      animation: slideRight 45s linear infinite;
    }
    
    .slider-left .slider-track {
      animation: slideLeft 45s linear infinite;
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

  /* Horizontaler Slider mit Autoplay */
.slider-container {
  width: 100vw;
  overflow: hidden;
  margin: 4rem 0;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  height: auto;
  max-height: 220px; /* Leicht erhöht für bessere Darstellung */
  transition: max-height 0.3s ease; /* Animation für Höhenänderung */
}

/* Mehr Raum und Sichtbarkeit beim Hover über den Container */
.slider-container:hover {
  max-height: 320px; /* Leicht reduziert für angemessenere Größe */
  overflow: visible; /* Erlaubt Bildern, über den Container hinauszuragen */
  z-index: 100; /* Bringt den Container vor andere Elemente */
}

.slider-track {
  display: flex;
  gap: 0.5rem;
  width: max-content;
  padding: 0 5vw;
}

/* Animation-Anpassungen für bessere Abdeckung */
@keyframes slideRight {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50%));
  }
}

/* Für den unteren Slider: Angepasste Startposition und Bewegungsbereich */
@keyframes slideLeft {
  0% {
    transform: translateX(calc(-33.33%)); /* Erhöhter Startpunkt für mehr Bewegungsraum */
  }
  100% {
    transform: translateX(0);
  }
}

/* Slider-Animationen */
.slider-right .slider-track {
  animation: slideRight 30s linear infinite;
}

.slider-left .slider-track {
  animation: slideLeft 30s linear infinite;
}

.slider-item {
  flex: 0 0 auto;
  width: auto;
  height: auto;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

/* Stärkere Vergrößerung beim Hover */
.slider-container:hover .slider-item:hover {
  transform: scale(1.5); /* Deutlich stärkere Vergrößerung */
  z-index: 101; /* Noch höherer z-index für das gehovered Bild */
  filter: drop-shadow(0 0 12px rgba(0,0,0,0.6)); /* Schatten für besseren Kontrast */
}

/* Mindestbreite für die Slider-Tracks */
.slider-right .slider-track,
.slider-left .slider-track {
  min-width: 220vw; /* Stellt sicher, dass der Slider immer breiter als die Seite ist */
}

/* Slider-Tracks brauchen mehr Breite für den zweiten Slider */
.slider-left .slider-track {
  min-width: 280vw; /* Von 220vw erhöht für mehr Bildmaterial */
}

/* Sicherstellen, dass die Bilder vollständig sichtbar sind */
.slider-item img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: contain; /* Von cover auf contain geändert */
  object-position: center;
  border-radius: 8px;
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
  color: #7DAA62;
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