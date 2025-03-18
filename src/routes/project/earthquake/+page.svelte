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
  
    function goBackToFlur() {
      const cx = url.searchParams.get('cx') ?? 0;
      const cy = url.searchParams.get('cy') ?? 0;
      const cz = url.searchParams.get('cz') ?? 20;
      goto(`/?cx=${cx}&cy=${cy}&cz=${cz}`);
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
        <button on:click={goBackToFlur}>
          <img src="/leftArrow.png" alt="Back arrow" />
          Back
        </button>
      </div>
      <div class="heading-container">
        <h2>Earthquakes</h2>
      </div>
      <div class="project-columns">
        <div class="project-column">
          <h3>My Role</h3>
          <div class="divider"></div>
          <p>I mainly worked in the creation of the Screendesign. Helped in the research process and played a big ass role
            in the videoproduction to get the final videoresult.</p>
        </div>
        <div class="project-column">
          <h3>Project Overview</h3>
          <div class="divider"></div>
          <p>
            An interactive 3D globe visualizing migration data, highlighting routes, risk areas, and key patterns to reveal the human impact behind the numbers.
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
            <div class="tag">Illustration</div>
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
            As part of our 3D Fundamentals course, we analyzed the Missing Migrants dataset to explore patterns in global migration crises. It was particularly interesting to see how some of our initial expectations were confirmed, while others revealed unexpected insights once visualized on the globe. 
        </p>
                    <br>
                    <p class="text-doku"> 
                        To implement the interactive 3D data visualization, we used Three.js along with HTML, CSS, and plain JavaScript. The dataset was mapped onto a custom-built 3D globe, allowing users to filter incidents by criteria such as cause of death or gender. Additionally, we integrated AI-generated voices from Envato to narrate key data points, enhancing the auditory experience. All visible graphics and design elements were created by our team, ensuring a cohesive and immersive representation of the data.
                        This project highlighted the power of data visualization in uncovering global patterns, making complex statistics more accessible and engaging.

                    </p>
      </div>
    </FadeInSection>
    </div>
    </div>

    <div class="image-section">
        <img src="/migrants/migrants1.png" alt="Beschreibung des Bildes" />
      </div>



  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
        <h4>Color Mapping & Data Representation</h4>
        <br>
        <p class="text-doku">
            We used four colors to visually differentiate data points and highlight the scale of migrant disappearances. Gray represents inactive or deselected states, keeping the focus on selected data. Active points follow a gradient scale:
        </p>
          </div>
      </FadeInSection>
      </div>
    </div>


    <div class="img-section-4">
        <div class="img-container"><img src="/migrants/migrants2.png" alt="Beschreibung des Bildes" /></div>
    </div>


  
<div class="grid-container">
  <!-- Erste Zeile: Bild 1 -->
  <div class="grid-row">
    <div class="grid-image">
      <img src="/migrants/grid/migrants-grid-1.png" alt="Karte mit Migrations-Hotspots" />
    </div>
    <div class="grid-text">
      <h4>Globe Overview</h4>
      <p class="text-doku">This view shows the 3D globe with pins marking incidents. The left panel allows filtering by fatality type and gender. Red dots vary in size and color, indicating the scale of each event.</p>
    </div>
  </div>
  
  <!-- Zweite Zeile: Bild 2 -->
  <div class="grid-row">
    <div class="grid-image">
      <img src="/migrants/grid/migrants-grid-2.png" alt="Detailansicht einer Migrationsroute" />
    </div>
    <div class="grid-text">
      <h4>Infocard</h4>
      <p class="text-doku">The infocard can be opened and closed, and the speaker button at the top lets users hear the text read aloud by an AI voice. It provides detailed information about specific incidents or locations.</p>
    </div>
  </div>
  
  <!-- Dritte Zeile: Bild 3 -->
  <div class="grid-row">
    <div class="grid-image">
      <img src="/migrants/grid/migrants-grid-3.png" alt="Globale Übersicht der Migrationsdaten" />
    </div>
    <div class="grid-text">
      <h4>Time Slider</h4>
      <p class="text-doku">The time slider is in use, allowing the user to explore incidents over time. This feature lets users track the progression of events across different dates while navigating the globe.</p>
    </div>
  </div>
  
  <!-- Vierte Zeile: Bild 4 -->
  <div class="grid-row">
    <div class="grid-image">
      <img src="/migrants/grid/migrants-grid-4.png" alt="Kontrollpanel der Anwendung" />
    </div>
    <div class="grid-text">
      <h4>Filter Option</h4>
      <p class="text-doku">The user selected a specific fatality option, with highlighted dots showing relevant incidents, while non-relevant dots are gray. The pins are turned off to allow for easier exploration of the globe.</p>
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
    <div class="img-container"><img src="/migrants/migrants3.png" alt="Beschreibung des Bildes" /></div>
</div>
  
<div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
      <h4>Reflections & Insights</h4>
      <br>
      <p class="text-doku">
        This project provided valuable lessons in both technical implementation and data analysis. Working with Three.js deepened our understanding of 3D visualization, while handling real-world datasets taught us how to process, interpret, and highlight key insights effectively.
          </p>
      <br>
      <p class="text-doku">
        Through our interactive globe and time slider, we visualized global migration hotspots, such as the Mexican border, the Darién Gap, and the Mediterranean Sea, revealing patterns of risk and crisis. It was striking to see how some expectations were confirmed, while others challenged our assumptions.
        </p>
    <br>
    <p class="text-doku">
        Beyond the data, this project reinforced the human impact behind the numbers, emphasizing the urgent need for awareness, policy change, and humanitarian efforts to address forced migration worldwide.
      </p>
        </div>
    </FadeInSection>
    </div>
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
    
    .heading-container h2 {
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
    .heading-container h2 {
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

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .grid-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 4rem;
  }
  
  .grid-image {
    grid-column: 1;
  }
  
  .grid-text {
    grid-column: 1;
  }
}
</style>