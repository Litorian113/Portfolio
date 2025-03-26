<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import Footer from '$lib/Footer.svelte';
  
    // Stelle sicher, dass Scrollen auf dieser Seite funktioniert
    onMount(() => {
      // Aktiviere das Scrollen explizit
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    });
  
    function goBackToStatic() {
      goto('/static');
    }
</script>
  
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
        <h2>Legal Notice</h2>
      </div>
    </div>

    <div class="grid-section1">
      <div class="text-grid1">
        <h4>Information according to § 5 TMG</h4>
        <p class="text-doku">
          Franz Anhäupl<br>
          Ahornweg 18A<br>
          89275 Oberelchingen<br>
          Germany
        </p>
        
        <h4>Contact</h4>
        <p class="text-doku">
          Email: <a href="mailto:Hey@fxma.design">Hey@fxma.design</a><br>
        </p>
        
        <h4>Liability for Content</h4>
        <p class="text-doku">
          As a service provider, I am responsible for my own content on these pages according to § 7 paragraph 1 TMG under the general laws. 
          According to §§ 8 to 10 TMG, however, I am not obligated to monitor transmitted or stored third-party information or to investigate
          circumstances that indicate illegal activity.
        </p>
        <p class="text-doku">
          Obligations to remove or block the use of information under the general laws remain unaffected. However, liability in this regard is only possible
          from the time of knowledge of a specific legal violation. Upon becoming aware of such legal violations, I will remove this content immediately.
        </p>
        
        <h4>Liability for Links</h4>
        <p class="text-doku">
          My website contains links to external third-party websites, over whose content I have no influence. Therefore, I cannot guarantee this
          third-party content. The respective provider or operator of the linked pages is always responsible for their content. The linked pages
          were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking.
        </p>
        <p class="text-doku">
          However, a permanent monitoring of the content of the linked pages is not reasonable without specific indications of a legal violation.
          Upon becoming aware of legal violations, I will remove such links immediately.
        </p>
        
        <h4>Copyright</h4>
        <p class="text-doku">
          The content and works created by the site operator on these pages are subject to German copyright law. The reproduction, processing, 
          distribution, and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator.
        </p>
        <p class="text-doku">
          Downloads and copies of this site are only permitted for private, non-commercial use. Insofar as the content on this site was not created
          by the operator, the copyrights of third parties are respected. In particular, third-party content is identified as such.
          Should you nevertheless become aware of a copyright infringement, please notify me accordingly. Upon becoming aware of legal violations, 
          I will remove such content immediately.
        </p>
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
  
  /* Top-Section: Flexbox-Layout für die Elemente */
  .top-section {
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-bottom: 3rem;
  }
  
  /* Button-Container: 100% Breite, Button linksbündig */
  .back-btn-container {
    width: 100%;
    margin-bottom: 2rem;
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
    margin-bottom: 2rem;
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
  
  .grid-section1 {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(1, auto);
    gap: 8px;
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
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .text-doku {
    color: white;
    font-family: 'Franz-Plex', mono;
    line-height: 1.6;
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }

  /* Links in Texten */
  .text-doku a {
    color: #F2BA40;
    text-decoration: none;
  }

  .text-doku a:hover {
    text-decoration: underline;
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
    }
    
    .text-grid1 {
      width: 100%;
    }
    
    .text-doku {
      font-size: 1.1rem;
    }
    
    h4 {
      font-size: 1.3rem;
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
      font-size: 1.2rem;
    }
    
    .text-doku {
      font-size: 1rem;
    }
    
    .back-btn-container button {
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
    }
  }
</style>