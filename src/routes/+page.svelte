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
                    Design Work
                </button>
            </li>
            <li>
                <button 
                    class:active={currentSection === 'code-data'} 
                    on:click={() => navigateTo('code-data')}
                >
                    Code & Data
                </button>
            </li>
            <li>
                <button 
                    class:active={currentSection === 'website-projects'} 
                    on:click={() => navigateTo('website-projects')}
                >
                    Website Projects
                </button>
            </li>
            <li>
                <button 
                    class:active={currentSection === 'photo-video'} 
                    on:click={() => navigateTo('photo-video')}
                >
                    Photo & Video
                </button>
            </li>
            <li>
                <button 
                    class:active={currentSection === 'about-me'} 
                    on:click={() => navigateTo('about-me')}
                >
                    About me
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
</style>
