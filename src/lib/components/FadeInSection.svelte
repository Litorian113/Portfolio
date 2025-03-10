<script>
  import { onMount } from 'svelte';
  
  let sectionRef;
  let isVisible = false;
  
  onMount(() => {
    // Nutze IntersectionObserver statt Scroll-Events
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Nur einmal triggern, wenn Element sichtbar wird
        if (entry.isIntersecting && !isVisible) {
          isVisible = true;
          // Nach Animation entfernen, um Ressourcen zu sparen
          setTimeout(() => observer.unobserve(sectionRef), 1000);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
      }
    );
    
    observer.observe(sectionRef);
    
    return () => {
      observer.disconnect();
    };
  });
</script>

<div 
  bind:this={sectionRef} 
  class="fade-section" 
  class:visible={isVisible}
>
  <slot></slot>
</div>

<style>
  .fade-section {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    will-change: opacity, transform;
  }
  
  .visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>
