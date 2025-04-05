<script>
    import FadeInSection from '$lib/components/FadeInSection.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import Footer from '$lib/Footer.svelte';
  
    $: url = $page.url;
  
    // Enable scrolling on this project page
    onMount(() => {
      // Explicitly enable scrolling for this page
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
  
      if (browser) {
        // Set up lazy loading with Intersection Observer
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
        
        // Apply to all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
          observer.observe(img);
        });
      }
    });

    // Navigate back to static page with specific project anchor
    function goBackToStatic() {
      goto('/static#website-1'); // Direct link to website-1 section on static page
    }
  
    // Handle mouse movement for parallax image effect
    function handleMouseMove(e) {
      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate relative position (-1 to 0)
      const percentX = (x / rect.width) - 1;
      const percentY = (y / rect.height) - 1;
      
      // Apply movement with a maximum offset of 150px
      const moveX = percentX * 150;
      const moveY = percentY * 150;
      container.querySelector('img').style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  
    // Reset transform when mouse leaves image
    function resetTransform(e) {
      e.currentTarget.querySelector('img').style.transform = 'translate(0,0)';
    }
  
    // SEO configuration for this project page
    const pageTitle = "Zeller Zahntechnik | WordPress Website Design | FXMA Design";
    const pageDescription = "A mobile-first redesign for Zeller Zahntechnik with custom icon design, responsive navigation, and intuitive UI - transforming an outdated dental lab website into a modern digital presence.";
    const pageKeywords = "WordPress design, dental website, icon design, responsive design, mobile-first approach, UI/UX design, Zeller Zahntechnik, website redesign";
</script>
  
<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription}>
  <meta name="keywords" content={pageKeywords}>
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://fxma.design/project/website1">
  
  <!-- Open Graph Tags for Social Media -->
  <meta property="og:title" content={pageTitle}>
  <meta property="og:description" content={pageDescription}>
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://fxma.design/project/website1">
  <meta property="og:image" content="https://fxma.design/website1/website1-cover.png">
  
  <!-- Structured data for Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Zeller Zahntechnik",
    "url": "https://zellerzahntechnik.de",
    "description": "A modern, mobile-first WordPress website for a dental lab featuring custom dental-themed icons and intuitive navigation.",
    "creator": {
      "@type": "Person",
      "name": "Franz"
    },
    "designer": {
      "@type": "Person",
      "name": "Franz"
    },
    "keywords": "WordPress design, dental website, responsive design, dental lab, icon design",
    "isPartOf": {
      "@type": "WebSite",
      "name": "FXMA Design",
      "url": "https://fxma.design/projectStatic/website1"
    },
    "image": "https://fxma.design/website1/website1-cover.png"
  }
  </script>
</svelte:head>
  
<!-- Main scrollable container -->
<div class="scroll-container">
  <div class="content-wrapper">
    <!-- Top section with navigation and project intro -->
    <div class="top-section">
      <!-- Back navigation button -->
      <div class="back-btn-container">
        <button on:click={goBackToStatic}>
          <img src="/leftArrow.png" alt="Back navigation arrow" />
          Back
        </button>
      </div>

      <!-- Cover image with parallax effect -->
      <div class="cover-section"
        role="figure"
        on:mousemove={handleMouseMove}
        on:mouseleave={resetTransform}>
        <img src="/website1/website1-cover.png" alt="Zeller Zahntechnik website redesign preview showing responsive layouts across desktop and mobile devices" />
      </div>

      <!-- Project title with external link -->
      <div class="heading-container">
        <h1>
          <a href="https://zellerzahntechnik.de" target="_blank" rel="noopener noreferrer" class="website-link">
            zellerzahntechnik.de
            <svg class="link-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </a>
        </h1>
      </div>

      <!-- Project metadata in three columns -->
      <div class="project-columns">
        <div class="project-column">
          <h3>My Role</h3>
          <div class="divider"></div>
          <p>
            UI/UX Designer, WordPress Specialist, Icon Design Creator, Responsive Design Developer
          </p>
        </div>
        <div class="project-column">
          <h3>Project Overview</h3>
          <div class="divider"></div>
          <p>
            I redesigned the Zeller Zahntechnik website with a mobile-first approach, modernizing the outdated old design.
          </p>
        </div>
        <div class="project-column">
          <h3>Project Tags</h3>
          <div class="divider"></div>
          <div class="tags">
            <div class="tag">Wordpress</div>
            <div class="tag">Hosting</div>
            <div class="tag">Domain</div>
            <div class="tag">Design</div>
            <div class="tag">Responsive</div>
            <div class="tag">Icons</div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Icon design section -->
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
            <h4>Icon Design & Mobile Navigation</h4>
            <br>
            <p class="text-doku">
              This project was particularly exciting for me because of the icon design and the challenge of optimizing navigation for mobile users. I focused on creating a cohesive icon set that enhances usability and clarity. Additionally, I explored jump links in combination with the bottom navigation to enable quick access to key sections—ensuring a smooth and efficient user experience.
            </p>
            <br>
          </div>
        </FadeInSection>
      </div>
    </div>
  
    <!-- First image showcase -->
    <div class="img-section-4">
      <div class="img-container">
        <img src="/website1/website1-bild1.png" alt="Custom icon set design for Zeller Zahntechnik featuring dental-themed navigation icons with minimalist line-art style" />
      </div>
    </div>
  
    <!-- Design details section -->
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
            <h4>Icon Design</h4>
            <br>
            <p class="text-doku">
              I created a custom icon set that subtly incorporates a tooth symbol into familiar UI icons, reinforcing the dental theme while maintaining a clean, cohesive look. Using a minimalist line-art style, I focused on clarity, consistency, and scalability across different screen sizes. Through this process, I learned how balanced proportions and recognizability are key to intuitive navigation and a seamless user experience.
            </p>
            <br>
          </div>
        </FadeInSection>
      </div>
    </div>
  
    <!-- Second image showcase -->
    <div class="img-section-4">
      <div class="img-container">
        <img src="/website1/website1-bild2.png" alt="Mobile navigation implementation with jump links and optimized bottom menu for the Zeller Zahntechnik website" />
      </div>
    </div>
  
    <!-- Contributors and tools section -->
    <div class="collaborators-section">
      <div class="divider-large"></div>
      
      <FadeInSection>
        <div class="collaborators-content">
          <h4>The People Behind the Project</h4>
          <div class="collaborators-list">
            <div class="collaborator">Franz Anhäupl</div>
          </div>
          
          <!-- Tools used in project -->
          <div class="creative-arsenal">
            <h4>My Creative Arsenal</h4>
            <p class="arsenal-intro">Crafting this experience with our digital toolbelt:</p>
            <div class="tools-container">
              <div class="tool">
                <span class="tool-name">Figma</span>
                <span class="tool-role">UI/UX Design</span>
              </div>
              <div class="tool">
                <span class="tool-name">Wordpress</span>
                <span class="tool-role">Content Management</span>
              </div>
              <div class="tool">
                <span class="tool-name">Elementor Pro</span>
                <span class="tool-role">Visual Page Building</span>
              </div>
              <div class="tool">
                <span class="tool-name">Netcup Webhosting</span>
                <span class="tool-role">Deployment & Hosting</span>
              </div>
              <div class="tool">
                <span class="tool-name">Illustrator</span>
                <span class="tool-role">Icon-Generation</span>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>
    </div>
  
    <!-- Bottom back button -->
    <div class="back-btn-container bottom-back">
      <button on:click={goBackToStatic}>
        <img src="/leftArrow.png" alt="Back navigation arrow" />
        Back to Projects
      </button>
    </div>
  
    <Footer />
  </div>
</div>
  
<style>
  /* Font definitions */
  @font-face {
    font-family: 'Franz-Plex';
    src: url('/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'Franz-Grotesk';
    src: url('/fonts/Space_Grotesk/static/SpaceGrotesk-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
  
  /* Layout container */
  .content-wrapper {
    width: 92%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 4rem 4rem;
  }
  
  /* Top section layout */
  .top-section {
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  
  /* Back button styling */
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
  
  .back-btn-container button img {
    height: 1.2em;
    width: auto;
  }
  
  /* Heading container */
  .heading-container {
    width: 100%;
    height: auto;
    margin-top: -2rem;
    margin-bottom: 3rem;
    align-content: center;
    position: relative;
    z-index: 5;
  }
  
  .heading-container h1 {
    font-family: 'Franz-Plex', mono;
    color: #057FD3;
    line-height: 1.6;
    font-size: 2rem;
    margin: 0;
    padding: 0;
  }
  
  /* Project columns layout */
  .project-columns {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    gap: 2rem;
    margin-top: 1rem;
    max-width: 100%;
  }
  
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
  
  /* Tags styling */
  .tags {
    display: flex;
    flex-wrap: wrap;
    width: 95%;
    gap: 0.7rem;
    margin-top: 1rem;
  }
  
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
  
  /* Cover image with parallax effect */
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
  
  /* Grid layouts */
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
  
  /* Typography */
  h4 {
    font-family: 'Franz-Plex', mono;
    color: #057FD3;
    line-height: 1.6;
    font-size: 1.5rem;
  }
  
  .text-doku {
    color: white;
    font-family: 'Franz-Plex', mono;
    line-height: 1.6;
    font-size: 1.5rem;
  }
  
  /* Image sections */
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
  
  /* Scrollable container */
  .scroll-container {
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }
  
  /* Collaborator section */
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
  
  /* Tools section styling */
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
    color: #057FD3;
    font-family: 'Franz-Plex', mono;
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
  }
  
  .tool-role {
    color: rgba(255, 255, 255, 0.7);
    font-family: 'Franz-Grotesk', sans-serif;
    font-size: 0.9rem;
  }
  
  /* External link styling */
  .website-link {
    text-decoration: none;
    display: inline-block;
    position: relative;
  }
  
  .website-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #2a9de8;
    transition: width 0.3s ease;
  }
  
  .website-link:hover::after {
    width: 100%;
  }
  
  .link-icon {
    margin-left: 8px;
    vertical-align: middle;
    transition: transform 0.2s ease;
    position: relative;
    top: -4px;
    display: inline-block;
  }
  
  .website-link:hover .link-icon {
    transform: translateY(-2px);
  }
  
  .website-link:hover {
    color: #2a9de8;
  }
  
  /* Bottom back button */
  .bottom-back {
    margin-top: 10rem;
    margin-bottom: 3rem;
    display: flex;
    justify-content: flex-start;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
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
    
    .heading-container {
      height: auto;
      margin-top: 1rem;
      margin-bottom: 2rem;
    }
    
    .img-section-4 {
      display: block;
      margin-top: 5rem;
    }
    
    .img-container {
      width: 100%;
    }
    
    .project-columns {
      flex-direction: column;
      gap: 2rem;
    }
    
    .project-columns .project-column {
      min-width: 100%;
    }
    
    .collaborators-section {
      margin-top: 6rem;
      margin-bottom: 3rem;
    }
    
    .collaborators-list {
      flex-direction: column;
      gap: 1rem;
    }
    
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
    
    .heading-container h1 {
      font-size: 1.8rem;
      line-height: 1.4;
    }
    
    .link-icon {
      width: 16px;
      height: 16px;
      margin-left: 6px;
    }
  }
  
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
    
    .heading-container h1 {
      font-size: 1.6rem;
      line-height: 1.3;
      word-break: keep-all;
    }
    
    .link-icon {
      width: 14px;
      height: 14px;
      margin-left: 4px;
      top: -3px;
    }
  }
</style>