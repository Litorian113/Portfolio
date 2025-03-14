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
        <h2>HYBRID Wallet</h2>
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
          <p>A smart wallet with NFC payment, LED feedback, fingerprint authentication, and a companion app—blending digital and physical payments seamlessly.

          </p>
        </div>
        <div class="project-column">
          <h3>Project Tags</h3>
          <div class="divider"></div>
          <div class="tags">
            <div class="tag">Smart Wallet</div>
            <div class="tag">UX/UI-Design</div>
            <div class="tag">Arduino Prototyping</div>
            <div class="tag">NFC Payment</div>
            <div class="tag">Interaction Design</div>
            <div class="tag">LED Feedback</div>
            <div class="tag">Usertesting</div>
            <div class="tag">Human-Centered Design</div>
          </div>
        </div>
      </div>
  
  
    </div>
  
  
  
    <div class="cover-section"
    role="figure"
    on:mousemove={handleMouseMove}
    on:mouseleave={resetTransform}>
  <img src="/walletImg/hybridWallet-cover.png" alt="Beschreibung des Bildes" />
  </div>
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
        <div>
        <h4>Introduction</h4>
        <br>
        <p class="text-doku">
            In the User Interfaces 1 course, we explored how to modernize the traditional wallet while keeping it practical and intuitive. As digital payments become more common, physical wallets still play a role—many cards aren’t fully digital yet, and cash remains essential in some situations.
            Our solution was a smart wallet that combines NFC payment, fingerprint authentication, and LED feedback with a manual card slot and coin storage. Paired with a companion app, it allows users to select and manage bank cards, customize settings, and track transactions, bridging the gap between digital convenience and real-world usability.</p>

      </div>
    </FadeInSection>
    </div>
    </div>
  
    <div class="grid-section1">
        <div class="text-grid1">
          <FadeInSection>
          <div>
          <h4>Rethinking the Wallet</h4>
          <br>
          <p class="text-doku">
            Through user research and questioning, we found a gap between digital convenience and real-world needs. While many cards are moving to smartphones, physical wallets remain essential for payments where digital isn’t accepted. This often means carrying both a phone and a wallet at checkout. Based on these insights, we began developing a smart wallet that seamlessly merges digital and physical payments into one user-friendly experience.     
               </p>
  
        </div>
      </FadeInSection>
      </div>
      </div>




    <div class="image-section">
        <h4 class="img-title">Drawings and first dummy</h4>
      <img src="/walletImg/hybrid1.png" alt="Beschreibung des Bildes" />
    </div>

    <div class="image-section">
        <h4 class="img-title">Building more advanced prototype dummies</h4>
      <img src="/walletImg/hybrid2.png" alt="Beschreibung des Bildes" />
    </div>

    <div class="image-section">
        <h4 class="img-title">Enhancing prototype and taking user feedback through testing</h4>
      <img src="/walletImg/hybrid3.png" alt="Beschreibung des Bildes" />
    </div>
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
        <h4>HYBRID App</h4>
        <br>
        <p class="text-doku">
            The companion app allows users to add, manage, and customize bank cards, which are then paired with the smart wallet. Users can assign a unique color to each card, making selection intuitive through the wallet’s LED feedback system. Once paired via Bluetooth, the app syncs the selected card to the wallet, enabling seamless NFC payments. Additional features include locking cards, tracking transactions, and locating the wallet in case of loss, ensuring both convenience and security.
        </p>
      </div>
      </FadeInSection>
      </div>
    </div>

    <div class="image-section">
      <img src="/walletImg/hybrid4.png" alt="Beschreibung des Bildes" />
    </div>
  
    <div class="image-section">
        <h4 class="img-title">Interactive Elements & Icons</h4>
      <img src="/walletImg/hybrid5.png" alt="Beschreibung des Bildes" />
    </div>
  
  
  
  
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
        <h4>3D Models – Visualizing the Future</h4>
        <br>
        <p class="text-doku">
            Alongside our physical prototype, we created high-quality 3D renders to showcase the ideal vision of our smart wallet. While building the prototype, we realized that current technical limitations made it difficult to fit all components into an ultra-thin design. To overcome this, our 3D models illustrate how the final product could look with refined engineering and compact technology, providing a realistic yet aspirational representation of the wallet’s future potential.        </p>

      </div>
      </FadeInSection>
      </div>
    </div>

    <div class="image-section">
      <img src="/walletImg/hybrid6.png" alt="Beschreibung des Bildes" />
    </div>

  <Footer />
  
  
  
  </div>
  </div>
  
  
  
  
  
  <style>
  /* IBM Plex Mono Regular */
.img-title {
    padding-bottom: 25px;
}

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
    color: #4378FF;
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
    color: #4378FF;
    line-height: 1.6;
    font-size: 1.5rem;
  }

  .text-doku {
    color: white;
    font-family: 'Franz-Plex', mono;
    line-height: 1.6;
    font-size: 1.5rem;
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