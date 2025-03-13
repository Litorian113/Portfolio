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

      // Initial die mobilen Anzeigeeinstellungen anwenden
      if (window.innerWidth <= 768) {
        adjustMobileSportImages(currentSportIndex);
      }
      
      // Event-Listener für Bildschirmgrößenänderungen
      const handleResize = () => {
        if (window.innerWidth <= 768) {
          adjustMobileSportImages(currentSportIndex);
        } else {
          // Desktop-Modus: Alle Bilder anzeigen
          const sportsItems = document.querySelectorAll('.sports-grid-section .sports-item');
          sportsItems.forEach(item => {
            item.style.display = 'block';
          });
        }
      };
      
      window.addEventListener('resize', handleResize);

      // Masonry-Layout nach dem Laden der Bilder aktualisieren
      function resizeMasonryItems() {
        const grid = document.querySelector('.masonry-gallery');
        if (!grid) return;
        
        const rowHeight = 1;
        const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')) || 10; 
        
        const items = document.querySelectorAll('.masonry-item');
        items.forEach(item => {
          const img = item.querySelector('img');
          if (!img || !img.complete) return;
          
          const imgHeight = img.getBoundingClientRect().height;
          // Exakte Berechnung ohne Rundungsfehler
          const rowSpan = Math.floor(imgHeight / rowHeight) + Math.floor(rowGap / rowHeight);
          item.style.gridRowEnd = `span ${rowSpan}`;
        });
      }
      
      // Nach dem Laden aller Bilder Größen neu berechnen
      const masonryImages = document.querySelectorAll('.masonry-gallery img');
      let loadedImages = 0;
      
      masonryImages.forEach(img => {
        if (img.complete) {
          loadedImages++;
          if (loadedImages === masonryImages.length) {
            resizeMasonryItems();
          }
        } else {
          img.addEventListener('load', () => {
            loadedImages++;
            if (loadedImages === masonryImages.length) {
              resizeMasonryItems();
            }
            resizeMasonryItems(); // Aktualisiere Grid, wenn jedes Bild geladen wird
          });
        }
      });
      
      // Bei Resize Größen neu berechnen
      window.addEventListener('resize', resizeMasonryItems);
      
      resizeMasonryItems();
      setupImageResizeHandlers();
      
      // Mehrfache Aktualisierung um sicherzugehen (Browser-Quirks)
      setTimeout(resizeMasonryItems, 500);
      setTimeout(resizeMasonryItems, 2000);

      // Nach dem Laden der Bilder das Layout optimieren
      optimizeMasonryLayout();
      
      // Mehrfache Aktualisierung für dynamisch nachgeladene Bilder
      setTimeout(optimizeMasonryLayout, 1000);
      setTimeout(optimizeMasonryLayout, 3000);

      // Masonry mehrfach initialisieren, um sicherzustellen, dass es richtig berechnet wird
      setTimeout(initializeMasonry, 1000);
      setTimeout(initializeMasonry, 3000);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('resize', resizeMasonryItems);
        window.removeEventListener('resize', handleMasonryResize);
      };
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
  
    // Neue Video-Steuerung hinzufügen
    let currentVideoIndex = 0;
    const videoSources = [
      '/videos/video-mitte.mp4',
      '/videos/video-mitte2.mp4',
      '/videos/video-mitte3.mp4'
    ];
    
    // Funktion zum Wechseln des Videos
    function changeVideo(index) {
      currentVideoIndex = index;
      
      // Alle Video-Elemente aktualisieren
      const videoElements = document.querySelectorAll('.video-grid-section video');
      videoElements.forEach(video => {
        // Aktuelle Wiedergabeposition und Status speichern
        const wasPlaying = !video.paused;
        
        // Quelle aktualisieren
        video.src = videoSources[index];
        video.load();
        
        // Wiedergabe fortsetzen, wenn das Video vorher abgespielt wurde
        if (wasPlaying) {
          video.play();
        }
      });
    }

    // Neue Bildergalerie-Steuerung
    let currentSportIndex = 0;
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
          "/sport/Sport6.jpg" // Ich nehme an, hier sollte Sport6.jpg stehen
        ]
      }
    ];
    
    // Funktion zum Wechseln der Sportbilder
    function changeSportCategory(index) {
      currentSportIndex = index;
      
      // Data-Attribut für alternative CSS-Lösung setzen
      const gridSection = document.querySelector('.sports-grid-section');
      if (gridSection) {
        gridSection.dataset.currentSportIndex = index;
      }
      
      // Bei Mobilgeräten anpassen, welche Bilder angezeigt werden
      if (window.innerWidth <= 768) {
        const sportsItems = document.querySelectorAll('.sports-grid-section .sports-item');
        sportsItems.forEach((item, i) => {
          // Für Paragliding zeige nur das erste Bild (Sport1.jpg)
          if (index === 0 && i === 0) {
            item.style.display = 'block';
          } 
          // Für Soccer zeige nur das zweite Bild (Sport5.jpg)
          else if (index === 1 && i === 1) {
            item.style.display = 'block';
          } 
          else {
            item.style.display = 'none';
          }
        });
      }
    }

    // Hilfsfunktion zur Anpassung der mobilen Sport-Bild-Anzeige
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

    // Masonry-Layout auch aktualisieren, wenn Bilder im Hintergrund nachladen
    function setupImageResizeHandlers() {
      window.addEventListener('resize', resizeMasonryItems);
      
      const masonryImages = document.querySelectorAll('.masonry-gallery img');
      masonryImages.forEach((img) => {
        // Event-Listener für Bilder die noch nicht vollständig geladen sind
        if (!img.complete) {
          img.addEventListener('load', () => {
            resizeMasonryItems();
            // Manchmal braucht der Browser etwas Zeit für korrekte Berechnungen
            setTimeout(resizeMasonryItems, 200);
          });
        }
        
        // Erneute Berechnung bei Änderungen des Bildinhalts
        img.addEventListener('error', resizeMasonryItems);
      });
    }

    function optimizeMasonryLayout() {
      // Alle Bilder finden
      const items = document.querySelectorAll('.masonry-item');
      
      items.forEach(item => {
        const img = item.querySelector('img');
        
        // Nach dem Laden des Bildes das Seitenverhältnis prüfen
        if (img.complete) {
          adjustImageSpan(img, item);
        } else {
          img.onload = () => adjustImageSpan(img, item);
        }
      });
      
      // Nach einer kurzen Verzögerung die Zeilenhöhen neu berechnen
      setTimeout(resizeMasonryItems, 300);
    }
    
    // Hilfsfunktion zum Anpassen der Spaltenspanne basierend auf dem Seitenverhältnis
    function adjustImageSpan(img, item) {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      // Querformatbilder bekommen mehr Spalten
      if (aspectRatio > 1.3) {
        if (aspectRatio > 2) {
          // Besonders breite Bilder (Panorama)
          item.style.gridColumn = 'span 3';
        } else {
          // Standard-Querformat
          item.style.gridColumn = 'span 2';
        }
      } else {
        // Hochformatbilder
        item.style.gridColumn = 'span 1';
      }
    }

    // Neue Masonry-Funktionen für bessere Performance und Layout
    let masonryReady = false;

    function handleImageLoad(e, index) {
      const img = e.target;
      const item = img.parentElement;
      
      // Bild-Seitenverhältnis bestimmen
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      // Spaltenspanne basierend auf Seitenverhältnis setzen
      if (aspectRatio > 1.5) {
        // Sehr breite Bilder
        item.style.gridColumn = window.innerWidth <= 768 ? 'span 1' : 'span 2';
      }
      
      // Layout neu berechnen, wenn alle Bilder geladen sind
      setTimeout(() => {
        if (!masonryReady) {
          initializeMasonry();
          masonryReady = true;
        }
      }, 100);
    }

    function initializeMasonry() {
      // Echtes Masonry-Layout, das immer funktioniert
      const grid = document.querySelector('.masonry-gallery');
      if (!grid) return;
      
      // Warten, bis alle Bilder geladen sind
      setTimeout(() => {
        const items = grid.querySelectorAll('.masonry-item');
        
        // Immer genau 3 Spalten auf Desktop, weniger auf mobil
        const columnCount = window.innerWidth <= 480 ? 2 : 
                             window.innerWidth <= 768 ? 2 : 3;
        
        // Höhen der Spalten initialisieren
        const columnHeights = Array(columnCount).fill(0);
        const columnGap = 10; // Gleich wie grid-gap
        
        // Breite einer Spalte berechnen (ohne gaps)
        const gridWidth = grid.clientWidth;
        const columnWidth = (gridWidth - (columnGap * (columnCount - 1))) / columnCount;
        
        // Elemente positionieren
        items.forEach(item => {
          // Finde die kürzeste Spalte
          const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
          
          // Position berechnen
          const x = shortestColumnIndex * (columnWidth + columnGap);
          const y = columnHeights[shortestColumnIndex];
          
          // Element positionieren
          item.style.position = 'absolute';
          item.style.left = `${x}px`;
          item.style.top = `${y}px`;
          item.style.width = `${columnWidth}px`;
          
          // Spaltenhöhe aktualisieren
          columnHeights[shortestColumnIndex] += item.clientHeight + columnGap;
        });
        
        // Containerhöhe anpassen
        grid.style.height = `${Math.max(...columnHeights)}px`;
      }, 200);
    }

    // Beim Fenstergrößenwechsel neu berechnen
    function handleMasonryResize() {
      if (masonryReady) {
        initializeMasonry();
      }
    }

    // Ladestatus-Variablen
    let isLoading = true;
    let loadProgress = 0;
    let totalAssets = 0;
    let loadedAssets = 0;
    
    // Füge diese Funktion zur Verfolgung des Ladefortschritts hinzu
    function trackLoadingProgress() {
      // Zähle alle Bilder und Videos
      const images = document.querySelectorAll('img');
      const videos = document.querySelectorAll('video');
      totalAssets = images.length + videos.length;
      
      // Verfolge den Ladefortschritt für Bilder
      images.forEach(img => {
        if (img.complete) {
          loadedAssets++;
          updateProgress();
        } else {
          img.addEventListener('load', () => {
            loadedAssets++;
            updateProgress();
          });
          
          img.addEventListener('error', () => {
            loadedAssets++;
            updateProgress();
          });
        }
      });
      
      // Verfolge den Ladefortschritt für Videos
      videos.forEach(video => {
        video.addEventListener('loadeddata', () => {
          loadedAssets++;
          updateProgress();
        });
        
        video.addEventListener('error', () => {
          loadedAssets++;
          updateProgress();
        });
      });
      
      // Falls keine Assets gefunden wurden, verstecke den Loader
      if (totalAssets === 0) {
        completeLoading();
      }
    }
    
    // Aktualisiere den Ladefortschritt
    function updateProgress() {
      loadProgress = Math.floor((loadedAssets / totalAssets) * 100);
      if (loadProgress >= 100) {
        // Gib etwas zusätzliche Zeit für Rendering
        setTimeout(completeLoading, 500);
      }
    }
    
    // Schließe den Ladevorgang ab
    function completeLoading() {
      loadProgress = 100;
      // Sanfte Überblendung mit kleiner Verzögerung
      setTimeout(() => {
        isLoading = false;
      }, 600);
    }
    
    onMount(() => {
      // Bestehender onMount-Code
      
      // Starte den Ladefortschritt-Tracker
      trackLoadingProgress();
      
      // Als Fallback: Nach einer gewissen Zeit auf jeden Fall ausblenden
      setTimeout(() => {
        if (isLoading) completeLoading();
      }, 8000);
      
      return () => {
        // Bestehende Cleanup-Code
      };
    });

    function setupOptimizedImageLoading() {
      // Verbesserte Intersection Observer-Konfiguration
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          
          const img = entry.target;
          const dataSrc = img.dataset.src;
          
          // Progressive Loading-Strategie
          if (dataSrc) {
            // Ersetze kleines Platzhalterbild durch das vollständige Bild
            const fullImage = new Image();
            fullImage.onload = () => {
              img.src = dataSrc;
              img.classList.add('loaded');
            };
            fullImage.src = dataSrc;
            
            // Observer entfernen, nachdem das Bild geladen wurde
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '200px 0px', // 200px Vorladepuffer
        threshold: 0.01 // Schon bei geringer Sichtbarkeit laden
      });
      
      // Auf alle Bilder anwenden (außer Bilder, die sofort sichtbar sein müssen)
      document.querySelectorAll('img:not(.priority-image)').forEach(img => {
        // Kleine Vorschaubilder für alles außer den wichtigsten Bildern verwenden
        if (!img.classList.contains('priority-image')) {
          const originalSrc = img.src;
          const smallSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/, '-small.$1');
          
          // Original-URL in data-src speichern
          img.dataset.src = originalSrc;
          // Kleines Bild zuerst anzeigen
          img.src = smallSrc;
          
          // Für moderne Browser WebP verwenden, wenn verfügbar
          if (supportsWebp()) {
            const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/, '.webp');
            img.dataset.src = webpSrc;
          }
          
          imageObserver.observe(img);
        }
      });
    }

    // Webp-Unterstützung prüfen
    function supportsWebp() {
      const elem = document.createElement('canvas');
      if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      return false;
    }

    onMount(() => {
      // Bestehender onMount-Code
      setupOptimizedImageLoading();
    });
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
            <h2>Seeing the World My Way.</h2>
          </div>


  
  
    </div>

    

  <div class="video-grid-section">
    <div class="video-item">
      <video autoplay muted loop playsinline>
        <source src={videoSources[currentVideoIndex]} type="video/mp4">
        Dein Browser unterstützt keine Videos.
      </video>
    </div>
    <div class="video-item">
      <video autoplay muted loop playsinline>
        <source src={videoSources[currentVideoIndex]} type="video/mp4">
        Dein Browser unterstützt keine Videos.
      </video>
    </div>
    <div class="video-item">
      <video autoplay muted loop playsinline>
        <source src={videoSources[currentVideoIndex]} type="video/mp4">
        Dein Browser unterstützt keine Videos.
      </video>
    </div>
  </div>

  <!-- Video-Toggle hinzufügen -->
  <div class="video-toggle-container">
    <div class="video-toggle-buttons">
      <button 
        class:active={currentVideoIndex === 0}
        on:click={() => changeVideo(0)}
        aria-label="Street Photography"
      >
        <span>Taipeh</span>
      </button>
      <button 
        class:active={currentVideoIndex === 1}
        on:click={() => changeVideo(1)}
        aria-label="Architecture Photography"
      >
        <span>London</span>
      </button>
      <button 
        class:active={currentVideoIndex === 2}
        on:click={() => changeVideo(2)}
        aria-label="Portrait Photography"
      >
        <span>Rotterdam</span>
      </button>
    </div>
  </div>


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
  
  <!-- Neues Sport-Bild-Grid -->
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

  
  <!-- Sport-Toggle hinzufügen -->
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

<!-- Fashion-Bilder im Vollbreite-Grid -->
<div class="fashion-grid">
  <div class="fashion-item">
    <img src="/mode/Tasche1.jpg" alt="Fashion photography - bag design" />
  </div>
  <div class="fashion-item">
    <img src="/mode/Tasche2.jpg" alt="Fashion photography - accessory detail" />
  </div>
</div>

<!-- Füge diesen Block nach dem Fashion-Grid ein -->
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

<!-- Company Video Container - Controls entfernt, Autoplay hinzugefügt -->
<div class="company-video-container">
  <video autoplay muted loop playsinline preload="metadata">
    <source src="/videos/Lang_Final.mp4" type="video/mp4">
    Dein Browser unterstützt keine Videos.
  </video>
</div>

<!-- Nach dem Company Video Container hinzufügen -->
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

<!-- Masonry Gallery mit voller Breite -->
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
    color: #EFE4C6;
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
  
  .video-grid-section {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    margin-top: 2rem;
    margin-bottom: 4rem;
  }
  
  .video-item {
    grid-column: span 2; /* Jedes Video nimmt 2 Spalten ein */
  }
  
  .video-item video {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px; /* Optional für abgerundete Ecken */
    aspect-ratio: 9/16; /* Bewahrt das Seitenverhältnis */
    object-fit: cover; /* Füllt das Container-Element komplett aus */
  }
  
  /* Mobil-Anpassungen */
  @media (max-width: 768px) {
    .video-grid-section {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    
    .video-item {
      grid-column: span 1; /* Im Handy-Layout untereinander */
      display: none; /* Standardmäßig alle ausblenden */
    }
    
    /* Nur das erste Video anzeigen */
    .video-item:first-child {
      display: block;
    }
  }
  
  /* Neue Styles für die Video-Toggle-Buttons */
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
  
  /* Mobile Anpassung */
  @media (max-width: 768px) {
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
  }
  
  @media (max-width: 480px) {
    .video-toggle-buttons button {
      padding: 0.6rem 0.4rem;
      font-size: 0.75rem;
    }
  }
  
  /* Bestehende Styles beibehalten... */
  
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
    
    .project-columns .project-column h3 {
      font-size: 1.3rem;
    }
    
    .project-columns .project-column p {
      font-size: 1.2rem;
    }
  }


  @media (max-width: 360px) {
  .heading-container h2 {
    font-size: 2rem;  /* Noch kompaktere Größe für sehr schmale Displays */
    word-break: break-word; /* Erlaubt Umbrüche bei langen Projektnamen */
  }
  
  .back-btn-container button {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}

  /* Neue Styles für das Sports-Grid */
  .sports-grid-section {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  
  .sports-item {
    grid-column: span 2; /* Jedes Bild nimmt 2 Spalten ein */
    aspect-ratio: 9/16; /* Standard-Fotoseitenverhältnis */
    overflow: hidden;
    border-radius: 8px;
  }
  
  .sports-item img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Füllt das Container-Element komplett aus */
    transition: transform 0.5s ease;
  }
  
  .sports-item:hover img {
    transform: scale(1.1); /* Leichter Zoom-Effekt beim Hover */
  }
  
  /* Styles für die Sport-Toggle-Buttons (ähnlich wie Video-Toggle-Buttons) */
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
  
  /* Mobile Anpassung */
  @media (max-width: 768px) {
    .sports-grid-section {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    
    .sports-item {
      grid-column: span 1; /* Im Handy-Layout untereinander */
      display: none; /* Standardmäßig verstecken */
    }
    
    /* Nur das erste Bild für Paragliding anzeigen, wenn es aktiv ist */
    .sports-grid-section:has(+ .sports-toggle-container .sports-toggle-buttons button:first-child.active) .sports-item:first-child {
      display: block;
    }
    
    /* Nur das zweite Bild für Soccer anzeigen, wenn es aktiv ist */
    .sports-grid-section:has(+ .sports-toggle-container .sports-toggle-buttons button:nth-child(2).active) .sports-item:nth-child(2) {
      display: block;
    }
    
    /* Für Browser, die :has nicht unterstützen, eine alternative Lösung */
    [data-current-sport-index="0"] .sports-item:first-child,
    [data-current-sport-index="1"] .sports-item:nth-child(2) {
      display: block;
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
  }

  /* Fashion Photography Grid Styles */
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
  
  /* Mobile Anpassungen */
  @media (max-width: 768px) {
    .fashion-grid {
      gap: 24px;
      margin: 1.5rem 0 4rem 0;
    }
  }

  /* Company Video Styles */
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
    max-height: 80vh; /* Verhindert zu große Videos */
    border-radius: 8px;
  }
  
  /* Mobile Anpassungen */
  @media (max-width: 768px) {
    .company-video-container {
      margin: 1rem 0 4rem 0;
    }
  }

  /* Masonry Gallery Styles für volle Breite mit 3 Spalten */
.masonry-container {
  width: 100%;
  margin: 2rem 0 7rem 0;
  grid-column: 1 / span 6; /* Volle Breite im 6er-Grid */
}

.masonry-gallery {
  position: relative; /* Wichtig für absolute Positionierung der Kinder */
  width: 100%;
}

.masonry-item {
  position: absolute; /* Wird durch JS gesetzt */
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

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .masonry-gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .masonry-gallery {
    grid-template-columns: 1fr;
  }
}
  </style>