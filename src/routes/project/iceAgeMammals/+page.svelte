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
        <h2>Nass Device</h2>
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
          <p>NASS is a portable water testing device with a simple E-Ink interface and open-data sharing, designed to make water quality analysis accessible.
  
          </p>
        </div>
        <div class="project-column">
          <h3>Project Tags</h3>
          <div class="divider"></div>
          <div class="tags">
            <div class="tag">Product-Design</div>
            <div class="tag">UX/UI-Design</div>
            <div class="tag">E-Ink Interface</div>
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
  <img src="/Nass-cover.png" alt="Beschreibung des Bildes" />
  </div>
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
        <div>
        <h4>Introduction</h4>
        <br>
        <p class="text-doku">
          During our Innovation 1 course at HfG, we explored solutions for one of the world’s most pressing issues: unsafe drinking water. Every year, millions suffer from waterborne diseases, especially in regions like Uganda, where contaminated water—often carrying E. coli bacteria—poses a severe health risk.</p>
        <br><p class="text-doku"> To address this, we developed NASS (Network for Aquatic Substance Sensors)—a portable water testing device that allows non-specialists to quickly check water quality. The collected data is shared on an open platform, helping local communities and NGOs make informed decisions about water safety. Our goal was to create an affordable, accessible, and intuitive solution to prevent waterborne illnesses and save lives.</p>
      </div>
    </FadeInSection>
    </div>
    </div>
  
    <div class="img-section-2col">
      <div class="img-container-left">
        <img src="/Nass-Doku1.png" alt="NASS Device Präsentation" />
      </div>
      <div class="img-container-right">
        <img src="/Nass-Doku2.png" alt="NASS Device Detail" />
      </div>
    </div>
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
        <h4>Research</h4>
        <br>
        <p class="text-doku">
          Initially, we envisioned a universal water testing device, but research revealed the need for a more focused approach. Testing multiple contaminants in one device proved technically complex, and water issues vary by region.
        </p> <br>
        <p class="text-doku">
          We shifted our focus to Uganda, where unsafe drinking water is a major health risk. Our goal was to design a user-friendly, affordable device that enables non-specialists to detect key contaminants like E. coli. By integrating an open-data platform, NASS helps communities and NGOs take informed action against waterborne diseases.
        </p>
      </div>
      </FadeInSection>
      </div>
    </div>
  
    <div class="img-section-4">
      <div class="img-container"><img src="/Nass-Doku3.png" alt="Beschreibung des Bildes" /></div>
  </div>
  
  
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
        <h4>Universal Icon Language</h4>
        <br>
        <p class="text-doku">
          To ensure clarity and usability, we developed a minimalist visual style with a strong focus on intuitive iconography. We used the Untitled UI library as a foundation and created custom icons to fit the specific needs of our device and interface.      </p>
        <br><p class="text-doku">
          Given the international context, we carefully considered cultural differences in symbol interpretation, ensuring that icons were universally recognizable—even for users with low literacy levels. The icons were designed to be easily readable on both the website and the small E-Ink display, maintaining high contrast and simplicity for maximum accessibility.      </p>
      </div>
      </FadeInSection>
      </div>
    </div>
  
    <div class="img-section-4">
      <div class="img-container"><img src="/Nass-Doku4.png" alt="Beschreibung des Bildes" /></div>
  </div>
  
  <div class="img-section-4">
    <div class="img-container"><img src="/Nass-Doku5.png" alt="Beschreibung des Bildes" /></div>
  </div>
  
  
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
      <h4>Final Product</h4>
      <br>
      <p class="text-doku">
        Our water testing device was designed for ease of use, efficiency, and durability. The ergonomic shape ensures comfortable handling, with a dedicated slot for replaceable test tubes. A simple two-button interface allows for intuitive navigation, while the E-Ink display provides high contrast and low power consumption, ensuring readability in all conditions. The UI guides users step by step, minimizing errors. The final prototype was modeled in Fusion 360, 3D-printed, and assembled with key functional elements, creating a practical and accessible solution for real-world use.     </p>
      </div>
      </FadeInSection>
    </div>
  </div>
  
  <div class="image-section">
    <img src="/Nass-Doku6.png" alt="Beschreibung des Bildes" />
  </div>
  
  
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
      <h4>Turning Data into Action</h4>
      <br>
      <p class="text-doku">
        To support the device, we designed a clean and structured website that provides essential information and enhances usability. The platform offers a visual representation of collected water data, allowing users to analyze results through an interactive dashboard. Each device has a unique ID, enabling users to log in and track personalized test results over time.    </p>
      <br>
      <p class="text-doku">
        Beyond data visualization, the website explains the technology behind NASS, shares insights into the project, and invites NGOs and individuals to get involved. The design focuses on clarity, readability, and accessibility, ensuring a seamless experience for all users.    </p>
    </div>
    </FadeInSection>
    </div>
  </div>
  
  <div class="image-section">
    <img src="/Nass-Doku7.png" alt="Beschreibung des Bildes" />
  </div>
  
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
      <h4>Turning Data into Action</h4>
      <br>
      <p class="text-doku">
        To make NASS easy to use, we designed a compact A5 handbook that guides users step by step, mirroring the E-Ink display UI. It serves as a physical reference, ensuring accessibility even without digital instructions. Beyond daily use, it supports training and community workshops, making water testing intuitive for everyone.  </div>
    </FadeInSection>
    </div>
  </div>
  
  <div class="image-section">
    <img src="/Nass-Doku8.png" alt="Beschreibung des Bildes" />
  </div>
  
  
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
      <h4>Future Potential</h4>
      <br>
      <p class="text-doku">
        NASS was an exciting project that challenged us to think beyond traditional interaction design and explore how technology could solve real-world problems. While our prototype remains a conceptual model, the process helped us understand the challenges of designing for usability, accessibility, and clear user guidance in a complex system.
        By focusing on intuitive interaction, clear visual communication, and a seamless user flow, we created a vision for how a water testing device could work in the future. This project reinforced the importance of prototyping, iteration, and user-centered design in shaping meaningful solutions.  </FadeInSection>
    </div>
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
    color: #1359FF;
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
    color: #1359FF;
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
  
  .img-section-2col {
    display: grid;
    grid-template-columns: 4fr 2fr; /* 4:2 Verhältnis wie gewünscht */
    gap: 2rem;
    margin-top: 10rem;
    width: 100%;
  }
  
  .img-container-left, .img-container-right {
    width: 100%;
    display: flex;         /* Für die Zentrierung */
    justify-content: center; /* Horizontal zentrieren */
    align-items: center;    /* Vertikal zentrieren */
  }
  
  .img-container-left img, .img-container-right img {
    width: 100%;
    height: auto;
    object-fit: contain;
    object-position: center;
  }
  
  @media (max-width: 768px) {
    .img-section-2col {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      margin-top: 5rem;
    }
    
    .img-container-left, .img-container-right {
      width: 100%;
    }
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
  </style>