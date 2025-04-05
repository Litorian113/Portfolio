<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription}>
  <meta name="keywords" content={pageKeywords}>
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://fxma.design/project/photovideo">
  
  <!-- Open Graph Tags for Social Media -->
  <meta property="og:title" content={pageTitle}>
  <meta property="og:description" content={pageDescription}>
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://fxma.design/project/photovideo">
  <meta property="og:image" content="https://fxma.design/mode/Tasche1.jpg">
  
  <!-- Structured Data for Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "name": "Photography & Videography Portfolio",
    "description": "A collection of photography and videography work featuring sports, fashion, and urban scenes captured through professional equipment and a unique creative perspective.",
    "creator": {
      "@type": "Person",
      "name": "Franz"
    },
    "artMedium": "Photography and Videography",
    "keywords": "photography, videography, sports photography, fashion photography, Canon R6, creative direction",
    "isPartOf": {
      "@type": "WebSite",
      "name": "FXMA Design",
      "url": "https://fxma.design"
    },
    "image": "https://fxma.design/mode/Tasche1.jpg"
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
  
    // SEO configuration for this project page
    const pageTitle = "Photography & Videography Portfolio | FXMA Design";
    const pageDescription = "Explore a diverse collection of photography and videography work spanning sports, fashion, and urban scenes captured through a unique creative perspective.";
    const pageKeywords = "photography portfolio, video production, sports photography, fashion photography, videography, camera work, Franz portfolio";

    // Initialize UI state variables
    let currentVideoIndex = 0;
    let currentSportIndex = 0;
    
    // Video source definitions
    const videoSources = [
      '/videos/video-mitte.mp4',
      '/videos/video-mitte2.mp4',
      '/videos/video-mitte3.mp4'
    ];
    
    // Sports image category definitions
    const sportCategories = [
      {
        name: "Paragliding",
        images: [
          "/sport/Sport1.jpg",
          "/sport/Sport2.jpg",
          "/sport/Sport3.jpg"
        ]
      },
      {
        name: "Soccer",
        images: [
          "/sport/Sport4.jpg",
          "/sport/Sport5.jpg",
          "/sport/Sport6.jpg"
        ]
      }
    ];

    // Enable scrolling and initialize UI components
    onMount(() => {
      // Enable scrolling explicitly for this page
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
  
      if (browser) {
        // Set up lazy loading with Intersection Observer
        setupLazyLoading();
        
        // Apply mobile display settings if needed
        if (window.innerWidth <= 768) {
          adjustMobileSportImages(currentSportIndex);
        }
        
        // Add resize handler for responsive adjustments
        const handleResize = debounce(() => {
          if (window.innerWidth <= 768) {
            adjustMobileSportImages(currentSportIndex);
          } else {
            // Desktop mode: Show all images
            document.querySelectorAll('.sports-grid-section .sports-item').forEach(item => {
              item.style.display = 'block';
            });
          }
          
          // Update masonry layout on resize
          updateMasonryLayout();
        }, 200);
        
        window.addEventListener('resize', handleResize);
        
        // Initialize masonry layout
        initMasonry();
        
        // Clean up event listeners on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    });
    
    // Debounce function to limit execution frequency
    function debounce(func, wait) {
      let timeout;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    }
    
    // Setup lazy loading for images
    function setupLazyLoading() {
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
  
    // Navigate back to static projects page
    function goBackToStatic() {
      goto('/static#photo-video'); // Direct link back to static main page with anchor
    }
    
    // Handle mouse movement for parallax effect
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
  
    // Reset transform when mouse leaves
    function resetTransform(e) {
      e.currentTarget.querySelector('img').style.transform = 'translate(0,0)';
    }
    
    // Change video source for all video elements
    function changeVideo(index) {
      currentVideoIndex = index;
      
      // Update all video elements
      const videoElements = document.querySelectorAll('.video-grid-section video');
      videoElements.forEach(video => {
        const wasPlaying = !video.paused;
        video.src = videoSources[index];
        video.load();
        
        // Resume playback if video was playing
        if (wasPlaying) {
          video.play();
        }
      });
    }
    
    // Change sports category and update display
    function changeSportCategory(index) {
      currentSportIndex = index;
      
      // Set data attribute for alternative CSS solution
      const gridSection = document.querySelector('.sports-grid-section');
      if (gridSection) {
        gridSection.dataset.currentSportIndex = index;
      }
      
      // On mobile devices, adjust which images are shown
      if (window.innerWidth <= 768) {
        adjustMobileSportImages(index);
      }
    }

    // Helper function to adjust mobile sport image display
    function adjustMobileSportImages(index) {
      const sportsItems = document.querySelectorAll('.sports-grid-section .sports-item');
      sportsItems.forEach((item, i) => {
        if ((index === 0 && i === 0) || (index === 1 && i === 1)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }

    // Optimized masonry layout initialization
    function initMasonry() {
      const grid = document.querySelector('.masonry-gallery');
      if (!grid) return;
      
      // Process all masonry items
      const items = document.querySelectorAll('.masonry-item');
      items.forEach(item => {
        const img = item.querySelector('img');
        
        // Handle aspect ratio based layout
        if (img.complete) {
          adjustImageLayout(img, item);
        } else {
          img.onload = () => adjustImageLayout(img, item);
        }
        
        // Monitor image load events to update layout
        img.addEventListener('load', updateMasonryLayout);
      });
      
      // Initial layout update
      updateMasonryLayout();
    }
    
    // Update masonry layout sizing
    function updateMasonryLayout() {
      const grid = document.querySelector('.masonry-gallery');
      if (!grid) return;
      
      // Calculate column count based on viewport
      const columnCount = window.innerWidth <= 480 ? 1 : 
                          window.innerWidth <= 768 ? 2 : 3;
      
      // Setup columns
      const columnGap = 10;
      const gridWidth = grid.clientWidth;
      const columnWidth = (gridWidth - (columnGap * (columnCount - 1))) / columnCount;
      const columnHeights = Array(columnCount).fill(0);
      
      // Position each item
      const items = Array.from(grid.querySelectorAll('.masonry-item'));
      items.forEach(item => {
        // Find shortest column
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        
        // Calculate position
        const x = shortestColumnIndex * (columnWidth + columnGap);
        const y = columnHeights[shortestColumnIndex];
        
        // Position item
        item.style.position = 'absolute';
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        item.style.width = `${columnWidth}px`;
        
        // Update column height
        columnHeights[shortestColumnIndex] += item.clientHeight + columnGap;
      });
      
      // Set container height
      grid.style.height = `${Math.max(...columnHeights)}px`;
    }
    
    // Adjust image layout based on aspect ratio
    function adjustImageLayout(img, item) {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      // Assign column span based on image aspect ratio
      if (aspectRatio > 1.3) {
        if (aspectRatio > 2) {
          // Panoramic images
          item.style.gridColumn = 'span 3';
        } else {
          // Standard landscape
          item.style.gridColumn = 'span 2';
        }
      } else {
        // Portrait images
        item.style.gridColumn = 'span 1';
      }
    }
    
    // Handler for image load events in masonry
    function handleImageLoad(e) {
      const img = e.target;
      const item = img.parentElement;
      
      adjustImageLayout(img, item);
      updateMasonryLayout();
    }
</script>
  
<!-- Scrollable container for the page -->
<div class="scroll-container">
  <div class="content-wrapper">
    <!-- Header section with back button and title -->
    <div class="top-section">
      <div class="back-btn-container">
        <button on:click={goBackToStatic}>
          <img src="/leftArrow.png" alt="Back arrow" />
          Back
        </button>
        </div>
        <div class="heading-container">
            <h1>Seeing the World My Way.</h1>
          </div>
    </div>

    <!-- Video showcase section -->
    <div class="video-grid-section">
      <div class="video-item">
        <video autoplay muted loop playsinline>
          <source src={videoSources[currentVideoIndex]} type="video/mp4">
          Your browser does not support video playback.
        </video>
      </div>
      <div class="video-item">
        <video autoplay muted loop playsinline>
          <source src={videoSources[currentVideoIndex]} type="video/mp4">
          Your browser does not support video playback.
        </video>
      </div>
      <div class="video-item">
        <video autoplay muted loop playsinline>
          <source src={videoSources[currentVideoIndex]} type="video/mp4">
          Your browser does not support video playback.
        </video>
      </div>
    </div>

    <!-- Location selector for videos -->
    <div class="video-toggle-container">
      <div class="video-toggle-buttons">
        <button 
          class:active={currentVideoIndex === 0}
          on:click={() => changeVideo(0)}
          aria-label="Taipeh Street Photography"
        >
          <span>Taipeh</span>
        </button>
        <button 
          class:active={currentVideoIndex === 1}
          on:click={() => changeVideo(1)}
          aria-label="London Architecture Photography"
        >
          <span>London</span>
        </button>
        <button 
          class:active={currentVideoIndex === 2}
          on:click={() => changeVideo(2)}
          aria-label="Rotterdam Urban Photography"
        >
          <span>Rotterdam</span>
        </button>
      </div>
    </div>

    <!-- Introduction section -->
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
            <h4>Capturing Time, Framing Stories.</h4>
            <br>
            <p class="text-doku">
              Photography and videography have always been more than just a passion for me—they are my way of exploring movement, light, and perspective. Especially through hyperlapses, I love transforming moments into dynamic visual narratives. This creative drive led me to turn my second passion into a profession, contributing to video and photo productions for several years, where I honed my skills in bringing ideas to life through the lens.
            </p>
          </div>
        </FadeInSection>
      </div>
    </div>
  
    <!-- Sports photography section -->
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
            <h4>Sports Photography</h4>
            <br>
            <p class="text-doku">
              Sports photography allows me to capture raw emotion and dynamic movement in a single frame.
            </p>
            <br>
            <br>
          </div>
        </FadeInSection>
      </div>
    </div>
  
    <!-- Sports image gallery with category selector -->
    <div class="sports-grid-section">
      <div class="sports-item">
        <img src={sportCategories[currentSportIndex].images[0]} alt={`${sportCategories[currentSportIndex].name} photography 1`} />
      </div>
      <div class="sports-item">
        <img src={sportCategories[currentSportIndex].images[1]} alt={`${sportCategories[currentSportIndex].name} photography 2`} />
      </div>
      <div class="sports-item">
        <img src={sportCategories[currentSportIndex].images[2]} alt={`${sportCategories[currentSportIndex].name} photography 3`} />
      </div>
    </div>

    <!-- Sport category toggle buttons -->
    <div class="sports-toggle-container">
      <div class="sports-toggle-buttons">
        <button 
          class:active={currentSportIndex === 0}
          on:click={() => changeSportCategory(0)}
          aria-label="Paragliding Photography"
        >
          <span>Paragliding</span>
        </button>
        <button 
          class:active={currentSportIndex === 1}
          on:click={() => changeSportCategory(1)}
          aria-label="Soccer Photography"
        >
          <span>Soccer</span>
        </button>
      </div>
    </div>

    <!-- Fashion photography section -->
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
            <h4>Fashion Photography</h4>
            <br>
            <p class="text-doku">
              Fashion photography merges artistic vision with commercial appeal. These shots showcase my work with accessories and fashion items, where lighting and composition work together to highlight textures and details.
            </p>
            <br>
            <br>
          </div>
        </FadeInSection>
      </div>
    </div>

    <!-- Fashion photography gallery -->
    <div class="fashion-grid">
      <div class="fashion-item">
        <img src="/mode/Tasche1.jpg" alt="Fashion photography - bag design" />
      </div>
      <div class="fashion-item">
        <img src="/mode/Tasche2.jpg" alt="Fashion photography - accessory detail" />
      </div>
    </div>

    <!-- Accessory showcase video -->
    <div class="company-video-container">
      <video autoplay muted loop playsinline preload="metadata">
        <source src="/videos/tasche.mp4" type="video/mp4">
        Your browser does not support video playback.
      </video>
    </div>

    <!-- Company video section -->
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
            <h4>Company Video</h4>
            <br>
            <p class="text-doku">
              Professional video production for corporate clients requires technical precision and storytelling skills. 
              This project demonstrates my approach to creating engaging content that aligns with brand identity while 
              maintaining visual excellence.
            </p>
            <br>
          </div>
        </FadeInSection>
      </div>
    </div>

    <!-- Corporate video showcase -->
    <div class="company-video-container">
      <video autoplay muted loop playsinline preload="metadata">
        <source src="/videos/Lang_Final.mp4" type="video/mp4">
        Your browser does not support video playback.
      </video>
    </div>

    <!-- Photography gallery introduction -->
    <div class="grid-section1">
      <div class="text-grid1">
        <FadeInSection>
          <div>
            <h4>Feel free to explore</h4>
            <br>
            <p class="text-doku">
              A selection of moments I've captured over the years. Each photograph represents a unique 
              perspective – from urban landscapes to quiet moments. These images reflect my evolving style 
              and approach to visual storytelling.
            </p>
            <br>
          </div>
        </FadeInSection>
      </div>
    </div>

    <!-- Masonry photo gallery -->
    <div class="masonry-container">
      <div class="masonry-gallery">
        {#each [
          'man1.jpeg', 'man2.jpg', 'man3.jpg', 'man4.jpg',
          'man5.jpg', 'man6.jpg', 'man7.jpg', 'man8.jpg', 'man9.jpg',
          'man10.jpg', 'man11.jpg', 'man12.jpg', 'man13.jpg',
          'man15.jpg', 'man16.jpg', 'man17.jpg', 'man18.jpg', 'man19.jpeg',
          'man20.jpg', 'man21.jpg', 'man22.jpg', 'man23.jpeg', 'man24.jpg', 'man25.jpg', 'man26.jpg'
        ] as filename}
          <div class="masonry-item">
            <img 
              src={`/mansory/${filename}`} 
              alt="Photography gallery" 
              loading="lazy"
              on:load={handleImageLoad}
            />
          </div>
        {/each}
      </div>
    </div>

    <!-- Equipment and tools section -->
    <div class="collaborators-section">
      <div class="divider-large"></div>
      
      <FadeInSection>
        <div class="creative-arsenal">
          <h4>My Creative Arsenal</h4>
          <p class="arsenal-intro">Crafting these pictures and videos with these tools</p>
          <div class="tools-container">
            <div class="tool">
              <span class="tool-name">Canon 90D</span>
              <span class="tool-role">B-Roll & Backup Cam</span>
            </div>
        
            <div class="tool">
              <span class="tool-name">Canon R6 Mark II</span>
              <span class="tool-role">Primary Camera</span>
            </div>
        
            <div class="tool">
              <span class="tool-name">DJI Ronin RS2</span>
              <span class="tool-role">Camera Stabilization</span>
            </div>
        
            <div class="tool">
              <span class="tool-name">Photoshop</span>
              <span class="tool-role">Retouching & Compositing</span>
            </div>
        
            <div class="tool">
              <span class="tool-name">Lightroom</span>
              <span class="tool-role">Photo Color Grading</span>
            </div>
        
            <div class="tool">
              <span class="tool-name">Premiere Pro</span>
              <span class="tool-role">Video Editing</span>
            </div>
        
            <div class="tool">
              <span class="tool-name">After Effects</span>
              <span class="tool-role">Motion Graphics & VFX</span>
            </div>
        
            <div class="tool">
              <span class="tool-name">Canon RF 70–200mm f/2.8</span>
              <span class="tool-role">Telephoto Zoom Lens</span>
            </div>
        
            <div class="tool">
              <span class="tool-name">Canon RF 24–70mm f/2.8</span>
              <span class="tool-role">Allround Zoom Lens</span>
            </div>
        
            <div class="tool">
              <span class="tool-name">GoPro Hero 10 Black</span>
              <span class="tool-role">Action & POV Shots</span>
            </div>
        
            <div class="tool">
              <span class="tool-name">DJI Mavic Air 2</span>
              <span class="tool-role">Aerial Footage</span>
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
  
  /* Header styling */
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
    color: #EFE4C6;
    letter-spacing: 0.1rem;
  }
  
  /* Grid layout for content sections */
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
    color: #EFE4C6;
    line-height: 1.6;
    font-size: 1.5rem;
  }
  
  .text-doku {
    color: white;
    font-family: 'Franz-Plex', mono;
    line-height: 1.6;
    font-size: 1.5rem;
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
  
  /* Video grid layout */
  .video-grid-section {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    margin-top: 2rem;
    margin-bottom: 4rem;
  }
  
  .video-item {
    grid-column: span 2; /* Each video takes 2 columns */
  }
  
  .video-item video {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
    aspect-ratio: 9/16;
    object-fit: cover;
  }
  
  /* Video toggle buttons */
  .video-toggle-container {
    display: flex;
    justify-content: center;
    margin: 0 auto 5rem auto;
    width: 100%;
  }
  
  .video-toggle-buttons {
    display: flex;
    gap: 1rem;
    background: rgba(27, 29, 58, 0.7);
    padding: 0.7rem;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  .video-toggle-buttons button {
    background: transparent;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 30px;
    color: #b8b8b8;
    font-family: 'Franz-Plex', monospace;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .video-toggle-buttons button.active {
    background: rgba(255, 255, 255, 0.15);
    color: #EFE4C6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }
  
  .video-toggle-buttons button:hover:not(.active) {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-1px);
  }
  
  /* Sports grid layout */
  .sports-grid-section {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  
  .sports-item {
    grid-column: span 2;
    aspect-ratio: 9/16;
    overflow: hidden;
    border-radius: 8px;
  }
  
  .sports-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .sports-item:hover img {
    transform: scale(1.1);
  }
  
  /* Sports toggle buttons */
  .sports-toggle-container {
    display: flex;
    justify-content: center;
    margin: 0 auto 5rem auto;
    width: 100%;
  }
  
  .sports-toggle-buttons {
    display: flex;
    gap: 1rem;
    background: rgba(27, 29, 58, 0.7);
    padding: 0.7rem;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  .sports-toggle-buttons button {
    background: transparent;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 30px;
    color: #b8b8b8;
    font-family: 'Franz-Plex', monospace;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .sports-toggle-buttons button.active {
    background: rgba(255, 255, 255, 0.15);
    color: #EFE4C6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }
  
  .sports-toggle-buttons button:hover:not(.active) {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-1px);
  }

  /* Fashion grid layout */
  .fashion-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    margin: 2rem 0 5rem 0;
  }
  
  .fashion-item {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
  }
  
  .fashion-item img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .fashion-item:hover img {
    transform: scale(1.02);
  }

  /* Company video container */
  .company-video-container {
    width: 100%;
    margin: 1rem 0 5rem 0;
    border-radius: 8px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.2);
  }
  
  .company-video-container video {
    width: 100%;
    height: auto;
    display: block;
    max-height: 80vh;
    border-radius: 8px;
  }

  /* Masonry gallery layout */
  .masonry-container {
    width: 100%;
    margin: 2rem 0 7rem 0;
    grid-column: 1 / span 6;
  }
  
  .masonry-gallery {
    position: relative;
    width: 100%;
  }
  
  .masonry-item {
    position: absolute;
    overflow: hidden;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .masonry-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
  
  .masonry-item img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.5s ease;
  }

  /* Tools and equipment section */
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
    color: #EFE4C6;
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

  /* Responsive design for tablets and smaller screens */
  @media (max-width: 768px) {
    /* Video layout */
    .video-grid-section {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    
    .video-item {
      grid-column: span 1;
      display: none;
    }
    
    .video-item:first-child {
      display: block;
    }
    
    .video-toggle-buttons {
      flex-direction: row;
      padding: 0.5rem;
      width: 90%;
    }
    
    .video-toggle-buttons button {
      flex: 1;
      padding: 0.7rem 0.5rem;
      font-size: 0.85rem;
    }
    
    /* Sports layout */
    .sports-grid-section {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    
    .sports-item {
      grid-column: span 1;
      display: none;
    }
    
    .sports-toggle-buttons {
      flex-direction: row;
      padding: 0.5rem;
      width: 90%;
    }
    
    .sports-toggle-buttons button {
      flex: 1;
      padding: 0.7rem 0.5rem;
      font-size: 0.85rem;
    }
    
    /* Text layout */
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
    
    /* Header */
    .heading-container {
      height: auto;
      margin-top: 1rem;
      margin-bottom: 2rem;
    }
    
    .heading-container h1 {
      font-size: 4rem;
      line-height: 1.1;
    }
    
    /* Masonry layout */
    .masonry-gallery {
      grid-template-columns: repeat(2, 1fr);
    }
    
    /* Fashion grid */
    .fashion-grid {
      gap: 24px;
      margin: 1.5rem 0 4rem 0;
    }
    
    /* Video containers */
    .company-video-container {
      margin: 1rem 0 4rem 0;
    }
    
    /* Tools section */
    .collaborators-section {
      margin-top: 6rem;
      margin-bottom: 3rem;
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
  }

  /* Mobile design for phones */
  @media (max-width: 480px) {
    .heading-container h1 {
      font-size: 2rem;
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
    
    .video-toggle-buttons button {
      padding: 0.6rem 0.4rem;
      font-size: 0.75rem;
    }
    
    .masonry-gallery {
      grid-template-columns: 1fr;
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
  }

  /* Extra small screens */
  @media (max-width: 360px) {
    .heading-container h1 {
      font-size: 2rem;
      word-break: break-word;
    }
    
    .back-btn-container button {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
    }
  }
</style>