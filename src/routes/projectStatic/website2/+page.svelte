<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription}>
  <meta name="keywords" content={pageKeywords}>
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://fxma.design/project/website2">
  
  <!-- Open Graph Tags for Social Media -->
  <meta property="og:title" content={pageTitle}>
  <meta property="og:description" content={pageDescription}>
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://fxma.design/project/website2">
  <meta property="og:image" content="https://fxma.design/website2/website2-cover.png">
  
  <!-- Structured Data for Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Zentrum Pferd",
    "url": "https://zentrum-pferd.com",
    "description": "A WordPress website featuring Instagram integration and storytelling-focused design for equine therapy and saddle craftsmanship services.",
    "creator": {
      "@type": "Person",
      "name": "Franz"
    },
    "designer": {
      "@type": "Person",
      "name": "Franz"
    },
    "keywords": "equine therapy, saddle craftsmanship, Instagram integration, WordPress design",
    "isPartOf": {
      "@type": "WebSite",
      "name": "FXMA Design",
      "url": "https://fxma.design"
    },
    "image": "https://fxma.design/website2/website2-cover.png"
  }
  </script>
</svelte:head>

<script>
    import FadeInSection from '$lib/components/FadeInSection.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
      import Footer from '$lib/Footer.svelte';
  
    $: url = $page.url;
  
    // Enable smooth scrolling for project page
    onMount(() => {
      // Explicitly enable scrolling
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
  
    // Navigate back to specific section in static view
    function navigateToSection(section) {
      goto(`/static#${section}`);
    }
  
    // Parallax movement effect for images on mouse hover
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
      
      // Use transform for better performance
      container.querySelector('img').style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  
    // Reset image position when mouse leaves
    function resetTransform(e) {
      e.currentTarget.querySelector('img').style.transform = 'translate(0,0)';
    }
  
    // SEO configuration
    const pageTitle = "Zentrum Pferd | WordPress Website Design | FXMA Design";
    const pageDescription = "A professionally crafted WordPress website for Zentrum Pferd featuring Instagram integration, storytelling-focused design and responsive layouts to showcase equine expertise and services.";
    const pageKeywords = "Zentrum Pferd, WordPress design, Instagram integration, equine therapy, saddle craftsmanship, responsive design, storytelling website";
</script>
  
<!-- Main scrollable container -->
<div class="scroll-container">
  <div class="content-wrapper">
    <div class="top-section">
      <!-- Back navigation button -->
      <div class="back-btn-container">
        <button on:click={() => navigateToSection('website-1')}>
          <img src="/leftArrow.png" alt="Back navigation arrow" />
          Back
        </button>
      </div>

      <!-- Cover image with parallax effect -->
      <div class="cover-section"
      role="figure"
      on:mousemove={handleMouseMove}
      on:mouseleave={resetTransform}>
        <img src="/website2/website2-cover.png" alt="Zentrum Pferd website showcase featuring a responsive design with hero section and navigation menu" />
      </div>

      <!-- Project title with external link -->
      <div class="heading-container">
        <a href="https://zentrum-pferd.com" target="_blank" rel="noopener noreferrer" class="website-link">
          <h1>zentrum-pferd.com
            <svg class="link-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </h1>
        </a>
      </div>

      <!-- Project metadata section with 3 columns -->
      <div class="project-columns">
        <div class="project-column">
          <h3>My Role</h3>
          <div class="divider"></div>
          <p>
            UI/UX Developer, WordPress Implementation, Technical Integration, Instagram API Integration, Team Collaborator
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
  
    <!-- Introduction section -->
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
  
    <!-- First image section -->
    <div class="img-section-4">
      <div class="img-container">
        <img src="/website2/website2-bild1.png" alt="Zentrum Pferd website layout with service sections, typography, and content placement" />
      </div>
    </div>
  
    <!-- Collaborative design section -->
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

    <!-- Key Learnings section -->
    <div class="grid-section1">
      <div class="text-grid1">
        <h4>Key Learnings</h4>
      </div>
    </div>
  
    <!-- Second image section -->
    <div class="img-section-4">
      <div class="img-container">
        <img src="/website2/website2-bild2.png" alt="Instagram feed integration on the Zentrum Pferd website displaying recent posts from their equine therapy services" />
      </div>
    </div>
  
    <!-- Collaborators section -->
    <div class="collaborators-section">
      <div class="divider-large"></div>
      
      <FadeInSection>
        <div class="collaborators-content">
          <h4>The People Behind the Project</h4>
          <div class="collaborators-list">
            <div class="collaborator">Jens Kramer</div>
            <div class="collaborator">Franz Anhäupl</div>
          </div>
          
          <!-- Tools section -->
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
                <span class="tool-name">Instagram API</span>
                <span class="tool-role">Social Media Integration</span>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>
    </div>

    <!-- Bottom back button -->
    <div class="back-btn-container bottom-back">
      <button on:click={() => navigateToSection('website-1')}>
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
    will-change: transform; /* Performance optimization */
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
    color: #EC0011;
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
    background-color: #e2444e;
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
  
  /* H1 styling for website link */
  .website-link h1 {
    color: #EC0011;
    transition: color 0.2s ease;
    font-size: 2rem;
    font-family: 'Franz-Plex', mono;
    line-height: 1.6;
    margin: 0;
  }
  
  .website-link:hover h1 {
    color: #e41f2c;
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
    
    .website-link h1 {
      font-size: 1.8rem;
      line-height: 1.4;
      white-space: nowrap;
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
    
    .website-link h1 {
      font-size: 1.5rem;
      line-height: 1.3;
    }
    
    .link-icon {
      width: 14px;
      height: 14px;
      margin-left: 4px;
      top: -2px;
    }
  }
</style>