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
            right: 10px;
            top: 20px; /* Statt 50% - jetzt oben */
            transform: none; /* translateY(-50%) entfernen */
        }
        
        .side-navigation ul {
            gap: 8px;
        }
        
        .side-navigation button {
            padding: 10px 12px;
            width: 80px; /* Feste Breite für alle Buttons */
            text-align: center;
        }
        
        .short-text {
            display: inline;
        }
        
        .full-text {
            display: none;
        }
    }
    
    /* Extra-kleine Bildschirme */
    @media (max-width: 360px) {
        .side-navigation {
            right: 5px;
            top: 15px; /* Etwas näher am oberen Rand für sehr kleine Bildschirme */
        }
        
        .side-navigation button {
            padding: 8px 8px;
            width: 70px; /* Etwas schmaler aber immer noch einheitlich */
            font-size: 14px;
        }
    }
    
    /* Stärkeres Highlight für den aktiven Button auf mobilen Geräten */
    @media (max-width: 768px) {
        .side-navigation button.active {
            background: rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
        }
    }
</style>
