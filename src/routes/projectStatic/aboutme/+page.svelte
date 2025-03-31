<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription}>
  <meta name="keywords" content={pageKeywords}>
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://fxma.design/project/aboutme">
  
  <!-- Open Graph Tags für Social Media -->
  <meta property="og:title" content={pageTitle}>
  <meta property="og:description" content={pageDescription}>
  <meta property="og:type" content="profile">
  <meta property="og:url" content="https://fxma.design/project/aboutme">
  <meta property="og:image" content="https://fxma.design/about-profile.jpg">
  
  <!-- Strukturierte Daten für Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Franz",
    "description": "Designer working at the intersection of design and technology, specializing in UI/UX and interactive systems.",
    "jobTitle": "Interaction Designer",
    "worksFor": {
      "@type": "Organization",
      "name": "AI+D Lab, KITeGG, HfG Schwäbisch Gmünd"
    },
    "knowsAbout": ["UI/UX Design", "Interaction Design", "Data Visualization", "Programming", "Web Development"],
    "url": "https://fxma.design",
    "sameAs": ["https://fxma.design/project/aboutme"]
  }
  </script>
</svelte:head>

<script>
    import Footer from "$lib/Footer.svelte";
    import FadeInSection from '$lib/components/FadeInSection.svelte';
    import { onMount } from 'svelte';
    import { spring } from 'svelte/motion';
    import { fade, fly } from 'svelte/transition';
    import { goto } from '$app/navigation';

    // SEO-Konfiguration
    const pageTitle = "About Me | Franz | Designer & Developer";
    const pageDescription = "Franz is a designer working at the intersection of design and technology, specializing in UI/UX, programming, and data visualizations at the AI+D Lab.";
    const pageKeywords = "Franz, designer, developer, UI/UX, data visualization, interaction design, portfolio, AI+D Lab";

    // State Management für Kategorien
    let activeCategory = 'about'; // 'about', 'journey', 'tools', 'tech'
    
    // State für Partikel-Animation und Mausverfolgung (gemeinsam verwendet)
    let particles = [];
    let particleContainer;
    let mouseX = 0;
    let mouseY = 0;
    let hoveredHobby = null;
    
    // Verbesserte Springs mit angepassten Parametern für flüssigere Animation
    const cursorPosition = spring({ x: -100, y: -100 }, {
        stiffness: 0.07,  // Reduziert für sanftere Bewegung
        damping: 0.35     // Angepasst für natürlicheren "Schwung"
    });
    
    // Zweite Position für den Sekundär-Cursor mit stärkerer Verzögerung
    const cursorPositionDelayed = spring({ x: -100, y: -100 }, {
        stiffness: 0.03,  // Noch langsamere Reaktion
        damping: 0.5      // Stärkere Dämpfung
    });
    
    // Cursor-Größe-Animation für Klick-Effekt
    const cursorScale = spring(1, {
        stiffness: 0.2,
        damping: 0.4
    });
    
    // Variable für aktuelle Cursor-Variation (Standard, Hover, Klick)
    let cursorVariation = 'default';
    
    // Flag für Cursor-Sichtbarkeit
    let isCursorVisible = false;
    
    // Timeline-Daten - In umgekehrter Reihenfolge (aktuellstes zuerst)
    const timeline = [
        { year: '2025-present', title: 'Assistant', location: 'AI+D Lab, KITeGG, HfG Schwäbisch Gmünd', description: 'Research work in AI-driven interactive technologies' },
        { year: '2024-present', title: 'Student Parliament', location: 'HfG Schwäbisch Gmünd', description: 'Representing student interests' },
        { year: '2023-present', title: 'Interaction Design', location: 'HfG Schwäbisch Gmünd', description: 'Focus on user experience and interactive systems' },
        { year: '2021-present', title: 'Commercial Photographer', location: 'Freelance', description: 'Creative photo projects for various clients' },
        { year: '2017-2023', title: 'Media Informatics', location: 'University of Ulm', description: 'Foundations in computer science and media design' }
    ];
    
    // Tools mit Kategorisierung (P5.js wurde entfernt und zur Tech-Kategorie verschoben)
    const tools = [
        { name: 'Figma', category: 'Design' },
		{ name: 'Miro', category: 'Design' },
		{ name: 'FigJam', category: 'Design' },
        { name: 'VS Code', category: 'Development' },
        { name: 'Arduino IDE', category: 'Development' },
        { name: 'MongoDB', category: 'Development' },
        { name: 'Autodesk', category: 'Prototyping' },
        { name: 'Premiere Pro', category: 'Videosoftware' },
        { name: 'Aftereffetcs', category: 'Videosoftware' },
        { name: 'Lightroom', category: 'Photo' },
        { name: 'Photoshop', category: 'Photo' },
        { name: 'Ultimaker', category: 'Prototyping' }
    ];
    
    // AI models and tech stack (neue Kategorie)
    const techStack = [
        { name: 'DALL·E 3', category: 'AI Image Generation' },
        { name: 'Claude 3.7', category: 'AI Assistant' },
        { name: 'ChatGPT', category: 'AI Assistant' },
        { name: 'Stable Diffusion', category: 'AI Image Generation' },
        { name: 'ElevenLabs', category: 'AI Voice Synthesis' },
        { name: 'SvelteKit', category: 'Web Framework' },
        { name: 'HTML/CSS', category: 'Web Foundation' },
        { name: 'P5.js', category: 'Creative Coding' },
        { name: 'Three.js', category: '3D Visualization' },
        { name: 'FullPage.js', category: 'Web Scroll' },
        { name: 'Docker', category: 'Deployment' },
        { name: 'Vue.js', category: 'Web Framework' },
        { name: 'Nuxt.js', category: 'Vue Framework' }
    ];
    
    // Hobbies mit Icons (können später durch echte Icons ersetzt werden)
    const hobbies = [
        { name: 'Bouldering', icon: '🧗' },
        { name: 'Traveling', icon: '✈️' },
        { name: 'Photography', icon: '📸' },
        { name: 'Table Soccer', icon: '⚽' },
        { name: 'Go-Karting', icon: '🏎️' },
        { name: 'Cooking', icon: '🍳' },
        { name: 'Reading', icon: '📚' },
        { name: 'Fitness', icon: '💪' }
    ];

    // Interaktives Partikel-System
    function createParticle(x, y) {
        return {
            x,
            y,
            size: Math.random() * 4 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            life: 100,
            color: `rgba(125, 170, 98, ${Math.random() * 0.5 + 0.2})` // Variationen der Akzentfarbe
        };
    }
    
    function updateParticles() {
        // Bewege Partikel
        particles = particles.map(p => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            life: p.life - 1
        })).filter(p => p.life > 0);
        
        // Zeichne Partikel
        if (particleContainer) {
            const ctx = particleContainer.getContext('2d');
            ctx.clearRect(0, 0, particleContainer.width, particleContainer.height);
            
            particles.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        // Rufe nächsten Frame auf
        requestAnimationFrame(updateParticles);
    }
    
    function handleMouseMove(event) {
        // Position für den globalen Cursor-Follower aktualisieren
        mouseX = event.clientX;
        mouseY = event.clientY;
        
        // Springs mit neuer Position aktualisieren
        cursorPosition.set({ x: mouseX, y: mouseY });
        cursorPositionDelayed.set({ x: mouseX, y: mouseY });
        
        // Mache Cursor sichtbar, sobald Maus bewegt wird
        isCursorVisible = true;
        
        // Partikel an Mausposition erzeugen
        if (Math.random() > 0.7) {
            particles.push(createParticle(mouseX, mouseY));
        }
    }
    
    // Cursor-Effekt bei Mausklick
    function handleMouseDown() {
        // Cursor verkleinern beim Klicken
        cursorScale.set(0.7);
        cursorVariation = 'click';
        setTimeout(() => cursorVariation = 'default', 300);
    }
    
    function handleMouseUp() {
        // Cursor zur normalen Größe zurückkehren
        cursorScale.set(1.2);
        setTimeout(() => cursorScale.set(1), 150);
    }
    
    // Card Flip Effekt für Tool-Karten
    let flippedCard = null;
    
    function flipCard(index) {
        flippedCard = flippedCard === index ? null : index;
    }

    onMount(() => {
        // Canvas für Partikel-Animation initialisieren
        if (particleContainer) {
            particleContainer.width = window.innerWidth;
            particleContainer.height = window.innerHeight;
            requestAnimationFrame(updateParticles);
        }
        
        // Stelle sicher, dass Scrollen auf dieser Seite funktioniert
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        
        // Event-Listener für Window-Resize
        const handleResize = () => {
            if (particleContainer) {
                particleContainer.width = window.innerWidth;
                particleContainer.height = window.innerHeight;
            }
        };
        
        window.addEventListener('resize', handleResize);
        
        // Globales Mausevent hinzufügen
        document.addEventListener('mousemove', handleMouseMove);
        
        // Zusätzliche Event-Listener für Maus-Interaktionen
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    });
    
    // Neue Funktion für die statische Navigation
    function goBackToStatic() {
        console.log('Back to static page');
        goto('/static'); // Direkter Link zurück zur statischen Hauptseite
    }

    // Funktion zur Aktualisierung der Mausposition innerhalb der Karte
    function updateHobbyGlow(event, index) {
        hoveredHobby = index;
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    }
    
    // Funktion um den Hover zu beenden
    function endHobbyHover() {
        hoveredHobby = null;
    }
    
    // Alternative zum Card-Flip für Tools
    function handleToolHover(index, isHovering) {
        // Diese Variable wird für Animation verwendet
    }

// Formular-Variablen
let formName = '';
let formEmail = '';
let formMessage = '';

// Funktion zum Absenden des Formulars
function handleFormSubmit() {
    // E-Mail-Subject erstellen
    const subject = `Message from ${formName} via Portfolio`;
    
    // E-Mail-Body erstellen
    const body = `Name: ${formName}\nEmail: ${formEmail}\n\nMessage:\n${formMessage}`;
    
    // mailto-Link erstellen und öffnen
    const mailtoLink = `mailto:franzanhaeupl@web.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    // Formular zurücksetzen
    formName = '';
    formEmail = '';
    formMessage = '';
}
</script>

<!-- Canvas für Partikel-Hintergrund - von pointer-events:none zu auto geändert -->
<canvas 
    bind:this={particleContainer} 
    class="particle-canvas"
    on:mousemove={handleMouseMove}
></canvas>

<!-- Vereinfachter Cursor-Follower: Nur ein simpler Kreis -->
<div 
    class="cursor-follower {isCursorVisible ? 'visible' : ''} {cursorVariation}"
    style="transform: translate({$cursorPosition.x}px, {$cursorPosition.y}px) scale({$cursorScale})"
></div>

<!-- Haupt-Container -->
<div class="scroll-container">
    <div class="content-wrapper">
        <!-- Top-Navigationsbereich mit Zurück-Button -->
        <div class="top-section">
            <div class="back-btn-container">
                <button on:click={goBackToStatic}>
                    <img src="/leftArrow.png" alt="Back arrow" />
                    Back
                </button>
            </div>
            
            <!-- Hauptüberschrift -->
            <div class="heading-container">
                <h1>About Me</h1>
            </div>
            
            <!-- Intro-Text -->
            <FadeInSection>
                <div class="intro-text">
                    <p>
                        I'm a designer working at the intersection of design and technology.
                        My passion lies in the interplay between UI/UX and programming various systems —
                        from web design to data visualizations to user research interactions.
                        Innovation and keeping up with new technologies are essential to me
                        for developing contemporary interaction concepts.
                    </p>
                </div>
            </FadeInSection>
        </div>
        
        <!-- Kategorie-Tabs -->
        <div class="category-tabs">
            <button 
                class="tab-button {activeCategory === 'about' ? 'active' : ''}" 
                on:click={() => activeCategory = 'about'}
            >
                About Me
            </button>
            <button 
                class="tab-button {activeCategory === 'journey' ? 'active' : ''}" 
                on:click={() => activeCategory = 'journey'}
            >
                Journey
            </button>
            <button 
                class="tab-button {activeCategory === 'tools' ? 'active' : ''}" 
                on:click={() => activeCategory = 'tools'}
            >
                Toolbox
            </button>
            <button 
                class="tab-button {activeCategory === 'tech' ? 'active' : ''}" 
                on:click={() => activeCategory = 'tech'}
            >
                Tech Stack
            </button>
        </div>
        
        <!-- Content-Bereich abhängig vom ausgewählten Tab -->
        {#if activeCategory === 'about'}
            <div class="content-section" in:fade={{duration: 300, delay: 200}}>
                <div class="glass-card">
                    <FadeInSection>
                        <div class="about-grid">
                            <div class="about-text">
                                <h3>My Approach</h3>
                                <p>
                                    I live in the digital world and always stay at the pulse of time.
                                    This timeliness reflects in my approach to interaction design.
                                    I don't see design as an isolated discipline, but as an integrated system
                                    that aligns users, technology, and context.
                                </p>
                            </div>
                            
                            <div class="hobbies-section">
                                <h3>How I Recharge My Creativity</h3>
                                <div class="hobbies-grid">
                                    {#each hobbies as hobby, i}
                                        <div 
                                            class="hobby-item {hoveredHobby === i ? 'hovered' : ''}"
                                            on:mousemove={(event) => updateHobbyGlow(event, i)}
                                            on:mouseleave={endHobbyHover}
                                            role="presentation"
                                            aria-label="{hobby.name} hobby"
                                        >
                                            <div 
                                                class="hobby-glow" 
                                                style={hoveredHobby === i ? `transform: translate(${mouseX - 50}px, ${mouseY - 50}px)` : ''}
                                            ></div>
                                            <div class="hobby-content">
                                                <div class="hobby-icon">{hobby.icon}</div>
                                                <div class="hobby-name">{hobby.name}</div>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </div>
        {:else if activeCategory === 'journey'}
            <div class="content-section" in:fade={{duration: 300, delay: 200}}>
                <div class="glass-card">
                    <FadeInSection>
                        <div class="timeline-container">
                            <h3>My Journey</h3>
                            <div class="timeline">
                                {#each timeline as item, i}
                                    <div class="timeline-entry" style="animation-delay: {100 * i}ms">
                                        <div class="timeline-dot"></div>
                                        <div class="timeline-content">
                                            <div class="timeline-year">{item.year}</div>
                                            <div class="timeline-title">{item.title}</div>
                                            <div class="timeline-location">{item.location}</div>
                                            <div class="timeline-description">{item.description}</div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </div>
        {:else if activeCategory === 'tools'}
            <div class="content-section" in:fade={{duration: 300, delay: 200}}>
                <div class="glass-card">
                    <FadeInSection>
                        <div class="tools-container">
                            <h3>My Digital Workbench</h3>
                            <p class="tools-intro">
                                These tools and technologies I use in my daily work.
                                From design to development to prototyping.
                            </p>
                            <div class="tools-grid">
                                {#each tools as tool, i}
                                    <div class="tool-item">
                                        <div class="tool-content">
                                            <div class="tool-name">{tool.name}</div>
                                            <div class="tool-divider"></div>
                                            <div class="tool-category">{tool.category}</div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </div>
        {:else if activeCategory === 'tech'}
            <div class="content-section" in:fade={{duration: 300, delay: 200}}>
                <div class="glass-card">
                    <FadeInSection>
                        <div class="tech-container">
                            <h3>AI Models & Development Stack</h3>
                            <p class="tools-intro">
                                At the AiD-lab, I work primarily with AI technologies and these development tools
                                to create innovative interaction concepts and solutions.
                            </p>
                            <div class="tech-grid">
                                {#each techStack as tech, i}
                                    <div class="tech-item">
                                        <div class="tech-name">{tech.name}</div>
                                        <div class="tech-category">{tech.category}</div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </div>
        {/if}

        <!-- Contact Section - Direkt unterhalb des Content-Bereichs, aber vor dem Footer -->
        <div class="contact-section">
            <div class="glass-card">
                <FadeInSection>
                    <div class="contact-container">
                        <p class="contact-intro">
                            I'm currently looking for internship opportunities in interaction design and UX/UI. 
                            If you have a position available or would like to collaborate on a project, 
                            don't hesitate to reach out. I'm always open to new challenges and experiences.
                        </p>
                        
                        <form class="contact-form" on:submit|preventDefault={handleFormSubmit}>
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    bind:value={formName} 
                                    required 
                                    placeholder="Your name"
                                />
                            </div>

                            <div class="form-group">
                                <label for="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    bind:value={formEmail} 
                                    required 
                                    placeholder="Your email address"
                                />
                            </div>
                            
                            <div class="form-group full-width">
                                <label for="message">Message</label>
                                <textarea 
                                    id="message" 
                                    bind:value={formMessage} 
                                    rows="5" 
                                    required 
                                    placeholder="Your message here..."
                                ></textarea>
                            </div>
                            
                            <button type="submit" class="submit-button">
                                <span class="button-text">Send Message</span>
                                <span class="button-icon">→</span>
                            </button>
                        </form>
                        
                        <div class="form-divider">
                            <span>or</span>
                        </div>
                        
                        <a href="mailto:franzanhaeupl@web.de" class="email-button">
                            <span class="button-text">Send me a direct email</span>
                            <span class="button-icon">→</span>
                        </a>
                    </div>
                </FadeInSection>
            </div>
        </div>

        <!-- Footer -->
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
    
    /* Grundlegende Styles */
    .scroll-container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        position: relative;
        z-index: 1;
    }
  
    .content-wrapper {
        width: 92%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 4rem 4rem;
        position: relative;
        z-index: 2;
    }
    
    /* Partikeleffekt und interaktiver Cursor */
    .particle-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
    }
    
    /* Vereinfachter Cursor-Follower Style */
    .cursor-follower {
        position: fixed;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1.5px solid rgba(125, 170, 98, 0.9);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .cursor-follower.visible {
        opacity: 1;
    }
    
    /* Cursor-Variation für Klicks */
    .cursor-follower.click {
        border-color: white;
        background: rgba(125, 170, 98, 0.15);
    }
  
    /* Top-Section styling */
    .top-section {
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-bottom: 4rem;
    }
  
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
  
    .back-btn-container button img {
        height: 1.2em;
        width: auto;
    }
  
    .heading-container {
        width: 100%;
        margin-bottom: 2rem;
    }
  
    .heading-container h1 {
        width: 100%;
        text-align: left;
        font-size: 6rem;
        margin: 0;
        padding: 0.5rem 0;
        font-family: 'Franz-Grotesk', sans-serif;
        color: #7DAA62;
        letter-spacing: 0.1rem;
    }
    
    .intro-text {
        max-width: 800px;
        margin-bottom: 2rem;
    }
    
    .intro-text p {
        font-family: 'Franz-Grotesk', sans-serif;
        font-size: 1.5rem;
        line-height: 1.6;
        color: white;
    }
    
    /* Kategorie-Tabs */
    .category-tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }
    
    .tab-button {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        font-family: 'Franz-Plex', mono;
        padding: 1rem 2rem;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .tab-button.active {
        background: rgba(125, 170, 98, 0.2);
        border-color: #7DAA62;
    }
    
    .tab-button:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-3px);
    }
    
    /* Content-Bereich */
    .content-section {
        margin-bottom: 4rem;
    }
    
    .glass-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 2.5rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    h3 {
        font-family: 'Franz-Plex', mono;
        color: #7DAA62;
        font-size: 1.8rem;
        margin-top: 0;
        margin-bottom: 1.5rem;
    }
    
    p {
        font-family: 'Franz-Plex', mono;
        color: white;
        line-height: 1.6;
        font-size: 1.2rem;
    }
    
    /* About Grid */
    .about-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
    }
    
    .about-text p {
        margin-bottom: 1.5rem;
    }
    
    /* Hobbies Bereich */
    .hobbies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1.5rem;
    }
    
    .hobby-item {
        position: relative;
        height: 150px;
        background: rgba(255, 255, 255, 0.07);
        backdrop-filter: blur(8px);
        border-radius: 12px;
        padding: 1.5rem 1rem;
        overflow: hidden;
        transition: transform 0.4s ease, box-shadow 0.4s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .hobby-item.hovered {
        transform: translateY(-8px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(125, 170, 98, 0.3);
    }
    
    .hobby-glow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(125, 170, 98, 0.3) 0%, rgba(125, 170, 98, 0) 70%);
        border-radius: 50%;
        filter: blur(15px);
        opacity: 0;
        transform: translate(-50px, -50px);
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 0;
    }
    
    .hobby-item.hovered .hobby-glow {
        opacity: 1;
    }
    
    .hobby-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
    }
    
    .hobby-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        transition: transform 0.3s ease;
    }
    
    .hobby-item.hovered .hobby-icon {
        transform: scale(1.2);
    }
    
    .hobby-name {
        font-family: 'Franz-Grotesk', sans-serif;
        color: white;
        text-align: center;
        font-size: 1rem;
        transition: color 0.3s ease;
    }
    
    .hobby-item.hovered .hobby-name {
        color: #7DAA62;
    }
    
    /* Timeline Styling */
    .timeline {
        position: relative;
        padding-left: 2.5rem;
    }
    
    .timeline:before {
        content: '';
        position: absolute;
        left: 0.85rem;
        top: 0;
        bottom: 0;
        width: 1px;
        background: rgba(255, 255, 255, 0.2);
    }
    
    .timeline-entry {
        position: relative;
        margin-bottom: 2.5rem;
        animation: slideIn 0.5s ease forwards;
        opacity: 0;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(-20px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .timeline-dot {
        position: absolute;
        left: -2.5rem;
        top: 0.5rem;
        width: 16px;
        height: 16px;
        background: #7DAA62;
        border-radius: 50%;
        border: 3px solid rgba(0, 0, 0, 0.3);
    }
    
    .timeline-content {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(5px);
        padding: 1.5rem;
        border-radius: 12px;
        border-left: 3px solid #7DAA62;
        transition: transform 0.3s ease;
    }
    
    .timeline-entry:hover .timeline-content {
        transform: translateX(10px);
    }
    
    .timeline-year {
        font-family: 'Franz-Plex', mono;
        color: #7DAA62;
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }
    
    .timeline-title {
        font-family: 'Franz-Grotesk', sans-serif;
        color: white;
        font-size: 1.3rem;
        font-weight: bold;
        margin-bottom: 0.3rem;
    }
    
    .timeline-location {
        font-family: 'Franz-Plex', mono;
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
        margin-bottom: 0.8rem;
    }
    
    .timeline-description {
        font-family: 'Franz-Grotesk', sans-serif;
        color: white;
        font-size: 1rem;
    }
    
    /* Tools Grid */
    .tools-intro {
        margin-bottom: 2rem;
        max-width: 800px;
    }
    
    .tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1.5rem;
    }
    
    .tool-item {
        background: rgba(255, 255, 255, 0.07);
        border-radius: 12px;
        height: 150px;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border-left: 3px solid rgba(125, 170, 98, 0.2);
        overflow: hidden;
        position: relative;
    }
    
    .tool-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 50%
        );
        opacity: 0;
        transition: opacity 0.4s ease;
    }
    
    .tool-item:hover {
        transform: translateY(-10px) scale(1.03);
        box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
        border-left: 3px solid #7DAA62;
        background: rgba(255, 255, 255, 0.1);
    }
    
    .tool-item:hover::before {
        opacity: 1;
    }
    
    .tool-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding: 1.5rem;
        position: relative;
        z-index: 1;
    }
    
    .tool-name {
        font-family: 'Franz-Plex', mono;
        color: white;
        font-size: 1.3rem;
        margin-bottom: 1rem;
        transition: color 0.3s ease;
    }
    
    .tool-item:hover .tool-name {
        color: #7DAA62;
    }
    
    .tool-divider {
        width: 0;
        height: 2px;
        background: #7DAA62;
        margin-bottom: 1rem;
        transition: width 0.4s ease;
    }
    
    .tool-item:hover .tool-divider {
        width: 50px;
    }
    
    .tool-category {
        font-family: 'Franz-Grotesk', sans-serif;
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.4s ease, transform 0.4s ease, color 0.3s ease;
    }
    
    .tool-item:hover .tool-category {
        opacity: 1;
        transform: translateY(0);
        color: rgba(255, 255, 255, 0.8);
    }
    
    /* Tech Stack Grid */
    .tech-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .tech-item {
        background: rgba(255, 255, 255, 0.07);
        border-radius: 12px;
        padding: 1.2rem 1.5rem;
        transition: all 0.3s ease;
        border-left: 3px solid rgba(125, 170, 98, 0.4);
    }
    
    .tech-item:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.1);
        border-left: 3px solid #7DAA62;
    }
    
    .tech-name {
        font-family: 'Franz-Plex', mono;
        color: #7DAA62;
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
    }
    
    .tech-category {
        font-family: 'Franz-Grotesk', sans-serif;
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
    }
    
    /* Kontaktformular Styles */
    .contact-section {
        margin: 6rem 0 4rem 0;
        position: relative;
    }

    .contact-section:before {
        content: '';
        position: absolute;
        top: -3rem;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        max-width: 400px;
        height: 1px;
        background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
    }

    .contact-container {
        max-width: 800px;
        margin: 0 auto;
    }

    .contact-intro {
        margin-bottom: 2.5rem;
        color: rgba(255, 255, 255, 0.8);
        width: 100%;
        max-width: 600px; /* Gleiche Breite wie das Formular */
    }

    .email-button {
        background: rgba(125, 170, 98, 0.2);
        border: 1px solid #7DAA62;
        color: white;
        font-family: 'Franz-Plex', mono;
        padding: 1rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
        text-decoration: none;
        width: fit-content;
    }

    .email-button:hover {
        background: rgba(125, 170, 98, 0.3);
        transform: translateY(-3px);
    }

    /* Kontaktformular Styles erweitern */
    .contact-form {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
        width: 100%;
        max-width: 600px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .form-group label {
        font-family: 'Franz-Plex', mono;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
    }

    .form-group input,
    .form-group textarea {
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 1rem;
        color: white;
        font-family: 'Franz-Grotesk', sans-serif;
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #7DAA62;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 0 0 2px rgba(125, 170, 98, 0.1);
    }

    .form-group input::placeholder,
    .form-group textarea::placeholder {
        color: rgba(255, 255, 255, 0.3);
    }

    .submit-button {
        background: rgba(125, 170, 98, 0.2);
        border: 1px solid #7DAA62;
        color: white;
        font-family: 'Franz-Plex', mono;
        padding: 1rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        width: 100%;
    }

    .submit-button:hover {
        background: rgba(125, 170, 98, 0.3);
        transform: translateY(-3px);
    }

    .form-divider {
        display: flex;
        align-items: center;
        margin: 2rem 0;
        width: 100%;
        max-width: 600px;
    }

    .form-divider::before,
    .form-divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
    }

    .form-divider span {
        padding: 0 1rem;
        color: rgba(255, 255, 255, 0.5);
        font-family: 'Franz-Plex', mono;
        font-size: 0.9rem;
    }

    /* Responsive Anpassungen für das Formular */
    @media (max-width: 768px) {
        .contact-form {
            grid-template-columns: 1fr;
        }
        
        .form-group.full-width {
            grid-column: span 1;
        }
        
        .submit-button {
            grid-column: span 1;
        }
        
        .contact-section {
            margin: 4rem 0 3rem 0;
        }
    }

    /* Responsive Design */
    @media (max-width: 968px) {
        .about-grid {
            grid-template-columns: 1fr;
        }
        
        .heading-container h1 {
            font-size: 4rem;
        }
        
        .intro-text p {
            font-size: 1.3rem;
        }
    }
    
    @media (max-width: 768px) {
        .content-wrapper {
            padding: 2rem 1.5rem;
            width: 95%;
        }
        
        .heading-container h1 {
            font-size: 3rem;
        }
        
        .category-tabs {
            flex-direction: column;
        }
        
        .tab-button {
            width: 100%;
        }
        
        .tools-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        }
        
        .tech-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        }
    }
    
    /* Hier den fehlenden Responsive Breakpoint ergänzen */
    @media (max-width: 480px) {
        .heading-container h1 {
            font-size: 2.5rem;
        }
        
        .glass-card {
            padding: 1.5rem;
        }
        
        .intro-text p {
            font-size: 1.1rem;
        }
        
        .hobbies-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 1rem;
        }
        
        .tech-grid {
            grid-template-columns: 1fr;
        }
        
        .tech-item {
            padding: 1rem;
        }
        
        .tech-name {
            font-size: 1rem;
        }
        
        .tool-card {
            height: 120px;
        }
        
        .timeline-content {
            padding: 1rem;
        }
    }
</style>