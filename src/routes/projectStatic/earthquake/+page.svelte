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
  
    // Alte Flur-Funktion entfernen
    /* function goBackToFlur() {
      const cx = url.searchParams.get('cx') ?? 0;
      const cy = url.searchParams.get('cy') ?? 0;
      const cz = url.searchParams.get('cz') ?? 20;
      goto(`/?cx=${cx}&cy=${cy}&cz=${cz}`);
    } */
    
    // Neue Funktion für die Navigation zur statischen Hauptseite
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
        <h2>Earthquakes & <br> Tsunami Data</h2>
      </div>
      <div class="project-columns">
        <div class="project-column">
          <h3>My Role</h3>
          <div class="divider"></div>
          <p>
            Data Visualization Engineer, Web Developer, Interactive Visualization, Web Development, 3D Mapping, UX/UI Design, JSON Data Handling
          </p>
        </div>
        <div class="project-column">
          <h3>Project Overview</h3>
          <div class="divider"></div>
          <p>
            Interactive visualizations of earthquake and tsunami data, including a 2D world map, 3D globe, timelines, and depth analysis with filtering and hover effects.
          </p>
        </div>
        <div class="project-column">
          <h3>Project Tags</h3>
          <div class="divider"></div>
          <div class="tags">
            <div class="tag">Three.js</div>
            <div class="tag">Javascript</div>
            <div class="tag">HTML/CSS</div>
            <div class="tag">GitHub</div>
            <div class="tag">Datavisualisation</div>
            <div class="tag">Control-Panel</div>
            <div class="tag">Filtering & Animation</div>
          </div>
        </div>
      </div>
  
  
    </div>
  
  
  
    <div class="cover-section"
    role="figure"
    on:mousemove={handleMouseMove}
    on:mouseleave={resetTransform}>
  <img src="/earthquake/earthquake-cover.png" alt="Beschreibung des Bildes" />
  </div>
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
        <div>
        <h4>Datavisualisation</h4>
        <br>
        <p class="text-doku">
          This project was developed as part of the Programming 2 course, with the goal of analyzing the correlation between earthquakes and tsunamis using real-world data. By leveraging geospatial datasets, I aimed to identify patterns and visualize the relationship between these natural disasters in an interactive and intuitive way.
                </p>
                    <br>
                    <p class="text-doku"> 
                      The main feature is a 2D world map, where earthquakes and tsunamis are plotted based on latitude and longitude. Users can filter earthquakes by three intensity levels or disable earthquake and tsunami data independently. Hover effects provide additional event details, enhancing data exploration.
                    </p>
      </div>
    </FadeInSection>
    </div>
    </div>

    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
        <h4>Color Representation</h4>
        <br>
        <p class="text-doku">
          I used three shades of red for earthquakes and three shades of blue for tsunamis to ensure clear distinction. The shades represent magnitude for earthquakes and intensity for tsunamis, maintaining consistency across all visualizations for an intuitive experience.
                </p>
          </div>
      </FadeInSection>
      </div>
    </div>


      <div class="img-section-4">
        <div class="img-container"><img src="/earthquake/Bild2.png" alt="Beschreibung des Bildes" /></div>
    </div>


  
<div class="grid-container">
  <!-- Erste Zeile: Bild 1 -->
  <div class="grid-row">
    <div class="grid-image">
      <img src="/earthquake/grid1.png" alt="Karte mit Migrations-Hotspots" />
    </div>
    <div class="grid-text">
      <h4>Earthquake Filter</h4>
      <p class="text-doku">
        A complete visualization of all recorded earthquakes plotted on a 2D world map. The dataset reveals global seismic activity, with interactive filtering options available for deeper exploration.
            </p>
    </div>
  </div>

  <div class="grid-row">
    <div class="grid-image">
      <img src="/earthquake/grid2.png" alt="Karte mit Migrations-Hotspots" />
    </div>
    <div class="grid-text">
      <h4>Tsunami Filter</h4>
      <p class="text-doku">
        This view displays only tsunami occurrences, highlighted in different shades of blue based on intensity. Without earthquake data, it provides a clear perspective on the global distribution of tsunamis.
            </p>
    </div>
  </div>
  <div class="grid-row">
    <div class="grid-image">
      <img src="/earthquake/grid3.png" alt="Karte mit Migrations-Hotspots" />
    </div>
    <div class="grid-text">
      <h4>Strong Earthquakes Filter</h4>
      <p class="text-doku">
        A filtered view showing only the most intense earthquakes, represented by deep red dots. This visualization helps identify regions most affected by high-magnitude seismic events.
            </p>
    </div>
  </div>
  <div class="grid-row">
    <div class="grid-image">
      <img src="/earthquake/grid4.png" alt="Karte mit Migrations-Hotspots" />
    </div>
    <div class="grid-text">
      <h4>Earthquake-Tsunami Connections</h4>
      <p class="text-doku">
        This timeline view highlights connections between earthquakes and tsunamis over the years. Users can filter events by year and examine which earthquakes triggered tsunamis.
            </p>
    </div>
  </div>
  <div class="grid-row">
    <div class="grid-image">
      <img src="/earthquake/grid5.png" alt="Karte mit Migrations-Hotspots" />
    </div>
    <div class="grid-text">
      <h4>Animated Earthquake Timeline</h4>
      <p class="text-doku">
        A dynamic visualization of global earthquake occurrences over time. Users can play an animation that sequentially displays where and when earthquakes happened.
            </p>
    </div>
  </div>
  <div class="grid-row">
    <div class="grid-image">
      <img src="/earthquake/grid6.png" alt="Karte mit Migrations-Hotspots" />
    </div>
    <div class="grid-text">
      <h4>Depth & Intensity Visualization</h4>
      <p class="text-doku">
        This page presents a 2D circular chart where earthquakes are plotted based on intensity and depth. Hovering over a point reveals additional details about each event.      </p>
    </div>
  </div>
  <div class="grid-row">
    <div class="grid-image">
      <img src="/earthquake/grid7.png" alt="Karte mit Migrations-Hotspots" />
    </div>
    <div class="grid-text">
      <h4>3D Globe Visualization</h4>
      <p class="text-doku">
        This page maps earthquake and tsunami data onto a 3D globe, incorporating depth information. Users can explore earthquake depths in a spatial context for a more comprehensive understanding.
            </p>
    </div>
  </div>
  

</div>

<div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
      <h4>Project-Structure</h4>
        </div>
    </FadeInSection>
    </div>
  </div>

<div class="img-section-4">
    <div class="img-container"><img src="/earthquake/Bild3.png" alt="Beschreibung des Bildes" /></div>
</div>
  
<div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
      <h4>Results and Challenges</h4>
      <br>
      <p class="text-doku">
        One major challenge was the inconsistent formatting and unequal dataset sizes—24,000 earthquakes vs. 2,000 tsunamis—making it difficult to verify correlations. Ensuring data completeness and accuracy was crucial, so incomplete intensity entries were excluded.
                </p>
      <br>
      <p class="text-doku">
        Despite these hurdles, my hypothesis was confirmed: over 400 tsunamis were directly linked to earthquakes based on location and timing. Additionally, the data revealed that only strong earthquakes typically trigger tsunamis—less than 3% of quakes below magnitude 6 led to a tsunami.
              </p>
    <br>
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
              <span class="tool-name">Three.js</span>
              <span class="tool-role">3D Data Visualization</span>
            </div>
            <div class="tool">
              <span class="tool-name">Kaggle</span>
              <span class="tool-role">Data Analysis & Exploration</span>
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
  
  .heading-container h2 {
    width: 100%;
    text-align: left;
    font-size: 6rem;
    margin: 0;
    padding: 0.5rem 0;
    font-family: 'Franz-Grotesk', sans-serif;
    color: #F2BA40;
    letter-spacing: 0.1rem;
    line-height: 6rem;
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
    color: #F2BA40;
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
    
    /* Anpassung der Überschriftengröße und -höhe */
    .heading-container {
      height: auto;
      margin-top: 1rem;
      margin-bottom: 2rem;


    }
    
    .heading-container h2 {
      font-size: 4rem;

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
    
 
    


  }
  
  /* Noch kleinere Geräte */
  @media (max-width: 480px) {
    .heading-container h2 {
      font-size: 3rem;
      line-height: 3rem;
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


/* Verbesserte Media Queries für die Überschrift */
@media (max-width: 768px) {
  .heading-container h2 {
    font-size: 3.5rem;  /* Etwas kleiner als zuvor (4rem) */
    line-height: 1;     /* Reduzierter Zeilenabstand für besseren Umbruch */
    letter-spacing: 0;  /* Kein zusätzlicher Buchstabenabstand für kompakteres Aussehen */
  }
}

@media (max-width: 480px) {
  .heading-container h2 {
    font-size: 2.4rem;  /* Deutlich kleiner für kleine Geräte */
    line-height: 0.9;   /* Noch mehr reduzierter Zeilenabstand */
    margin-bottom: 1rem; /* Mehr Platz nach unten hinzufügen */
  }
}

/* Falls du zu h1 wechselst (für SEO), diese Regeln hinzufügen: */
@media (max-width: 768px) {
  .heading-container h1 {
    font-size: 3.5rem;
    line-height: 1;
    letter-spacing: 0;
  }
}

@media (max-width: 480px) {
  .heading-container h1 {
    font-size: 2.4rem;
    line-height: 0.9;
    margin-bottom: 1rem;
  }
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


/* Neues Grid-Layout für die Bilder mit Beschreibungen */
.grid-container {
  margin: 7rem 0;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 3rem;
  margin-bottom: 7rem;
  align-items: center;
}

.grid-row:last-child {
  margin-bottom: 0;
}

.grid-image {
  grid-column: span 4;
}

.grid-image img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.grid-text {
  grid-column: span 2;
}

.grid-text h4 {
  margin-top: 0;
  margin-bottom: 1rem;
}

/* Tablet-Anpassung (bereits bei größeren Tablets umbrechen) */
@media (max-width: 1024px) {
  .grid-row {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 5rem;
  }
  
  .grid-image {
    grid-column: 1;
  }
  
  .grid-text {
    grid-column: 1;
    max-width: 85%;
    margin: 0 auto;
  }
  
  .grid-text h4 {
    margin-top: 1rem;
  }
}

/* Bestehende Mobile-Anpassungen (für noch kleinere Geräte) */
@media (max-width: 768px) {
  .grid-row {
    gap: 1.5rem;
    margin-bottom: 4rem;
  }
  
  .grid-text {
    max-width: 100%;
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
  color: #F2BA40;
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