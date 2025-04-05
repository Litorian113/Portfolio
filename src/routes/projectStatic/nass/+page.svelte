<script>
  import FadeInSection from '$lib/components/FadeInSection.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import Footer from '$lib/Footer.svelte';

  $: url = $page.url;

  // SEO configuration for this project page
  const pageTitle = "NASS Device | Water Testing Solution | FXMA Design";
  const pageDescription = "NASS is a portable water testing device with E-Ink interface, designed to make water quality analysis accessible and help combat waterborne diseases in regions like Uganda.";
  const pageKeywords = "water testing device, E-Ink interface, NASS device, water quality, portable device, UI design, Franz portfolio";

  // Enable scrolling and initialize lazy loading
  onMount(() => {
    // Explicitly enable scrolling for this page
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';

    if (browser) {
      // Set up intersection observer for lazy loading images
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
        rootMargin: '200px 0px' // Preload buffer
      });
      
      // Apply to all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        observer.observe(img);
      });
    }
  });

  // Navigate back to static projects page with proper anchor
  function goBackToStatic() {
    goto('/static#nass-device'); // Direct link to the NASS section on static page
  }

  // Handle mouse movement for parallax effect on cover image
  function handleMouseMove(e) {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate relative position (-1 to 0)
    const percentX = (x / rect.width) - 1;
    const percentY = (y / rect.height) - 1;
    
    // Apply movement with maximum 150px offset
    const moveX = percentX * 150;
    const moveY = percentY * 150;
    container.querySelector('img').style.transform = `translate(${moveX}px, ${moveY}px)`;
  }

  // Reset transform when mouse leaves image area
  function resetTransform(e) {
    e.currentTarget.querySelector('img').style.transform = 'translate(0,0)';
  }
</script>

<!-- SEO meta tags -->
<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription}>
  <meta name="keywords" content={pageKeywords}>
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://fxma.design/project/nass">
  
  <!-- Open Graph Tags for Social Media -->
  <meta property="og:title" content={pageTitle}>
  <meta property="og:description" content={pageDescription}>
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://fxma.design/project/nass">
  <meta property="og:image" content="https://fxma.design/Nass-cover.png">
  
  <!-- Structured Data for Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "NASS Device",
    "description": "A portable water testing device with a simple E-Ink interface and open-data sharing.",
    "creator": {
      "@type": "Person",
      "name": "Franz"
    },
    "keywords": "water testing, E-Ink interface, UI/UX design, product design",
    "isPartOf": {
      "@type": "WebSite",
      "name": "FXMA Design",
      "url": "https://fxma.design"
    },
    "image": "https://fxma.design/Nass-cover.png"
  }
  </script>
</svelte:head>

<!-- Main scrollable container -->
<div class="scroll-container">
<div class="content-wrapper">
  <!-- Header section with navigation and project overview -->
  <div class="top-section">
    <div class="back-btn-container">
      <button on:click={goBackToStatic}>
        <img src="/leftArrow.png" alt="Back arrow icon" />
        Back
      </button>
    </div>
    <div class="heading-container">
      <h1>Nass Device</h1>
    </div>
    <div class="project-columns">
      <div class="project-column">
        <h3>My Role</h3>
        <div class="divider"></div>
        <p>
          UI/UX Designer, Interface Development, User Testing Lead, Research Contributor, Team Collaborator, Wireframe Development, Video Production Lead
        </p>
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

  <!-- Cover image with parallax effect -->
  <div class="cover-section"
    role="figure"
    on:mousemove={handleMouseMove}
    on:mouseleave={resetTransform}>
    <img src="/Nass-cover.png" alt="NASS project cover showing the device design displayed on a laptop screen" />
  </div>

  <!-- Introduction section -->
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
          <h4>Introduction</h4>
          <br>
          <p class="text-doku">
            During our Innovation 1 course at HfG, we explored solutions for one of the world's most pressing issues: unsafe drinking water. Every year, millions suffer from waterborne diseases, especially in regions like Uganda, where contaminated water—often carrying E. coli bacteria—poses a severe health risk.</p>
          <br><p class="text-doku"> To address this, we developed NASS (Network for Aquatic Substance Sensors)—a portable water testing device that allows non-specialists to quickly check water quality. The collected data is shared on an open platform, helping local communities and NGOs make informed decisions about water safety. Our goal was to create an affordable, accessible, and intuitive solution to prevent waterborne illnesses and save lives.</p>
        </div>
      </FadeInSection>
    </div>
  </div>

  <!-- Project documentation images in 2 columns -->
  <div class="img-section-2col">
    <div class="img-container-left">
      <img src="/Nass-Doku1.png" alt="Interactive prototype of the NASS website displayed on a MacBook screen" />
    </div>
    <div class="img-container-right">
      <img src="/Nass-Doku2.png" alt="Cover of the NASS user guidance manual that accompanies the device and software" />
    </div>
  </div>

  <!-- Research process section -->
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

  <!-- Color palette documentation -->
  <div class="img-section-4">
    <div class="img-container"><img src="/Nass-Doku3.png" alt="Color palette presentation showing the four main colors used throughout the NASS project" /></div>
  </div>

  <!-- Universal icon language section -->
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
          <h4>Universal Icon Language</h4>
          <br>
          <p class="text-doku">
            To ensure clarity and usability, we developed a minimalist visual style with a strong focus on intuitive iconography. We used the Untitled UI library as a foundation and created custom icons to fit the specific needs of our device and interface.
          </p>
          <br><p class="text-doku">
            Given the international context, we carefully considered cultural differences in symbol interpretation, ensuring that icons were universally recognizable—even for users with low literacy levels. The icons were designed to be easily readable on both the website and the small E-Ink display, maintaining high contrast and simplicity for maximum accessibility.
          </p>
        </div>
      </FadeInSection>
    </div>
  </div>

  <!-- Icon set display -->
  <div class="img-section-4">
    <div class="img-container"><img src="/Nass-Doku4.png" alt="Grid display of the custom icon set designed for NASS, arranged in 3 rows with 4 icons per row" /></div>
  </div>

  <!-- Device UI implementation -->
  <div class="img-section-4">
    <div class="img-container"><img src="/Nass-Doku5.png" alt="Device UI screen showing the implementation of our custom icons in the E-Ink display" /></div>
  </div>

  <!-- Final product section -->
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
          <h4>Final Product</h4>
          <br>
          <p class="text-doku">
            Our water testing device was designed for ease of use, efficiency, and durability. The ergonomic shape ensures comfortable handling, with a dedicated slot for replaceable test tubes. A simple two-button interface allows for intuitive navigation, while the E-Ink display provides high contrast and low power consumption, ensuring readability in all conditions. The UI guides users step by step, minimizing errors. The final prototype was modeled in Fusion 360, 3D-printed, and assembled with key functional elements, creating a practical and accessible solution for real-world use.
          </p>
        </div>
      </FadeInSection>
    </div>
  </div>

  <!-- Prototype building process -->
  <div class="image-section">
    <img src="/Nass-Doku6.png" alt="Three detailed contents showing the prototype building process, with the final product being held by a user in the last content" />
  </div>

  <!-- Data visualization and web platform -->
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
          <h4>Turning Data into Action</h4>
          <br>
          <p class="text-doku">
            To support the device, we designed a clean and structured website that provides essential information and enhances usability. The platform offers a visual representation of collected water data, allowing users to analyze results through an interactive dashboard. Each device has a unique ID, enabling users to log in and track personalized test results over time.
          </p>
          <br>
          <p class="text-doku">
            Beyond data visualization, the website explains the technology behind NASS, shares insights into the project, and invites NGOs and individuals to get involved. The design focuses on clarity, readability, and accessibility, ensuring a seamless experience for all users.
          </p>
        </div>
      </FadeInSection>
    </div>
  </div>

  <!-- Website design showcase -->
  <div class="image-section">
    <img src="/Nass-Doku7.png" alt="Overview of the NASS website design showing two different subpage layouts and navigation styles" />
  </div>

  <!-- User handbook section -->
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
          <h4>User Handbook</h4>
          <br>
          <p class="text-doku">
            To make NASS easy to use, we designed a compact A5 handbook that guides users step by step, mirroring the E-Ink display UI. It serves as a physical reference, ensuring accessibility even without digital instructions. Beyond daily use, it supports training and community workshops, making water testing intuitive for everyone.
          </p>
        </div>
      </FadeInSection>
    </div>
  </div>

  <!-- Handbook design showcase -->
  <div class="image-section">
    <img src="/Nass-Doku8.png" alt="Detailed view of the instructional manual designed to help users easily understand how to operate the NASS device" />
  </div>

  <!-- Project reflection and future potential -->
  <div class="grid-section1">
    <div class="text-grid1">
      <FadeInSection>
        <div>
          <h4>Future Potential</h4>
          <br>
          <p class="text-doku">
            NASS was an exciting project that challenged us to think beyond traditional interaction design and explore how technology could solve real-world problems. While our prototype remains a conceptual model, the process helped us understand the challenges of designing for usability, accessibility, and clear user guidance in a complex system.
            By focusing on intuitive interaction, clear visual communication, and a seamless user flow, we created a vision for how a water testing device could work in the future. This project reinforced the importance of prototyping, iteration, and user-centered design in shaping meaningful solutions.
          </p>
        </div>
      </FadeInSection>
    </div>
  </div>

  <!-- Team and tools section -->
  <div class="collaborators-section">
    <div class="divider-large"></div>
    
    <FadeInSection>
      <div class="collaborators-content">
        <h4>The People Behind the Project</h4>
        <div class="collaborators-list">
          <div class="collaborator">Jonas Wienberg</div>
          <div class="collaborator">Philipp Maginot</div>
          <div class="collaborator">Maria Kamenskaya</div>
          <div class="collaborator">Franz Anhäupl</div>
        </div>
        
        <!-- Creative tools section -->
        <div class="creative-arsenal">
          <h4>Our Creative Arsenal</h4>
          <p class="arsenal-intro">Crafting this experience with our digital toolbelt:</p>
          <div class="tools-container">
            <div class="tool">
              <span class="tool-name">Figma</span>
              <span class="tool-role">UI/UX Design</span>
            </div>
            <div class="tool">
              <span class="tool-name">Miro</span>
              <span class="tool-role">Collaboration & Ideation</span>
            </div>
            <div class="tool">
              <span class="tool-name">Dall-E 3</span>
              <span class="tool-role">AI Image Generation</span>
            </div>
            <div class="tool">
              <span class="tool-name">Premiere Pro</span>
              <span class="tool-role">Video Editing</span>
            </div>
            <div class="tool">
              <span class="tool-name">After Effects</span>
              <span class="tool-role">Motion Design</span>
            </div>
            <div class="tool">
              <span class="tool-name">FigJam</span>
              <span class="tool-role">Collaborative Whiteboarding</span>
            </div>
            <div class="tool">
              <span class="tool-name">Autodesk</span>
              <span class="tool-role">3D Design</span>
            </div>
            <div class="tool">
              <span class="tool-name">Ultimaker</span>
              <span class="tool-role">3D Printing</span>
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  </div>

  <!-- Bottom back button -->
  <div class="back-btn-container bottom-back">
    <button on:click={goBackToStatic}>
      <img src="/leftArrow.png" alt="Back arrow icon" />
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
  padding: 4rem;
}

/* Top section with title and project info */
.top-section {
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Back button styling */
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
  transition: background-color 0.2s ease;
}

.back-btn-container button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-btn-container button img {
  height: 1.2em;
  width: auto;
}

/* Page title styling */
.heading-container {
  width: 100%;
  height: 30vh;
  margin-top: 1rem;
  align-content: center;
}

.heading-container h1 {
  width: 100%;
  text-align: left;
  font-size: 6rem;
  margin: 0;
  padding: 0.5rem 0;
  font-family: 'Franz-Grotesk', sans-serif;
  color: #1359FF;
  letter-spacing: 0.1rem;
}

/* Project metadata columns */
.project-columns {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 1rem;
  max-width: 100%;
}

.project-column {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.project-column h3 {
  width: 100%;
  text-align: left;
  font-size: 1.5rem;
  margin: 0;
  padding: 0.5rem 0;
  color: grey;
  font-family: 'Franz-Grotesk', sans-serif;
}

.project-column .divider {
  width: 95%;
  height: 2px;
  background-color: grey;
  margin-bottom: 0.5rem;
}

.project-column p {
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

/* Full-width image sections */
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

/* Grid layout for text sections */
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

/* Image section with 4-span grid */
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

/* Two column image layout */
.img-section-2col {
  display: grid;
  grid-template-columns: 4fr 2fr; /* 4:2 ratio */
  gap: 2rem;
  margin-top: 10rem;
  width: 100%;
}

.img-container-left, .img-container-right {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-container-left img, .img-container-right img {
  width: 100%;
  height: auto;
  object-fit: contain;
  object-position: center;
}

/* Image styling */
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

/* Team section */
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

/* Tools section */
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
  color: #1359FF;
  font-family: 'Franz-Plex', mono;
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.tool-role {
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Franz-Grotesk', sans-serif;
  font-size: 0.9rem;
}

/* Bottom back button */
.bottom-back {
  margin-top: 10rem;
  margin-bottom: 3rem;
  display: flex;
  justify-content: flex-start;
}

/* Responsive styles for tablets */
@media (max-width: 768px) {
  /* Two column layout becomes single column */
  .img-section-2col {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin-top: 5rem;
  }
  
  .img-container-left, .img-container-right {
    width: 100%;
  }
  
  /* Text section adjustments */
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
  
  /* Project columns become full width */
  .project-columns {
    flex-direction: column;
    gap: 2rem;
  }
  
  .project-columns .project-column {
    min-width: 100%;
  }
  
  .project-column .divider,
  .project-column p,
  .tags {
    width: 100%;
  }

  /* Heading adjustments */
  .heading-container {
    height: auto;
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
  
  .heading-container h1 {
    font-size: 4rem;
    line-height: 1.1;
  }
  
  /* Image sections become full width */
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
  
  /* Team section adjustments */
  .collaborators-section {
    margin-top: 6rem;
    margin-bottom: 3rem;
  }
  
  .collaborators-list {
    flex-direction: column;
    gap: 1rem;
  }
  
  /* Tools section becomes full width */
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
  
  /* Bottom back button */
  .bottom-back {
    margin-top: 4rem;
    margin-bottom: 2rem;
  }
}

/* Mobile styles */
@media (max-width: 480px) {
  .content-wrapper {
    padding: 2rem 1.5rem;
    width: 95%;
  }
  
  /* Typography adjustments */
  .heading-container h1 {
    font-size: 3rem;
  }
  
  h4 {
    font-size: 1.3rem;
  }
  
  .text-doku {
    font-size: 1.1rem;
  }
  
  /* Button adjustments */
  .back-btn-container button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  /* Project columns adjustments */
  .project-column h3 {
    font-size: 1.3rem;
  }
  
  .project-column p {
    font-size: 1.2rem;
  }
  
  /* Tools grid for small screens */
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
</style>