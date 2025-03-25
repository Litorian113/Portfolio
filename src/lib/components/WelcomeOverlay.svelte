<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  export let onComplete = () => {}; // Callback wenn Benutzer fortfährt
  
  let animationComplete = true;
  let words = ['scroll', 'hover', 'click'];
  let currentWord = 0;
  let timer;
  
  onMount(() => {
    // Wort-Animation starten
    timer = setInterval(() => {
      currentWord = (currentWord + 1) % words.length;
    }, 1500);
    
    // Nach 5 Sekunden das Overlay ausblenden
    setTimeout(() => {
      animationComplete = false;
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 5000);
    
    return () => clearInterval(timer);
  });
</script>

<div class="overlay" class:fade-out={!animationComplete} transition:fade={{ duration: 200 }}>
  <div class="content">
    <h1>Welcome to my Portfolio</h1>
    
    <div class="loading-container">
      <div class="word-container">
        <span class="action-word">{words[currentWord]}</span>
      </div>
      
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
    </div>
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
    width: 0%;
    animation: fill 5s linear forwards;
  }
  
  @keyframes fill {
    0% { width: 0%; }
    100% { width: 100%; }
  }
</style>