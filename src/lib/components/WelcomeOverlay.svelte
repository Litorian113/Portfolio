<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  export let onComplete = (useStatic) => {}; // Erweitert um Parameter für Version
  export let loadingProgress = 0;
  
  let animationComplete = true;
  let words = ['scroll', 'hover', 'click'];
  let currentWord = 0;
  let timer;
  let showEnterButtons = false;
  
  onMount(() => {
    // Wort-Animation starten
    timer = setInterval(() => {
      currentWord = (currentWord + 1) % words.length;
    }, 1500);
    
    // Nach 5 Sekunden die Buttons anzeigen (wenn alles geladen ist)
    setTimeout(() => {
      if (loadingProgress >= 100) {
        showEnterButtons = true;
      }
    }, 5000);
    
    return () => clearInterval(timer);
  });
  
  // Reaktiv: Wenn der Ladefortschritt 100% erreicht, Buttons anzeigen
  $: if (loadingProgress >= 100 && !showEnterButtons && animationComplete) {
    setTimeout(() => {
      showEnterButtons = true;
    }, 1000);
  }
  
  function handle3DEnter() {
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
        <button class="enter-button primary" on:click={handle3DEnter}>
          Enter 3D Experience
        </button>
        <button class="enter-button secondary" on:click={handleStaticEnter}>
          Use Static Version
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
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