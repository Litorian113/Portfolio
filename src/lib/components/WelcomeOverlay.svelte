<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  export let onComplete = (useStatic) => {}; 
  export let loadingProgress = 0;
  
  let animationComplete = true;
  let words = ['scroll', 'hover', 'click'];
  let currentWord = 0;
  let timer;
  let showEnterButtons = false;
  
  // Browser-Erkennung verbessern
  let isCompatibleBrowser = false;
  let browserWarning = "";
  
  onMount(() => {
    // Verbesserte Browser-Erkennung für Chrome
    const isChrome = /Chrome/.test(navigator.userAgent) && 
                    !/Edg|Edge|OPR|Opera|Firefox/i.test(navigator.userAgent);
    const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    // Beide Bedingungen müssen erfüllt sein
    isCompatibleBrowser = isChrome && isDesktop;
    
    console.log("Browser-Erkennung:", { 
      userAgent: navigator.userAgent, 
      isChrome, 
      isDesktop, 
      isCompatibleBrowser 
    });
    
    // Warnungstext basierend auf Erkennung
    if (!isChrome && !isDesktop) {
      browserWarning = "Use Google Chrome on desktop for best 3D experience";
    } else if (!isChrome) {
      browserWarning = "Google Chrome is required for 3D experience";
    } else if (!isDesktop) {
      browserWarning = "Desktop is required for 3D experience";
    }
    
    // Rest des onMount-Codes bleibt unverändert
    timer = setInterval(() => {
      currentWord = (currentWord + 1) % words.length;
    }, 1500);
    
    setTimeout(() => {
      if (loadingProgress >= 100) {
        showEnterButtons = true;
      }
    }, 5000);
    
    return () => clearInterval(timer);
  });
  
  // Reaktive Statements bleiben gleich
  $: if (loadingProgress >= 100 && !showEnterButtons && animationComplete) {
    setTimeout(() => {
      showEnterButtons = true;
    }, 1000);
  }
  
  function handle3DEnter() {
    if (!isCompatibleBrowser) return; // Extra Sicherheit
    
    animationComplete = false;
    setTimeout(() => {
      onComplete(false); // 3D-Version
    }, 500);
  }
  
  function handleStaticEnter() {
    // Direkt zur statischen Version navigieren
    window.location.href = "/static";
  }
</script>

<div class="overlay" class:fade-out={!animationComplete} transition:fade={{ duration: 200 }}>
  <div class="content">
    <h1>Welcome to my Portfolio</h1>
    
    <div class="loading-container">
      <div class="word-container">
        <span class="action-word">{words[currentWord]}</span>
      </div>
      
      <div class="progress-bar">
        <div class="progress-fill" style="width: {loadingProgress}%"></div>
      </div>
      
      <div class="loading-status">
        {loadingProgress < 100 ? 'Loading assets...' : 'Ready!'}
      </div>
    </div>
    
    {#if showEnterButtons}
      <div class="buttons-container" in:fly={{ y: 20, duration: 500 }}>
        <!-- Dynamische Reihenfolge der Buttons basierend auf Browser-Kompatibilität -->
        {#if isCompatibleBrowser}
          <!-- Kompatibel: 3D zuerst -->
          <button class="enter-button primary" on:click={handle3DEnter}>
            Enter 3D Experience
          </button>
          
          <button class="enter-button secondary" on:click={handleStaticEnter}>
            Use Static Version
          </button>
        {:else}
          <!-- Nicht kompatibel: Static zuerst -->
          <button class="enter-button primary" on:click={handleStaticEnter}>
            Use Static Version
          </button>
          
          <button 
            class="enter-button secondary disabled" 
            on:click|preventDefault
            disabled={true}
            title="Google Chrome on desktop required for 3D experience"
          >
            Enter 3D Experience
          </button>
          
          <!-- Browser-Warnung immer anzeigen, wenn nicht kompatibel -->
          <div class="browser-warning">
            {browserWarning}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  /* Bestehende Styles beibehalten... */
  
  /* Neue Styles für Warnung und disabled Button */
  .browser-warning {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 8px;
    font-style: italic;
  }
  
  .enter-button.disabled,
  .enter-button[disabled] {
    opacity: 0.5;
    cursor: not-allowed !important;
    border-color: rgba(255, 255, 255, 0.3);
    position: relative;
  }
  
  .enter-button.disabled:hover,
  .enter-button[disabled]:hover {
    transform: none;
    background: transparent;
  }
  
  /* Tooltip-Style für bessere UX */
  .enter-button.disabled:hover::after {
    content: "Google Chrome required";
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
  
  /* Die anderen bestehenden Styles bleiben unverändert */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(6, 0, 61, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    color: white;
    font-family: 'IBM Plex Mono', monospace;
    transition: opacity 0.5s ease;
  }
  
  .fade-out {
    opacity: 0;
    pointer-events: none;
  }
  
  .content {
    text-align: center;
    max-width: 500px;
    padding: 2rem;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    letter-spacing: -0.5px;
  }
  
  .loading-container {
    margin-bottom: 3rem;
  }
  
  .word-container {
    height: 40px;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .action-word {
    font-size: 1.8rem;
    font-weight: 500;
    display: inline-block;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; transform: scale(0.98); }
    50% { opacity: 1; transform: scale(1.02); }
    100% { opacity: 0.6; transform: scale(0.98); }
  }
  
  .progress-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto;
    width: 100%;
  }
  
  .progress-fill {
    height: 100%;
    background: white;
    transition: width 0.3s ease;
  }
  
  .loading-status {
    margin-top: 1rem;
    font-size: 14px;
    opacity: 0.7;
  }
  
  .buttons-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 2rem;
  }
  
  .enter-button {
    background: transparent;
    color: white;
    border: 2px solid white;
    padding: 0.8rem 2rem;
    font-size: 1.2rem;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 1px;
    width: 100%;
  }
  
  .enter-button.primary {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .enter-button.secondary {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.5);
    font-size: 1rem;
  }
  
  .enter-button:hover {
    transform: translateY(-2px);
  }
  
  .enter-button.primary:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .enter-button.secondary:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  button {
    background: transparent;
    color: white;
    border: 2px solid white;
    padding: 0.8rem 3rem;
    font-size: 1.2rem;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 2rem;
    letter-spacing: 1px;
  }
  
  button:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
</style>