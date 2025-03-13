<!-- src/routes/+page.svelte -->
<script context="module">
    export async function load({ url }) {
      return {
        cx: Number(url.searchParams.get('cx')) || 0,
        cy: Number(url.searchParams.get('cy')) || 0,
        cz: Number(url.searchParams.get('cz')) || 20
      };
    }
</script>

<script>
    export let cx;
    export let cy;
    export let cz;
    import Stage from '$lib/Stage.svelte';
    
    let stageComponent;
    let currentSection = 'intro';

    // Funktion, die die exportierte Navigationsfunktion der Stage-Komponente aufruft
    function navigateTo(sectionId) {
        if (stageComponent && typeof stageComponent.navigateToSection === 'function') {
            stageComponent.navigateToSection(sectionId);
        }
    }
</script>
  
<div class="header-text">
    <div class="default-text">
        <span class="copyright">©</span>
        <span class="code-by">Code by</span>
        <span class="franz">Franz</span>
    </div>
    <div class="hover-text">
        <span class="copyright">©</span>
        <span class="franz">Franz</span>
        <span class="anhaupl">Anhäupl</span>
    </div>
</div>

<div class="app">
    <Stage 
        bind:this={stageComponent} 
        {cx} {cy} {cz} 
        isMainPage={true}
        bind:currentSection={currentSection}  
    />
    
    <nav class="side-navigation">
        <ul>
            <li>
                <button 
                    class:active={currentSection === 'design-work'} 
                    on:click={() => navigateTo('design-work')}
                >
                    <span class="full-text">Design Work</span>
                    <span class="short-text">Design</span>
                </button>
            </li>
            <li>
                <button 
                    class:active={currentSection === 'code-data'} 
                    on:click={() => navigateTo('code-data')}
                >
                    <span class="full-text">Code & Data</span>
                    <span class="short-text">Code</span>
                </button>
            </li>
            <li>
                <button 
                    class:active={currentSection === 'website-projects'} 
                    on:click={() => navigateTo('website-projects')}
                >
                    <span class="full-text">Website Projects</span>
                    <span class="short-text">Website</span>
                </button>
            </li>
            <li>
                <button 
                    class:active={currentSection === 'photo-video'} 
                    on:click={() => navigateTo('photo-video')}
                >
                    <span class="full-text">Photo & Video</span>
                    <span class="short-text">Photo</span>
                </button>
            </li>
            <li>
                <button 
                    class:active={currentSection === 'about-me'} 
                    on:click={() => navigateTo('about-me')}
                >
                    <span class="full-text">About me</span>
                    <span class="short-text">Me</span>
                </button>
            </li>
        </ul>
    </nav>
</div>

<style>
    .app {
        position: relative;
        width: 100%;
        height: 100%;
    }
    
    .side-navigation {
        position: fixed;
        right: 40px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        display: flex;
        flex-direction: column;
    }
    
    .side-navigation ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .side-navigation button {
        background: rgba(0, 0, 0, 0.5);
        color: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 12px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'IBM Plex Mono', monospace;
        transition: all 0.3s ease;
        width: 200px;
        text-align: left;
    }
    
    .side-navigation button:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.6);
        color: rgba(255, 255, 255, 0.9);
    }
    
    /* Stil für aktiven Navigationsbutton */
    .side-navigation button.active {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    
    .side-navigation button:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
    }
    
    /* Verbesserte Header-Text Styles */
    .header-text {
        position: fixed;
        top: 30px;
        left: 30px;
        z-index: 9999; 
        font-family: 'IBM Plex Mono', monospace;
        font-size: 16px;
        color: white;
        cursor: pointer;
        overflow: visible; /* Overflow auf visible ändern */
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        background: rgba(0, 0, 0, 0.3);
        padding: 8px 12px;
        border-radius: 4px;
        transform-style: flat; /* 3D-Transformationen zurücksetzen */
        transform: translateZ(0); /* Force GPU rendering und verhindert 3D-Skalierungsprobleme */
        backface-visibility: hidden; /* Verhindert Rendering-Probleme */
        perspective: none; /* Keine Perspektive für dieses Element */
        width: auto; /* Explizite Breite */
    }
    
    .default-text, .hover-text {
        position: absolute;
        top: 0;
        left: 0;
        white-space: nowrap;
        transition: all 0.5s ease;
        padding: 8px 0;
        transform-style: flat; /* Auch hier 3D-Transformationen zurücksetzen */
    }
    
    .hover-text {
        opacity: 0;
        transform: translateX(20px);
    }
    
    .header-text:hover .default-text {
        opacity: 0;
        transform: translateX(-20px);
    }
    
    .header-text:hover .hover-text {
        opacity: 1;
        transform: translateX(0);
    }
    
    /* Neue Styles für mobile Navigation */
    .short-text {
        display: none;
    }
    
    .full-text {
        display: inline;
    }
    
    /* Media Query für mobile Geräte anpassen */
    @media (max-width: 768px) {
        .side-navigation {
            right: -60px; /* Größtenteils außerhalb des Bildschirms */
            top: 50%;
            transform: translateY(-50%);
        }
        
        .side-navigation ul {
            gap: 10px;
        }
        
        .side-navigation button {
            padding: 12px;
            width: 100px;
            text-align: left;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-radius: 20px 0 0 20px; /* Abgerundete linke Seite für Bookmark-Look */
            padding-left: 15px;
            transition: all 0.3s ease;
            transform: translateX(0); /* Ausgangsposition */
        }
        
        /* Bei Hover oder aktiv den Button nach links schieben */
        .side-navigation button:hover,
        .side-navigation button.active {
            transform: translateX(-50px); /* Bei Hover oder aktiv weiter ins Sichtfeld schieben */
        }
        
        .short-text {
            display: inline;
            white-space: nowrap;
            font-size: 15px;
        }
        
        .full-text {
            display: none;
        }
    }
    
    /* Stärkeres Highlight für den aktiven Button auf mobilen Geräten */
    @media (max-width: 768px) {
        .side-navigation button.active {
            background: rgba(255, 255, 255, 0.3);
            box-shadow: -5px 0 15px rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.8);
        }
    }

    /* Extra-kleine Bildschirme */
    @media (max-width: 360px) {
        .side-navigation {
            right: -65px; /* Noch etwas weiter außerhalb */
        }
        
        .side-navigation button {
            padding: 10px;
            padding-left: 12px;
            width: 90px;
            font-size: 13px;
        }
        
        .side-navigation button:hover,
        .side-navigation button.active {
            transform: translateX(-55px); /* Bei kleineren Geräten weiter hereinziehen */
        }
    }
    
    /* Füge diese Media Query für die Header-Anpassung hinzu */
    @media (max-width: 768px) {
        .header-text {
            top: 15px;
            left: 15px;
            font-size: 14px;
            padding: 6px 10px;
        }
    }

    /* Für sehr kleine Bildschirme noch kompakter */
    @media (max-width: 360px) {
        .header-text {
            top: 10px;
            left: 10px;
            font-size: 13px;
            padding: 5px 8px;
        }
    }

    /* Neue Bottom-Navigation für Mobile */
    @media (max-width: 768px) {
        .side-navigation {
            /* Positionierung am unteren Bildschirmrand */
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            top: auto;
            transform: none;
            background: rgba(0, 0, 0, 0.7); /* Leicht transparenter Hintergrund */
            backdrop-filter: blur(10px); /* Glaseffekt (funktioniert auf modernen Browsern) */
            padding: 8px 0;
            z-index: 100;
        }
        
        .side-navigation ul {
            flex-direction: row; /* Horizontal anordnen statt vertikal */
            justify-content: space-around; /* Gleichmäßig verteilen */
            gap: 0;
            width: 100%;
            padding: 0 10px;
        }
        
        .side-navigation button {
            width: auto;
            border: none; /* Keine Umrandung */
            background: transparent;
            border-radius: 0;
            padding: 8px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 11px;
        }
        
        .side-navigation button:hover,
        .side-navigation button.active {
            transform: none;
            background: transparent;
            box-shadow: none;
        }
        
        .side-navigation button.active {
            color: #EFE4C6; /* Highlight-Farbe */
            position: relative;
        }
        
        /* Indikator für aktiven Tab */
        .side-navigation button.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 3px;
            background: #EFE4C6;
            border-radius: 2px;
        }
        
        /* Text-Anzeige für Mobile */
        .short-text {
            display: inline;
            white-space: nowrap;
            font-size: 12px;
            padding-top: 4px;
        }
        
        .full-text {
            display: none;
        }
    }

    /* Neue Bottom-Navigation für Mobile im Desktop-Stil */
    @media (max-width: 768px) {
        .side-navigation {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            top: auto;
            transform: none;
            background: rgba(0, 0, 0, 0.8); /* Dunklerer Hintergrund */
            backdrop-filter: blur(10px);
            padding: 12px 8px; /* Mehr Padding oben/unten */
            z-index: 100;
        }
        
        .side-navigation ul {
            flex-direction: row;
            justify-content: space-around;
            gap: 8px; /* Mehr Abstand zwischen den Buttons */
            width: 100%;
            padding: 0 5px;
        }
        
        .side-navigation button {
            /* Desktop-ähnlicheres Design */
            width: auto;
            min-width: 65px; /* Minimale Breite für Buttons */
            border: 1px solid rgba(255, 255, 255, 0.3);
            background: rgba(0, 0, 0, 0.5);
            border-radius: 5px; /* Leichte Abrundung ähnlich Desktop */
            padding: 10px 6px; /* Größere Buttons */
            margin: 0 2px; /* Zusätzlicher seitlicher Abstand */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        
        .side-navigation button:hover,
        .side-navigation button.active {
            transform: none;
            background: rgba(255, 255, 255, 0.2); /* Ähnlicher Hintergrund wie Desktop */
            border-color: rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.2); /* Desktop-ähnlicher Gloweffekt */
        }
        
        .side-navigation button.active {
            color: white; /* Weiß statt Beige, wie bei Desktop */
        }
        
        /* Entfernen des Indikator-Strichs für den aktiven Tab */
        .side-navigation button.active::after {
            display: none;
        }
        
        /* Größerer Text für Mobile */
        .short-text {
            display: inline;
            white-space: nowrap;
            font-size: 13px; /* Größere Schrift */
        }
        
        .full-text {
            display: none;
        }
    }

    /* Anpassung für kleinere Bildschirme */
    @media (max-width: 360px) {
        .side-navigation button {
            min-width: 55px; /* Etwas schmaler bei sehr kleinen Geräten */
            padding: 8px 4px;
        }
        
        .short-text {
            font-size: 12px;
        }
    }

    /* Kleine Anpassungen für iPhones mit "Safe Area" */
    @supports (padding-bottom: env(safe-area-inset-bottom)) {
        @media (max-width: 768px) {
            .side-navigation {
                padding-bottom: calc(12px + env(safe-area-inset-bottom));
            }
        }
    }
</style>

<!-- Im head-Tag hinzufügen für korrektes Mobile-Rendering -->
<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
</svelte:head>
