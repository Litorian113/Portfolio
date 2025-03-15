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

      <div class="cover-section"
      role="figure"
      on:mousemove={handleMouseMove}
      on:mouseleave={resetTransform}>
    <img src="/website2/website2-cover.png" alt="Beschreibung des Bildes" />
    </div>



      <div class="heading-container">
        <a href="https://zentrum-pferd.com" target="_blank" rel="noopener noreferrer" class="website-link">
          <h4>zentrum-pferd.com
            <svg class="link-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </h4>
        </a>
      </div>



      <div class="project-columns">
        <div class="project-column">
          <h3>My Role</h3>
          <div class="divider"></div>
          <p>
            I mainly worked in the creation of the Screendesign. Helped in the research process and played a big ass role
            in the videoproduction to get the final videoresult.
        
        </p>
        </div>
        <div class="project-column">
          <h3>Project Overview</h3>
          <div class="divider"></div>
          <p>
            I build a WordPress website for Zentrum Pferd, highlighting storytelling, usability, and Instagram integration.

          </p>
        </div>
        <div class="project-column">
          <h3>Project Tags</h3>
          <div class="divider"></div>
          <div class="tags">
            <div class="tag">Wordpress</div>
            <div class="tag">Instagram-Integration</div>
            <div class="tag">Storytelling</div>
            <div class="tag">Responsive</div>
            <div class="tag">Design-Collaboration</div>
            <div class="tag">Branddesign</div>
          </div>
        </div>
      </div>
  
  
    </div>
  
  
  
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
        <div>
        <h4>Introduction</h4>
        <br>
        <p class="text-doku">
            Together with a fellow designer, I designed and developed the Zentrum Pferd website to authentically reflect the passion and expertise of its owners. Our goal was to create a professional and inviting online presence that highlights their dedication to saddle craftsmanship and equine therapy.
                        </p>
        <br>
        <p class="text-doku">
            The website not only informs users about their services but also conveys their values, ensuring visitors immediately connect with their work. Through thoughtful storytelling and a clean design, we aimed to create a platform that feels both personal and trustworthy.
                                </p>
      </div>
    </FadeInSection>
    </div>
    </div>
  
  
  
    <div class="img-section-4">
      <div class="img-container"><img src="/website2/website2-bild1.png" alt="Beschreibung des Bildes" /></div>
  </div>
  
  


  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
      <div>
      <h4>Collaborative Design</h4>
      <br>
      <p class="text-doku">
        While working on this project, I had the opportunity to collaborate with Jens Kramer, who took the lead on storytelling, layout design, and graphics, as well as providing the photography for the website. His expertise played a key role in shaping the visual and narrative structure, and I learned a lot from his approach to composition, user engagement, and design systems.
                          </p>
      <br>
      <p class="text-doku">
        My main focus was on the technical implementation and website development, ensuring a smooth and functional execution.
        Built with WordPress, the site allows the owners to manage their content independently, making updates and adjustments easy without external support.
                                  </p>
                                        <br>
      <p class="text-doku">
        One of the key technical elements was integrating an Instagram API, which automatically displays their latest social media posts, keeping the website dynamic and engaging. This collaboration was an incredibly valuable experience, allowing me to refine my technical skills while learning from an experienced designer, reinforcing my passion for teamwork, problem-solving, and continuous growth.
                                      </p>
    </div>
  </FadeInSection>
  </div>
  </div>
  <div class="grid-section1">
    <div class="text-grid1">
  <h4>Key Learnings</h4>
</div>
</div>
  
  
    <div class="img-section-4">
      <div class="img-container"><img src="/website2/website2-bild2.png" alt="Beschreibung des Bildes" /></div>
  </div>
  
  <div class="collaborators-section">
    <div class="divider-large"></div>
    
    <FadeInSection>
      <div class="collaborators-content">
        <h4>The People Behind the Project</h4>
        <div class="collaborators-list">
          <div class="collaborator">Jens Kramer</div>
          <div class="collaborator">Franz Anhäupl</div>
        </div>
      </div>
    </FadeInSection>
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
    color: #EC0011;
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

  .website-link h4 {
    color: #EC0011; /* Die bestehende Farbe beibehalten */
    transition: color 0.2s ease;
    font-size: 2rem; /* Etwas größer als normal */
  }

  /* Hover-Effekt für den Link */
  .website-link:hover h4 {
    color: #e41f2c; /* Hellere Farbe beim Hover */
  }

  /* Optional: Unterstreichungseffekt beim Hover */
  .website-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #e2444e;
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

  /* Abschlusssection für Projektmitarbeiter */
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
  </style>