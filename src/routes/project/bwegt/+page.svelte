<script>
    import FadeInSection from '$lib/components/FadeInSection.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
  
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
        <h2>bwegt App</h2>
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
  <img src="/bwegt-doku1.png" alt="Beschreibung des Bildes" />
  </div>
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
        <div>
        <h4>Introduction</h4>
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
      <img src="/bwegt-doku2.png" alt="Beschreibung des Bildes" />
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
      <div class="img1"><img src="/grid1.png" alt="Beschreibung des Bildes" /></div>
      <div class="img2"><img src="/grid2.png" alt="Beschreibung des Bildes" /></div>
      <div class="img3"><img src="/grid3.png" alt="Beschreibung des Bildes" /></div>
      <div class="img4"><img src="/grid4.png" alt="Beschreibung des Bildes" /></div>
      <div class="img5"><img src="/grid5.png" alt="Beschreibung des Bildes" /></div>
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
      <div class="img-container"><img src="/bwegt-doku3.png" alt="Beschreibung des Bildes" /></div>
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
    <div class="img-container"><img src="/bwegt-doku4.png" alt="Beschreibung des Bildes" /></div>
  </div>
  
  <div class="img-section-4">
    <div class="img-container"><img src="/bwegt-doku5.png" alt="Beschreibung des Bildes" /></div>
  </div>
  
  <div class="image-section">
    <img src="/bwegt-doku6.png" alt="Beschreibung des Bildes" />
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
    <div class="img-container"><img data-src="/bwegt-doku7.png" alt="Beschreibung des Bildes" src="/placeholder.png" /></div>
  </div>
  
  
  
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
      width: 90%;
      /* Auf kleineren Bildschirmen nimmt der Inhalt 90% der Breite ein */
      max-width: 1300px;
      /* Bei großen Bildschirmen ist bei 1200px Schluss */
      margin: 0 auto;
      /* Zentriert den Inhalt horizontal */
      padding: 4rem 4rem;
      /* Optional: zusätzlicher Innenabstand links/rechts */
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
    gap: 0.5rem;             /* Abstand zwischen Bild und Text */
    background: transparent; /* Kein Fill */
    border: 1px solid white; /* Weiße Border */
    border-radius: 15px;     /* Border-Radius von 20 */
    padding: 0.8rem 2rem;
    font-size: 1rem;
    text-align: left;
    cursor: pointer;
  }
  
  /* Optional: Größe und Ausrichtung des Pfeils anpassen */
  .back-btn-container button img {
    height: 1.2em; /* passt die Höhe dem Text an */
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
      color: #FFCD06;
      letter-spacing: 0.1rem;
    }
  
    /* Drei Spalten Layout */
    .project-columns {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1rem;
    }
  
    /* Jede Spalte */
    .project-columns .project-column {
      flex: 1;
      min-width: 300px;
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
      width: 80%;
      height: 2px;
      background-color: grey;
      margin-bottom: 0.5rem;
    }
  
    .project-columns .project-column p {
      width: 80%;
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
      width: 85%;
      /* Erlaubt Zeilenumbruch, wenn nicht genug Platz */
      gap: 0.7rem;
      /* Abstand zwischen den Tag-Elementen */
      margin-top: 1rem;
      /* Optionaler Abstand nach oben */
    }
  
    /* Einzelnes Tag-Element */
    .tag {
      display: inline-flex;
      /* Sorgt für zentrierte Ausrichtung von Icon/Text, falls benötigt */
      align-items: center;
      padding: 0.5rem 1rem;
      /* Innenabstände (oben/unten, links/rechts) */
      background-color: #1B1D3A;
      /* Deine gewünschte Hintergrundfarbe */
      border-radius: 9999px;
      /* „Pill“-Form */
      color: #fff;
      /* Schriftfarbe */
      font-size: 1rem;
      /* Schriftgröße (Beispiel) */
      font-family: 'Franz-Grotesk', sans-serif;
      /* Optional: Schatten oder andere Effekte */
      /* box-shadow: 0 2px 4px rgba(0,0,0,0.15); */
    }
  
    .cover-section {
      width: 100%;
      /* overflow: hidden; */
      position: relative;
    }
    
    .cover-section img {
      display: block;
      width: 100%;
      height: auto;
      transition: transform 0.3s ease;
      transform: translate(0, 0);
      will-change: transform; /* Hilft dem Browser bei der Optimierung */
    }
  
    .image-section {
      width: 100%;
      /* Der Container selbst nimmt 100% der verfügbaren Breite ein */
      /* margin: 2rem 0;    Optionaler Abstand (oben/unten) */
      align-content: center;
      margin-top: 10rem;
    }
  
    /* Das Bild selbst: */
    .image-section img {
      width: 100%;
    height: 100%;
    object-fit: contain; /* Skaliert das Bild so, dass es reinpasst, ohne zu verzerren */
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
    /* Zentriert vertikal */
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
    transform: translateZ(0); /* Aktiviert Hardware-Acceleration */
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
    object-fit: contain; /* Skaliert das Bild so, dass es reinpasst, ohne zu verzerren */
    object-position: center;
  }

  /* Stelle sicher, dass diese Seite scrollbar ist */
  .scroll-container {
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }
  
  </style>
  


<!-- <style>
/* IBM Plex Mono Regular */
@font-face {
  font-family: 'IBM Plex Mono';
  src: url('/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* Space Grotesk Regular */
@font-face {
  font-family: 'Space Grotesk';
  src: url('/fonts/Space_Grotesk/static/SpaceGrotesk-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}


h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 96px;
    color: yellow;
}



</style> -->