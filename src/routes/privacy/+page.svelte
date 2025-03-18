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
  
    function goBackToFlur() {
      goto('/');
    }
</script>
  
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
        <h2>Privacy Policy</h2>
      </div>
    </div>

    <div class="grid-section1">
      <div class="text-grid1">
        <h4>1. Overview</h4>
        <p class="text-doku">
          This Privacy Policy explains how I collect, use, and protect your information when you visit my portfolio website.
          I am committed to ensuring the privacy and protection of your personal data.
          This policy applies to information collected through this website.
        </p>
        
        <h4>2. Responsible Person</h4>
        <p class="text-doku">
          Franz Anhäupl<br>
          Ahornweg 18A<br>
          89275 Oberelchingen<br>
          Germany<br><br>
          Email: <a href="mailto:Hey@fxma.design">Hey@fxma.design</a>
        </p>
        
        <h4>3. Information Collection</h4>
        <p class="text-doku">
          When you visit my website, certain information is automatically collected through your browser or device:
        </p>
        <ul class="text-doku">
          <li>IP address (anonymized)</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Date and time of your visit</li>
          <li>Pages you visit</li>
          <li>Referring website</li>
        </ul>
        <p class="text-doku">
          This information is used to analyze visitor behavior and optimize the website experience.
          The data processing is based on Article 6(1)(f) GDPR (legitimate interest).
        </p>
        
        <h4>4. Cookies & Storage Technologies</h4>
        <p class="text-doku">
          This website uses technically necessary cookies to enable basic functionality. These cookies do not track you across websites and do not collect personal information.
          They are stored on your device until the end of the browser session.
        </p>
        <p class="text-doku">
          I do not use tracking cookies, advertising cookies, or social media cookies unless explicitly mentioned otherwise.
        </p>
        
        <h4>5. Web Hosting</h4>
        <p class="text-doku">
          My website is hosted by a professional hosting provider. The hosting provider processes server log files that contain your IP address, 
          date and time of access, browser request, and general information concerning your operating system and browser. 
          This data collection is necessary for security reasons and to ensure the stability of the website.
        </p>
        
        <h4>6. Contact Forms</h4>
        <p class="text-doku">
          If you use any contact forms on my website, the information you provide will be stored to process your inquiry. 
          I will not share this information with third parties without your consent. 
          Data processing is based on Article 6(1)(a) GDPR (consent) or Article 6(1)(b) GDPR (pre-contractual measures).
        </p>
        
        <h4>7. Your Rights</h4>
        <p class="text-doku">
          Under the General Data Protection Regulation (GDPR), you have the following rights:
        </p>
        <ul class="text-doku">
          <li>Right to access information about your stored personal data</li>
          <li>Right to correction of inaccurate personal data</li>
          <li>Right to erasure ("right to be forgotten")</li>
          <li>Right to restriction of processing</li>
          <li>Right to data portability</li>
          <li>Right to object to data processing</li>
          <li>Right to withdraw consent</li>
        </ul>
        <p class="text-doku">
          To exercise these rights, please contact me using the contact details provided above.
        </p>
        
        <h4>8. Data Security</h4>
        <p class="text-doku">
          I take appropriate technical and organizational measures to protect your data against accidental or intentional manipulation, 
          partial or complete loss, destruction, or unauthorized access by third parties.
          My security measures are continuously improved in line with technological developments.
        </p>
        
        <h4>9. Changes to This Privacy Policy</h4>
        <p class="text-doku">
          I may update this Privacy Policy from time to time to reflect changes in technology, legal requirements, or my website functionality.
          Any changes will be posted on this page. The date of the latest revision will be indicated at the bottom of this page.
        </p>
        
        <p class="text-doku last-update">
          Last updated: March 18, 2025
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

  /* Listen-Styling */
  .text-doku ul {
    margin: 0 0 1.5rem 1.5rem;
    padding: 0;
  }

  .text-doku li {
    margin-bottom: 0.5rem;
  }

  .last-update {
    font-style: italic;
    margin-top: 3rem;
    font-size: 1rem;
    color: #999;
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