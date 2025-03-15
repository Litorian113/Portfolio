<script>
    // Props für die Navigation
    export let currentSection = 'intro';
    
    // Funktion zum Navigieren wird als Prop übergeben
    export let navigateTo;
</script>

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

<style>
    /* ===== DESKTOP STYLES ===== */
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
    
    /* Text-Varianten */
    .short-text {
        display: none;
    }
    
    .full-text {
        display: inline;
    }
    
    /* ===== MOBILE STYLES (768px und kleiner) ===== */
    @media (max-width: 768px) {
        /* Positionierung und Layout */
        .side-navigation {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            top: auto;
            transform: none;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            padding: 15px 10px;
            z-index: 100;
        }
        
        /* Horizontale Anordnung der Buttons */
        .side-navigation ul {
            flex-direction: row;
            gap: 12px;
            padding: 0;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
        }
        
        /* Button-Styling */
        .side-navigation button {
            width: 100%;
            min-width: unset;
            height: 60px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            background: rgba(0, 0, 0, 0.5);
            border-radius: 6px;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            text-align: center;
            transform: none;
        }
        
        /* Hover und aktive Zustände */
        .side-navigation button:hover,
        .side-navigation button.active {
            transform: none;
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
            color: white;
        }
        
        /* Text-Anzeige umkehren */
        .short-text {
            display: inline;
            font-size: 14px;
            margin: 0;
            white-space: nowrap;
            text-align: center;
        }
        
        .full-text {
            display: none;
            position: absolute;
            visibility: hidden;
        }
    }
    
    /* ===== EXTRA KLEINE BILDSCHIRME (360px und kleiner) ===== */
    @media (max-width: 360px) {
        .side-navigation button {
            height: 50px;
        }
        
        .short-text {
            font-size: 12px;
        }
    }
    
    /* ===== SAFE AREA UNTERSTÜTZUNG (für iPhones mit Notch/Dynamic Island) ===== */
    @supports (padding-bottom: env(safe-area-inset-bottom)) {
        @media (max-width: 768px) {
            .side-navigation {
                padding-bottom: calc(12px + env(safe-area-inset-bottom));
            }
        }
    }
</style>